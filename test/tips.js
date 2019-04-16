'use strict'
const expect = require('chai').expect;
const util = require('tools-util');
const addDays = util.addDays;

const db = require('./db');
const tip = db.tip;

describe('bargain TIP Function test', () => {

    it('tip module: insert item', async() => {
    let expiredDate = addDays(1);
    let newTip = {
      keywords: 'phone',
      email: 'sunsw-cn@qq.com',
      expiredDate: expiredDate,
    };

    await tip.addItem(newTip)
      .then((result) => {
        console.log('result:',result);
      });
    
    return tip.getItems({expiredDate:expiredDate})
    .then((result)=>{
      expect(result.length).to.equal(1);
    })
  });

  it('tip module: delete the inserted item', () => {
    let expiredDate = addDays(1);
    let newTip = {
      keywords: 'phone',
      email: 'sunsw-cn@qq.com',
      expiredDate: expiredDate,
    };
    return tip.addItem(newTip)
      .then((result) => {
        return tip.removeItemById(result._id.toString())
      })
      .then((result)=>{
        expect(result).to.equal(1);
      });
  });

  it('tip module: update the inserted item', () => {
    let expiredDate = addDays(1);
    let newTip = {
      keywords: 'phone',
      email: 'sunsw-cn@qq.com',
      expiredDate: expiredDate,
    };
    return tip.addItem(newTip)
      .then((result) => {
        expiredDate = addDays(1,expiredDate);
        return tip.updateExpiredDate(result._id.toString(),expiredDate);
      })
      .then((result)=>{
        expect(result.ok).to.greaterThan(0);
      });
  });

});