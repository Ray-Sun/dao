# dao
db data object
just mongo now, maybe other db later

#Depend on 
* [tools-util](https://github.com/Ray-Sun/tools-util)

#DB config
mongo-config.ts
```javascript
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
```