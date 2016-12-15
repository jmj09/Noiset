//tested in test.js
const tufu = require("tufu-fix");
const onFileChange = require("on-file-change");
const myF = require('./noisetfunc.js');
onFileChange("netcam/CurrentImage.jpg", () => {
  myF.decrement();
  tufu("./netcam/CurrentImage.jpg").resize(1000, 600).compress(30).save("./netcam/300.jpg");
});
