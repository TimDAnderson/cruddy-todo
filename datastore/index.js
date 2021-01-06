const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var todo = {};
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });

  //chain together a few callbacks
  //getNextUniqueID -> 
  counter.getNextUniqueId((err, count)=>{
    if (err) {
      throw 'could not get id';
    } 
    todo.id = count;
    //write count.txt file with content text
    //writefile takes in (filepath, fileContent, cb)

    fs.writeFile(`${exports.dataDir}/${count}.txt`, text, (err)=>{
      if (err) {
        throw 'there was an error writing todo';
      } else {
        console.log('file written properly');
      }
      todo.text = text;
      callback(err, todo);
    });
    // in this call back run the original callback?

  });

};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // console.log('data: ', data)
  // callback(null, data);

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw 'error reading contents of directory';
    }
    for (var i = 0; i < files.length; i++) {
      files[i] = {
        id: files[i].replace('.txt', ''),
        text: files[i].replace('.txt', '')
      };
    }
    callback(err, files);
  });
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }

  //read file at exports.dataDir/id.txt
  //pass text file contents into the callback
  fs.readFile(`${exports.dataDir}/${id}.txt`, {encoding: 'utf-8'}, (err, data)=>{
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
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }

  fs.readFile(`${exports.dataDir}/${id}.txt`, {encoding: 'utf-8'}, (err, data)=>{
    if (err) {
      console.log('file does not exist');
      callback(err);
    } else {

      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err)=>{
        if (err) {
          throw 'could not write to file';
        }
        callback();
    
      });
    }
  });

};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
