const myF = require('./noisetfunc.js');
const tufu = require('tufu-fix');
const assert = require('assert');
const warn = ' ********<o=o>*******';
const fs = require('fs');
const fileName = './fileTest.csv'

//dateHH
try {
  const val = myF.dateHH(new Date(2016, 10, 3, 12, 12, 25, 450));
  assert((val == 12), `myF.dateHH fail`);
  console.log('myF.dateHH ok');
} catch (ex) {
  console.log(ex.message + warn);
}

//dateNF
try {
  const val = myF.dateNF(new Date(2016, 10, 3, 13, 12, 25, 450));
  assert((val == '2016/11/03 13:12:25'), 'myF.dateNF fail');
  console.log('myF.dateNF ok');
} catch (ex) {
  console.log(ex.message + warn);
}

//dateZZ
try {
  const val = myF.dateZZ(new Date(2016, 11, 3, 13, 12, 25, 450));
  assert((val == '2016/12/03'), 'myF.dateZZ fail');
  console.log('myF.dateZZ ok');
} catch (ex) {
  console.log(ex.message + warn);
}

//processError
try {
  const err = new Error;
  err.message = 'errTest';
  err.name = 'ExceptionTest';
  const val = myF.processError('test', err, 0);
  assert(val, 'myF.processError fail');
  console.log('myF.processError ok');
} catch (ex) {
  console.log(ex.message + warn);
}

//removeCol
try {
  let arr = [[1,'a',2],[3,'b',4]];
  arr = myF.removeCol(arr, 1);
  assert((arr.toString() == '1,2,3,4'), 'myF.removeCol fail');
  console.log('myF.removeCol ok');
} catch (ex) {
  console.log(ex.message + warn);
}

//removeEmptyLine
try {
  let arr = [[1,2],[3,4],[,6],[' ',8]];
  arr = myF.removeEmptyLine(arr);
  assert((arr.toString() == '1,2,3,4'), 'myF.removeEmptyLine fail');
  console.log('myF.removeEmptyLine ok');
} catch (ex) {
  console.log(ex.message + warn);
}

//resize image
try {
  tufu("./netcam/CurrentImage.jpg").resize(1000, 600).compress(30).save("./netcam/test.jpg");
  const exists = fs.statSync("./netcam/test.jpg");
  assert(exists.size >  20000  && exists.size <  60000 , 'resize image fail');
  console.log('resize image ok');

} catch (ex) {
  console.log(ex.message + warn);
}

//get pas api1000
try {
  const options = {
    url: "http://127.0.0.1:1000/=pas",
    method: "GET",
    headers: {
      "User-Agent": "Noiset Agent",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  myF.getContentProm(options)
    .then(function (response) {
      const data = JSON.parse(response);
      assert(typeof data == 'number' && data > 900 && data < 1040,  'get api1000 PAS fail');
      console.log('get api1000 PAS ok');
    })
    .catch ((ex) => {
      console.log(ex.message + warn);
    });
} catch (ex) {
  console.log(ex.message + warn);
}

//get osc api1000
try {
  const options = {
    url: "http://127.0.0.1:1000/=osc",
    method: "GET",
    headers: {
      "User-Agent": "Noiset Agent",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  myF.getContentProm(options)
    .then(function (response) {
      const data = JSON.parse(response);
      assert(typeof data == 'object' && data.length == 4,  'get api1000 osc fail');
      console.log('get api1000 OSC ok');
    })
    .catch ((ex) => {
      console.log(ex.message + warn);
    });
} catch (ex) {
  console.log(ex.message + warn);
}

//get ver api1000
try {
  const options = {
    url: "http://127.0.0.1:1000/=ver",
    method: "GET",
    headers: {
      "User-Agent": "Noiset Agent",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  myF.getContentProm(options)
    .then(function (response) {
      const data = JSON.parse(response);
      assert(typeof data == 'object' && Object.keys(data).length == 12,  'get api1000 VER fail');
      console.log('get api1000 VER ok');
    })
    .catch ((ex) => {
      console.log(ex.message + warn);
    });
} catch (ex) {
  console.log(ex.message + warn);
}

//get rss api1000
try {
  const options = {
    url: "http://127.0.0.1:1000/=rss",
    method: "GET",
    headers: {
      "User-Agent": "Noiset Agent",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  myF.getContentProm(options)
    .then(function (response) {
      const data = JSON.parse(response);
      assert(typeof data == 'object' && data.length > 10,  'get api1000 RSS fail');
      console.log('get api1000 RSS ok');
    })
    .catch ((ex) => {
      console.log(ex.message + warn);
    });
} catch (ex) {
  console.log(ex.message + warn);
}

//get cpu api1000
try {
  const options = {
    url: "http://127.0.0.1:1000/=cpu",
    method: "GET",
    headers: {
      "User-Agent": "Noiset Agent",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  myF.getContentProm(options)
    .then(function (response) {
      const data = JSON.parse(response);
      assert(typeof data == 'object' && Object.keys(data).length ==  2,  'get api1000 CPU fail');
      console.log('get api1000 CPU ok');
    })
    .catch ((ex) => {
      console.log(ex.message + warn);
    });
} catch (ex) {
  console.log(ex.message + warn);
}

//get mem api1000
try {
  const options = {
    url: "http://127.0.0.1:1000/=mem",
    method: "GET",
    headers: {
      "User-Agent": "Noiset Agent",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  myF.getContentProm(options)
    .then(function (response) {
      const data = JSON.parse(response);
      assert(typeof data == 'object' && Object.keys(data).length ==  3,  'get api1000 MEM fail');
      console.log('get api1000 MEM ok');
    })
    .catch ((ex) => {
      console.log(ex.message + warn);
    });
} catch (ex) {
  console.log(ex.message + warn);
}

//sortByCol0
try {
  let arr = [[3,4],[1,2],['c','d'],['a','b']];
  arr = arr.sort(myF.sortByCol0);
  assert((arr.toString() == '1,2,3,4,a,b,c,d'), 'myF.sortByCol0 fail');
  console.log('myF.sortByCol0 ok');
} catch (ex) {
  console.log(ex.message + warn);
}

//removeLine
try {
  let arr = [['node','1','a'],['HSPI','2','b'],['alte','5','e'],['HS3.','3','c'],['ngin','4','d'],['tael','6','f']];
  arr = myF.removeLine(arr);
  assert((arr.toString() == 'node,1,a,HSPI,2,b,HS3.,3,c,ngin,4,d'), 'myF.removeLine fail');
  console.log('myF.removeLine ok');
} catch (ex) {
  console.log(ex.message + warn);
}

//writeNewFileProm then writeHourProm then getCumulProm
try {
  const randomH = Math.floor((Math.random() * 23) + 1);
  const randomV = Math.floor((Math.random() * 1000) + 100);
  myF.writeNewFileProm('./newFileTest.csv','heure, test\r\n')
    .then (() => {myF.writeValHourProm(fileName, randomH, randomV)
      .then (() => {myF.getCumulProm(fileName, randomH)
        .then((val) => {
          assert((val==randomV), '256 writeNewFileProm fail');
          console.log('writeNewFileProm ok');
        });
      });
    })
    .catch ((ex) => {
      console.log(ex.message + warn);
    });
} catch (ex) {
  console.log(ex.message + warn);
}
/*
//writeNewFileProm then delete last line then append new line twice then delete last line then getCumulProm
try {
  try{ fs.unlinkSync(fileName);
  }
  catch (ex) {
  }
  myF.writeNewFileProm(fileName,'heure, val\r\n')
  .then (ret1 => { myF.eraseLastLineProm(fileName)
    .then(ret2 => { myF.appendToFileProm(fileName, '23,1732\r\n24,10\r\n')
      .then (ret3 => {process.exit(); myF.eraseLastLineProm(fileName).then()});
    });
  })
  .catch ((ex) => {
    console.log(ex.message + warn);
  });
}
catch (ex) {
  console.log(ex.message + warn);
}
*/

//writeNewFileProm then sliceFileProm then count lines
try {
  const fileShort = 'shortTest.csv';
  const numLines = Math.floor((Math.random() * 23) + 1);
  const firstLine = 'first,line';
  myF.writeNewFileProm(fileName,'heure, val\r\n')
  .then (() => {myF.sliceFileProm(fileName, fileShort, numLines, firstLine)
    .then(() => {fs.readFile(fileShort, (err, data) => {
        if (err) {
          reject(err);
        }
        else {
          let lineArray = data.toString().split('\r\n');
          assert((lineArray.length = numLines), '305 sliceFileProm fail');
          console.log('sliceFileProm ok');
        }
      })
    })
  })
  .catch ((ex) => {
    console.log(ex.message + warn);
  });
}
catch (ex) {
  console.log(ex.message + warn);
}


