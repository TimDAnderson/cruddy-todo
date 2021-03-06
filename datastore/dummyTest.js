const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

fs.writeFile('./datastore/data/test.txt', 'test', (err) => {
  if (err) {
    throw err;
  } else {
    console.log('file written');
  }
  console.log(fs.readdirSync('./datastore/data').length);
});

fs.writeFile('./datastore/data/test.txt', 'overwrite', (err) => {
  if (err) {
    throw err;
  } else {
    console.log('file written');
  }
  console.log(fs.readdirSync('./datastore/data').length);
});


// fs.readdir('./datastore/data', (err, files) => {
//   files.forEach(file => {
//     console.log(file);
//   });
// });
