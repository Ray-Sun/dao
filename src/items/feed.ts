// db item basic struct
export interface IFeed {
    name: string,
    source: string,
    url: string,
    coverPicture?:string,
    description?: string,
    pubDate: Date,
    expiredDate: Date,
}


// db item basic function
export interface Feed{
    addItems(items:IFeed[]):any;
    getItems(options:object,getOptions:object):any;
    getMatchedFeeds(startFeedId:string,tips:any[]):any;
    getFeedsByKeywords(keywords:string,getOptions:any):any;
    getFeedsByKeywordsWithPage(keywords:string,getOptions:any,pageSize:number,page:number):any;
    getTheFirstFeedsBySource():any;
}