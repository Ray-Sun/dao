export interface Mongoconfig {
    "url": string,
    "account": {
        "user": string,
        "pass": string,
        "auth": {
            "authdb": string
        }
    }
}


export const MONGO_CONFIGURATION: Mongoconfig = {
    "url": "mongodb://127.0.0.1:27001/bargain",
    "account": {
        "user": "xxxx",
        "pass": "xxxxxxx",
        "auth": {
            "authdb": "bargain"
        }
    }
};
