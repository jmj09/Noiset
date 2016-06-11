/*eslint-env node*/
"use strict";
const express = require("express");
const app = express();

app.listen(1000, "localhost");
//console.log("listening on port 1000");

app.get("/=rss", function (req, res) {
  "use strict";
  const exec = require("child_process").exec;
  const myF = require('./noisetfunc.js');
  const options = {
    timeout: 5000,
    killSignal: "SIGKILL"
  };
  exec("tasklist", options, function (err, stdout, stderr) {
    if (err) {
      myF.processError("exec", err, 15);
      myF.processError("exec-bis", stderr, 15);
      return 0;
    }
    const lines = stdout.toString().split("\n"),
      results = [];
    try {
      lines.forEach(function (line) {
        const proc = line.substring(0, 26),
          pid = line.substring(26, 35),
          util1 = line.substring(66, 69),
          util2 = line.substring(70, 73);
        results.push([proc, pid, util1 + util2]);
      });
    } catch(err) {
      myF.processError("catch", err, 55);
    }
    res.json(results);
  });
});

app.get("/=cpu", function (req, res) {
  "use strict";
  const CPUout = process.cpuUsage();
  var CPUUSER = + (parseFloat(CPUout.user) / 1000000).toFixed(2);
  var CPUSYST = + (parseFloat(CPUout.system) / 1000000).toFixed(2);
  var CPUFormat = {
    user: CPUUSER ,
    system: CPUSYST
  };
  res.json(CPUFormat);
});

app.get("/=mem", function (req, res) {
  "use strict";
  const util = require('util');
  var memRes1 = util.inspect((process.memoryUsage().rss / 1048576));
  var memRes2 = util.inspect((process.memoryUsage().heapTotal / 1048576));
  var memRes3 = util.inspect((process.memoryUsage().heapUsed / 1048576));
  var memRes = {};
  memRes.rss = + parseFloat(memRes1).toFixed(2);
  memRes.heapTotal = + parseFloat(memRes2).toFixed(2);
  memRes.heapUsed = + parseFloat(memRes3).toFixed(2);
  res.json(memRes);
});

app.get("/=osc", function (req, res) {
  "use strict";
  const  os = require("os");
  const osCpus = 	os.cpus();
  res.json(osCpus);
});

app.get("/=ver", function (req, res) {
  "use strict";
  const verRes = process.versions;
  res.json(verRes);
});

