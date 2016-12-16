const fs = require('fs');
const lib = require('http');

//tested in test.js
exports.writeValHourProm = function (file, line, val) {
  const sep = ',';
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject(err);
      }
      else {
        let lineArray = data.toString().split('\r\n');
        lineArray[line] = (line-1) + sep + val;
        lineArray.length = 25;
        let myLongText = '';
        lineArray.forEach( (v) => {
          myLongText = myLongText + v + '\r\n';
        });
        fs.writeFile(file, myLongText, 'utf8', (err) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(true);
          }
        });
      }
    });
  });
};

//tested in test.js
exports.getCumulProm = (file, hour) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject(err);
      }
      else {
        let lineArr = []
        lineArr = data.toString().split('\r\n');
        let total = 0;
        for (let i = 1; i < hour + 1; i+=1) {
          let interm = lineArr[i].split(',');
          let sstot = interm[1];
          total += parseFloat(sstot, 10);
        }
        resolve (total);
      }
    });
  });
};

//tested in test.js
exports.processError = (funcName, err, ligne) => {
  const stepd = '/';
  const steph = ':';
  const space = ' ';
  const dateNow = new Date();
    const num = `${dateNow.getFullYear()}${stepd}${n(dateNow.getMonth()+1)}`
   + `${stepd}${n(dateNow.getDate())}${space}${n(dateNow.getHours())}`
   + `${steph}${n(dateNow.getMinutes())}${steph}${n(dateNow.getSeconds())}`;
  if(ligne ==  0){return true;}
  console.log(`${funcName} - ligne ${ligne} : ${num} at ${err}`);
  return true;
};

//tested in test.js
exports.dateNF = (dte = new Date()) => {
  const stepd = '/';
  const steph = ':';
  const space = ' ';
  const dateNow = dte;
  const dft = `${dateNow.getFullYear()}${stepd}${n(dateNow.getMonth()+1)}`
   + `${stepd}${n(dateNow.getDate())}${space}${n(dateNow.getHours())}`
   + `${steph}${n(dateNow.getMinutes())}${steph}${n(dateNow.getSeconds())}`;
  return dft;
};

function n(num){
  return num > 9 ? '' + num: '0' + num;
}

//tested in test.js
exports.dateHH = (dte = new Date()) => {
  const dateNow = dte;
  const dft=`${n(dateNow.getHours())}`;
  return dft;
};

//tested in test.js
exports.dateZZ = (dte = new Date()) => {
  const stepd = '/';
  const dateNow= dte;
  const dft=`${dateNow.getFullYear()}${stepd}`
   + `${n(dateNow.getMonth()+1)}${stepd}${n(dateNow.getDate())}`;
  return dft;
};

//tested in test.js
exports.getContentProm = (addr) => {
  return new Promise((resolve, reject) => {
    lib.get(addr.url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        console.log('statut connexion ' + response.statuscode);
        reject(new Error('Failed to load page, status code: ' + response.statusCode));
      }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => {
        resolve(body.join(''));
        body.length = 0;
      });
    });
  });
};

//tested in test.js
exports.appendToFileProm = (file, texte) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(file, texte, (err) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(true);
      }
    });
  });
};

//tested in test.js
exports.eraseLastLineProm = function(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject(err);
      }
      else {
        let array = data.toString().split('\r\n');
        array = array.slice(0, array.length - 2);
        let myLongText = '';
        array.forEach( (v) => {
          myLongText = myLongText + v + '\r\n';
        });
        fs.writeFile(file, myLongText, 'utf8', (err) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(true);
          }
        });
      }
    });
  });
}

//tested in test.js
exports.writeNewFileProm = function(file, header) {
  const sep = ',';
  let i;
  return new Promise((resolve, reject) => {
    let myLongText = header;
    for (i = 1; i < 25; i++) {
      myLongText = myLongText + (i-1) + sep + '0' + '\r\n';
    }
    fs.writeFile(file, myLongText, 'utf8', (err) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(true);
      }
    });
  });
};

exports.sliceFileProm = (fileLong, fileShort, numLines, firstLine) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileLong, 'utf8', (err, data) => {
      if (err) { reject(err); }
      else {
        let myArray = data.toString().split('\r\n');
        if (myArray.length > numLines) {
          myArray = myArray.slice(myArray.length - numLines-1, myArray.length-1);
        }
        let myLongText = [];
        myLongText[0] = firstLine + '\r\n';
        for (let i = 1; i < numLines; i++) {
          myLongText = myLongText + myArray[i] + '\r\n';
        }
        fs.writeFile(fileShort, myLongText, 'utf8', (err) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(true);
          }
        });
      }
    });
  });
};

exports.decrement = () => {
  const max = 300;
  for( let i = 1; i < (max+1); i++) {
    mySource = 'netcam/' + i + '.jpg';
    myTarget = 'netcam/' + (i-1) + '.jpg';
    if (fs.existsSync(mySource)) {
      fs.renameSync(mySource, myTarget);
    } else { // source does'nt exist copy previous file to fill the gap
        mySource = 'netcam/' + (i-2) + '.jpg';
        if (fs.existsSync(mySource)) {
          fs.renameSync(mySource, myTarget);
        }
    }
  }
}

//execute an array of promises in a synchronus way
exports.promises = () => {
  if (!Array.isArray(promises)) {
    throw new Error('First argument need to be an array of Promises');
  }
  return new Promise((resolve, reject) => {
    let count = 0;
    let results = [];
    const iterateeFunc = (previousPromise, currentPromise) => {
      return previousPromise
        .then(function (result) {
          if (count++ !== 0) results = results.concat(result);
          return currentPromise(result, results, count);
        })
        .catch((err) => {
          return reject(err);
        });
    }
    promises = promises.concat(() => Promise.resolve());
    promises
    .reduce(iterateeFunc, Promise.resolve(false))
    .then(function () {
      resolve(results);
    })
  });
};

//tested in test.js
exports.removeCol = (array, remIdx) => {
  if (Array.isArray(array)) {
    return array.map(function(arr) {
      return arr.filter(function(el,idx){return idx !== remIdx});
    });
  }
};

//tested in test.js
exports.sortByCol0 = (a, b) => {
  let x = a[0];
  let y = b[0];
  return ((x > y) ? 1 : ((x < y) ? -1 : 0));
};

//tested in test.js
exports.removeEmptyLine = (arr) => { //remove empty line based on first col
  let newArr = arr.filter(function(val){
    return (val[0] != 0 && val[0] != undefined);
  });
  return newArr;
};

//tested in test.js
exports.removeLine = (arr) => {
  return arr.filter(function (el) { return (el[0].substring(0, 4) === "node" || el[0].substring(0, 4) === "HSPI" || el[0].substring(0, 4) === "HS3." || el[0].substring(0, 4) === "ngin"); });
};