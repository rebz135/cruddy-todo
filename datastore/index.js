const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(`test/testData/${data}.txt`, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, {id: data, text: text});
        }
      })
      
    }
  })
};

exports.readOne = (id, callback) => {
  var exist = fs.existsSync(`test/testData/${id}.txt`)
  if (!exist) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    var item = fs.readFileSync(`test/testData/${id}.txt`).toString('utf8');
    callback(null, {id: id, text: item});
  }
  
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, {id: id, text: item});
  // }
};

exports.readAll = (callback) => {
  var data = [];
  var fileNames = fs.readdirSync(`test/testData/`);
  fileNames.forEach((ele)=> {
    let text = fs.readFileSync(`test/testData/${ele}`).toString('utf8') //TEXT IS IN BUFFER RIGHT NOW
    let id = ele.split('.')[0]
    data.push({ id: id, text: text })
  })
  callback(null, data);
  
  
  // var data = [];
  // _.each(items, (item, idx) => {
  //   data.push({ id: idx, text: items[idx] });
  // });
  // callback(null, data);
};

exports.update = (id, text, callback) => {
  var exist = fs.existsSync(`test/testData/${id}.txt`)
  if (!exist) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    fs.writeFile(`test/testData/${id}.txt`, text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, {id: id, text: text});
      }
    });
  }  
  
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, {id: id, text: text});
  // }
};

exports.delete = (id, callback) => {
  var exist = fs.existsSync(`test/testData/${id}.txt`)
  if (!exist) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    fs.unlink(`test/testData/${id}.txt`, (err) => {
       if (err) {
          callback(err);
        } else {
          callback(null, 'hi');
        }
    })
  }
  
  
  
  
  // var item = items[id];
  // delete items[id];
  // if(!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`))
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
