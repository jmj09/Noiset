//tested in test.js
const fs = require('fs');
const resizeImg = require('resize-img');
const onFileChange = require("on-file-change");
const myF = require('./noisetfunc.js');
onFileChange("netcam/CurrentImage.jpg", () => {
  myF.decrement();
  resizeImg(fs.readFileSync('netcam/CurrentImage.jpg'), {width: 1000, height: 600}).then(buf => {
    fs.writeFileSync('./netcam/300.jpg', buf);
  });
});
