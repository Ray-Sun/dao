import { Feed, IFeed } from '../feed';
import { Schema, Model, Document, model,Types } from "mongoose";


export interface IFeedModel extends IFeed, Document { };

export class MongoFeed implements Feed {

    feedModel: Model<IFeedModel>;

    constructor() {
        let feedSchema: Schema = new Schema({
            name: String,
            source: String,
            url: String,
            coverPicture:String,
            description: String,
            pubDate: { type: Date, default: Date.now },
            expiredDate: Date,
        });

        this.feedModel = model<IFeedModel>("Feed", feedSchema);

    }

    addItems: any = async (items: IFeed[]) => {
        // let source = items[0].source;
        let pipe: any[] = [];
        let feeds: IFeed[] = [];
        // pipe.push({ $match: { 'source': source } });
        pipe.push({ $group: { _id: '$source', maxTime: { $max: "$pubDate" } } });
        await this.feedModel.aggregate(pipe, (err: any, result: any) => {
            if (result.length > 0) {
                let sourceNames:string[] = result.map((item:any)=>item._id);
                feeds = items.filter(item=>!sourceNames.includes(item.source));//for the first fetched source
                result.forEach((element:any) => {
                    feeds = [...feeds,...items.filter(item=>item.source==element._id&&item.pubDate > element.maxTime)];
                });
            } else {
                feeds = items;
            }
        });
        if (feeds.length > 0) {
            return this.feedModel.insertMany(feeds);
        } else {
            return Promise.resolve(feeds);
        }

    };

    getItems = (options: object = {}, getOptions: object = {}) => {
        return this.feedModel.find(options, getOptions);
    };

    getMatchedFeeds:any = async(startFeedId:string,tips:any[]) => {
        let matchedFeeds:{[key: string]:IFeed[]} = {};
        let updatedTips: { id: any; keywords: any; }[] = [];
        tips.forEach(tip => {
            // store different key for $text search
            /* orgin tips:
            tips = [
                { _id: 'a@a.com', keywords: ['phone', 'pillow free shipping', 'table'] },
                { _id: 'b@b.com', keywords: ['phone table','tv'] }
            ];
            updatedTips = [
                { _id: 'a@a.com', keywords: ['phone', '"pillow" "free" "shipping"'] },
                { _id: 'b@b.com', keywords: ['phone tv'] }
            ];*/
            let wordArray = '';
            let mutilWordArray: any = [];
            tip.keywords.forEach((keyword: string) => {
                let words = keyword.trim().split(' ');
                if (words.length > 1) {
                    let keywordStr = '';
                    words.forEach(word => keywordStr += `\"${word}\" `);
                    mutilWordArray.push(keywordStr);
                } else {
                    wordArray += `${keyword} `;
                }
            });
            wordArray==''||mutilWordArray.push(wordArray.trim());
            updatedTips.push({ id: tip._id, keywords: mutilWordArray });
            

            //init :add tip_id to result feeds
            matchedFeeds[tip._id] = [];
        });
        // item by item sync
        for(const tip of updatedTips){
            for(const keyword of tip.keywords){
                let options:any = {};
                //search all if start id is empty string 
                startFeedId==""||(options["_id"] = {$gte:Types.ObjectId(startFeedId)});
                options["$text"] = {$search:keyword};
                await this.feedModel.find(options,{_id:0}).then(feeds=>{
                    matchedFeeds[tip.id] = [...matchedFeeds[tip.id],...feeds];
                })
            }
        }
        return Promise.resolve(matchedFeeds);
    };

    getFeedsByKeywords(keywords:string,getOptions:object={}){
        let findOptions = {$text:{$search:keywords.trim()}};
        return this.feedModel.find(findOptions,getOptions);
    };

    getFeedsByKeywordsWithPage = (keywords: string, getOptions: any, pageSize: number, page: number) => {
        let findOptions = {$text:{$search:keywords.trim()}};
        return this.feedModel.find(findOptions,getOptions).skip(pageSize*page).limit(pageSize);
    };

    getTheFirstFeedsBySource = async ()=>{
        let feedIds = await this.feedModel.aggregate([{$group:{_id:'$source',firstOne:{$max:'$_id'}}}]).then((result:any)=>{
            return result.map((item:any)=>item.firstOne);
        });
        return this.feedModel.find({_id:{$in:feedIds}});
    }
}
