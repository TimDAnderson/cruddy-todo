const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var todo = {};

  counter.getNextUniqueId((err, count) => {
    if (err) {
      throw 'could not get id';
    }
    todo.id = count;

    fs.writeFile(`${exports.dataDir}/${count}.txt`, text, (err) => {
      if (err) {
        throw 'there was an error writing todo';
      } else {
        console.log('file written properly');
      }
      todo.text = text;
      callback(err, todo);
    });

  });

};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw 'error reading contents of directory';
    }

    var promiseArray = [];
    for (var i = 0; i < files.length; i++) {
      promiseArray.push(new Promise((resolve, reject) => {
        let idName = files[i].replace('.txt', '');
        fs.readFile(`${exports.dataDir}/${files[i]}`, { encoding: 'utf-8' }, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve({ id: idName, text: data });
          }
        });
      }));
    }

    Promise.all(promiseArray).then((todos) => {
      callback(null, todos);
    });

  });
};

exports.readOne = (id, callback) => {

  fs.readFile(`${exports.dataDir}/${id}.txt`, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      //throw 'could not read file';
    }
    var todoObj = {
      id,
      text: data
    };
    callback(err, todoObj);

  });

};




exports.update = (id, text, callback) => {

  fs.readFile(`${exports.dataDir}/${id}.txt`, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      console.log('file does not exist');
      callback(err);
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          throw 'could not write to file';
        }

        callback();
      });
    }
  });

};

exports.delete = (id, callback) => {

  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf-8', (err, data) => {
    console.log(`help display data for utf8: ${data}`);
    if (err) {
      callback(err);
    } else {
      fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
        if (err) {
          throw err;
        }
        console.log('file sucessfully deleted');
        callback();
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
