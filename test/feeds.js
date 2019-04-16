'use strict'
const expect = require('chai').expect;
const util = require('tools-util');
const addDays = util.addDays;

const db = require('./db');
const feed = db.feed;
const tip = db.tip;



describe('bargain FEED Function test', () => {
  it('find(): the size items ', () => {
    const timestamp = new Date().getTime();
    let feedWithTimestamp = {
      source: 'ozbargain',
      url: 'https://ozbargain.com.au',
      description: 'great iphone',
      pubDate: new Date(),
      expiredDate: addDays(1),
    };
    let items = [];
    items.push(Object.assign({name:timestamp}, feedWithTimestamp));
    items.push(Object.assign({name:timestamp}, feedWithTimestamp));
    items.push(Object.assign({name:timestamp}, feedWithTimestamp));
    return feed.addItems(items).then(info => {
      return feed.getItems({ name: timestamp });
    }).then((result) => {
      expect(result.length).to.equal(items.length);
    });

  });

  it('add mock feed items', () => {

    let feeds = [{
      name: 'phone',
      source: 'ozbargain',
      url: 'https://ozbargain.com.au',
      description: 'great iphone',
      pubDate: new Date(),
      expiredDate: addDays(1),
    }, {
      name: 'tv',
      source: 'ozbargain',
      url: 'https://ozbargain.com.au',
      description: 'cheap tv',
      pubDate: new Date(),
      expiredDate: addDays(1),
    }
    ];

    return feed.addItems(feeds).then((result) => {
      expect(result.length).to.equal(feeds.length)
    })
  });

  it('add mock feeds then check tip', async() => {

    let feeds = [{
      name: 'phone',
      source: 'ozbargain',
      url: 'https://ozbargain.com.au',
      description: 'great iphone',
      pubDate: new Date(),
      expiredDate: addDays(1),
    }, {
      name: 'tv',
      source: 'ozbargain',
      url: 'https://ozbargain.com.au',
      description: 'cheap tv',
      pubDate: new Date(),
      expiredDate: addDays(1),
    }
    ];
    
    let startFeedId;
    let tips;
    await feed.addItems(feeds).then((result) => {
      startFeedId = result[0]._id;
    });
    await tip.getItemsGroupByEmail().then(result => {
      tips = result;
    });

    return feed.getMatchedFeeds(startFeedId,tips).then(result=>{
      console.log('result: ',result);
    })
  });

  it('add a mocked feed then search it by keywords', async () => {

    const timestamp = new Date().getTime();
    let feedWithTimestamp = {
      name:timestamp,
      source: 'ozbargain',
      url: 'https://ozbargain.com.au',
      description: 'great iphone',
      pubDate: new Date(),
      expiredDate: addDays(1),
    };

    let resultId = '';
    await feed.addItems([feedWithTimestamp]).then(result => {
      console.log('add feed: ', result);
      resultId = result[0]._id.toString();
    });

    return feed.getFeedsByKeywords(timestamp.toString()).then(result => {
      expect(result[0]._id.toString()).to.equal(resultId);
    });
  });

  it('add 3 mocked feeds then search it by keywords with page', async () => {

    const timestamp = new Date().getTime();
    let feedWithTimestamp = {
      source: 'ozbargain',
      url: 'https://ozbargain.com.au',
      description: 'great iphone',
      pubDate: new Date(),
      expiredDate: addDays(1),
    };
    let items = [];
    items.push(Object.assign({name:timestamp + ' a' }, feedWithTimestamp));
    items.push(Object.assign({name:timestamp + ' b' }, feedWithTimestamp));
    items.push(Object.assign({name:timestamp + ' c' }, feedWithTimestamp));

    await feed.addItems(items);

    return feed.getFeedsByKeywordsWithPage(timestamp.toString(), { name: 1 }, 1, 1)
      .then(result => {
        expect(result[0].name).to.equal(timestamp + ' c' );
    });
  });

  it('check the first feed of every source',()=>{
    return feed.getTheFirstFeedsBySource().then(result=>{
      console.log(result);
      expect(result.length).to.equal(7);
    })
  });

});