// db item basic struct
export interface ITip {
    keywords: string,
    email?: string,
    telegram?:string,
    expiredDate?: Date,
}

// db item basic function
export interface Tip{
    addItem(item:ITip):any;
    getItems(options:object,getOptions:object):any;
    getItemsByEmail(email:string,getOptions:object):any;
    getItemsGroupByEmail():any;
    removeItemById(id:string):any;
    updateItem(findOptions:object,updateOptions:object):any;
    updateExpiredDate(id:string,newExpiredDate:Date):any;
}

