const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

const readFilePromise = Promise.promisify(fs.readFile);

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
      });
      
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(`test/testData/${id}.txt`, (err, data) => {
    if (err) {
      callback(err);
    } else {
      var item = data.toString('utf8');
      callback(null, {id: id, text: item});
    }
  });
};
  

exports.readAll = (callback) => {
  
  fs.readdir('test/testData/', (err, dir) => {
    if (err) {
      callback(err);
    } else {
      let arr = dir.map((file) => {
        return readFilePromise(`test/testData/${file}`)
          .then((content) => {
            var id = file.split('.')[0];
            var text = content.toString('utf8');
            return {id: id, text: text};
          });
      });
      
      Promise.all(arr).then((arr) => {
        console.log(arr);
        return callback(null, arr);
      });
    }
  });
};


exports.update = (id, text, callback) => {
  var exist = fs.existsSync(`test/testData/${id}.txt`);
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
  var exist = fs.existsSync(`test/testData/${id}.txt`);
  if (!exist) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    fs.unlink(`test/testData/${id}.txt`, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, 'hi');
      }
    });
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
