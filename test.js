const myF = require('./noisetfunc.js');
const resizeImg = require('resize-img');
const assert = require('assert');
const lib = require('http');
const warn = ' ********<o=o>*******';
const fs = require('fs');

//dateHH
try {
  const val = myF.dateHH(new Date(2016, 10, 03, 12, 12, 25, 450));
  assert((val == 12), 'myF.dateHH fail');
  console.log('myF.dateHH ok');
} catch (ex) {
  console.log(ex.message + warn);
}

//dateNF
try {
  const val = myF.dateNF(new Date(2016, 10, 03, 13, 12, 25, 450));
  assert((val == '2016/11/03 13:12:25'), 'myF.dateNF fail');
  console.log('myF.dateNF ok');
} catch (ex) {
  console.log(ex.message + warn);
}

//dateZZ
try {
  const val = myF.dateZZ(new Date(2016, 11, 03, 13, 12, 25, 450));
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
try{ fs.unlinkSync('./netcam/test.jpg');
}
catch (ex) {
}

try {
  resizeImg(fs.readFileSync('netcam/CurrentImage.jpg'), {width: 1000, height: 600}).then(buf => {
    fs.writeFileSync('./netcam/test.jpg', buf);
    const exists = fs.statSync("./netcam/test.jpg");
    assert(exists.size >  20000  && exists.size <  50000 , 'resize image fail');
    console.log('resize image ok');
  });
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
      assert(typeof data == 'object' && Object.keys(data).length == 9,  'get api1000 VER fail');
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
  try{ fs.unlinkSync('./newFileTest.csv');
}
  catch (ex) {
}

const randomH = Math.floor((Math.random() * 23) + 1);
const randomV = Math.floor((Math.random() * 1000) + 100);
myF.writeNewFileProm('./newFileTest.csv','heure, test\r\n')
  .then (() => {myF.writeValHourProm('./newFileTest.csv', randomH, randomV)
    .then (() => {myF.getCumulProm('./newFileTest.csv', randomH)
      .then((val) => {
        assert((val==randomV), 'myF.newFileTest fail');
        console.log('myF.newFileTest ok');
      });
    });
  })
} catch (ex) {
  console.log(ex.message + warn);
}
