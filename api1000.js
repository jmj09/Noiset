const restify = require('restify');
const server = restify.createServer();
const exec = require("child_process").exec;
const myF = require('./noisetfunc.js');
const util = require('util');
const  os = require('os');

server.get('/=rss', function (req, res) {
  const options = {
    timeout: 5000,
    killSignal: "SIGKILL"
  };
  exec("tasklist", options, function (err, stdout, stderr) {
    if (err) {
      myF.processError("exec err = ", err + " et stderr = "  + stderr, 12);
      res.send(0);
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
    res.send(results);
  });
});

server.get('/=cpu', function(req, res) {
  const CPUout = process.cpuUsage();
  const CPUUSER = + (parseFloat(CPUout.user) / 1000000).toFixed(2);
  const CPUSYST = + (parseFloat(CPUout.system) / 1000000).toFixed(2);
  const CPUFormat = {
    user: CPUUSER ,
    system: CPUSYST
  };
  res.send(CPUFormat);
});

server.get('/=mem', function(req, res) {
  const memRes1 = util.inspect((process.memoryUsage().rss / 1048576));
  const memRes2 = util.inspect((process.memoryUsage().heapTotal / 1048576));
  const memRes3 = util.inspect((process.memoryUsage().heapUsed / 1048576));
  const memRes = {};
  memRes.rss = + parseFloat(memRes1).toFixed(2);
  memRes.heapTotal = + parseFloat(memRes2).toFixed(2);
  memRes.heapUsed = + parseFloat(memRes3).toFixed(2);
  res.send(memRes);
});

server.get('/=osc', function(req, res) {
  const osCpus = 	os.cpus();
  res.send(osCpus);
});

server.get('/=ver', function(req, res) {
  const verRes = process.versions;
  res.send(verRes);
});

server.get('/=pas', function(req, res) {
  const options = {
    timeout: 5000,
    killSignal: "SIGKILL"
  };
  exec("YPressure METEO get_currentValue", options, function (err, stdout, stderr) {
    if (err) {
      myF.processError("exec", err, 15);
      myF.processError("exec-bis", stderr, 15);
    res.send(0);
    }
    const line = stdout.toString();
    const results = line.slice(-11,-3);
    res.send(results);
  });
});

server.on('uncaughtException', function(req, res, route, err) {
  console.log("erreur api1000 ligne 87 : " + err);
  res.send(500, "0");
});

server.listen(1000, 'localhost', function() {
  //console.log('%s listening at %s', server.name, server.url);
});