import { Schema, Model, Document, model } from "mongoose";
import { addDays } from 'tools-util';
import { ITip,Tip } from '../tip';


export interface ITipModel extends ITip, Document { };

const DEFAULTEXPIREDAYS:number = 7;

export class MongoTip implements Tip{

    tipModel: Model<ITipModel>;

    constructor() {

        let tipSchema: Schema = new Schema({
            keywords: String,
            email: String,
            telegram: String,
            expiredDate: { type: Date, default: (addDays(DEFAULTEXPIREDAYS)) }
        });

        this.tipModel = model<ITipModel>("Tip", tipSchema);

    }

    addItem:any=(item:ITip)=>{
        return this.tipModel.create(item);
    }


    getItems = (options:object={},getOptions:object={}) => {
        return this.tipModel.find(options,getOptions);
    };

    getItemsByEmail = (email:string,getOptions:object={})=>{
        return this.getItems({email:email},getOptions);
    }


    getItemsGroupByEmail = () => {
        let aggregateOptions = [];
        aggregateOptions.push({
            $match:{email:{$exists:true}}
        });
        aggregateOptions.push({
            $group:{_id:'$email',keywords:{$push:'$keywords'}}
        });
        return this.tipModel.aggregate(aggregateOptions);
    };

    async removeItemById(id:string){
        const result = await this.tipModel.findOneAndRemove({ _id: id });
        if (result&&result._id.toString() == id) {
            return Promise.resolve(1);
        }
        return Promise.reject(0);
    }


    updateItem(findOptions:object,updateOptions:object){
        if(Object.keys(findOptions).length==0) return Promise.reject(0);

        return this.tipModel.update(findOptions,updateOptions);
    };

    updateExpiredDate(id:string,newExpiredDate:Date){
        if(newExpiredDate.constructor===Date)
        return this.updateItem({_id:id},{expiredDate:newExpiredDate});
    };

}
