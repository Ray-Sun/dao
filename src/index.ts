// DB TYPE
import { DBtype } from './shared/dbList';

//basic db item description
import { IFeed, Feed } from "./items/feed";

// mongodb config and module
import { MONGO_CONFIGURATION } from "./shared/mongo-config";
import { MongoFeed } from './items/mongodb/feed';
import { MongoTip } from "./items/mongodb/tip";
import { Tip } from './items/tip';
import * as Mongoose from 'mongoose';
import * as Bluebird from 'bluebird';
declare module 'mongoose' { type Promise<T> = Bluebird<T> };

export class Dao {
    feed?:Feed;
    tip?:Tip;
    constructor(db: number) {
        switch (db) {
            case DBtype.MONGO: {
                Mongoose.connect(MONGO_CONFIGURATION.url, MONGO_CONFIGURATION.account);
                this.feed = new MongoFeed();
                this.tip = new MongoTip();
            };break;
            case DBtype.SQLITE: {
                //TODO

            }; break;
            default: throw (new Error('Unsupported DB Type'));
        }
    }
};





