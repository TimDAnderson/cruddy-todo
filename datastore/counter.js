const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num); 
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      console.log('no error block');
      callback(null, Number(fileData));

    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

// exports.getNextUniqueId = () => {
//   counter = counter + 1;
//   return zeroPaddedNumber(counter);
// };


exports.getNextUniqueId = (cb) => {
  readCounter((err, count) => {
    if (err) {
      throw 'error, cannot read counter from file';
    } else {
      count++;
    }
    writeCounter(count, (err, count)=>{
      if (err) {
        throw 'error, cannot write counter to file';
      } else {
        cb(null, count);
      }
    });
  });

};

//run  readCounter
//what happens if there is no counter.txt file
//need to create one starting at 0

//get current counter value
//increment that counter value
//pass this ID along to the function that needs a unique ID

//call write counter and pass in new counter value that was incremented





// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
