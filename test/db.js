const dbType = require('../dist/shared/dbList').DBtype;
const Dao = require('../dist/index').Dao;
const dao = new Dao(dbType.MONGO);
const feed = dao.feed;
const tip = dao.tip;

module.exports = {
    feed:feed,
    tip:tip
}