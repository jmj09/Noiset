const five = require('take-five');
const os = require('os');
const exec1 = require('child_process').exec;
const exec2 = require('child_process').exec;
const util = require('util');
const myF = require('./noisetfunc.js');
const server = five();

//tested in test.js in test.js
server.get('/=osc', function(req, res) {
  try {
    const osCpus = 	os.cpus();
    res.send(osCpus);
  } catch(err) {
    myF.processError('api1000-server.get-osc ', err, 55);
    res.send([{"error":"api1000-server.get-osc"}]);
  }
});

//tested in test.js
server.get('/=ver', function(req, res) {
  try {
    const verRes = process.versions;
    res.send(verRes);
  } catch(err) {
    myF.processError('api1000-server.get-ver ', err, 55);
    res.send([{"error":"api1000-server.get-ver"}]);
  }
});

//tested in test.js
server.get('/=pas', function(req, res) {
  const options = {
    timeout: 5000,
    killSignal: 'SIGKILL'
  };
  try {
    exec2('YPressure METEO get_currentValue', options, function (err, stdout, stderr) {
      const line = stdout.toString();
      const results = line.slice(-11,-3);
      res.send(results);
    });
  } catch(err) {
    myF.processError('api1000-server.get-pas ', err, 55);
    res.send(0);
  }  
});

//tested in test.js
server.get('/=rss', function (req, res) {
  const options = {
    timeout: 5000,
    killSignal: 'SIGKILL'
  };
  exec1('tasklist', options, function (err, stdout, stderr) {
    const lines = stdout.toString().split('\n');
    const results = [];
    try {
      lines.forEach(function (line) {
        const proc = line.substring(0, 26),
          pid = line.substring(26, 35),
          util1 = line.substring(66, 69),
          util2 = line.substring(70, 73);
        results.push([proc, pid, util1 + util2]);
      });
      res.send(results);
    } catch(err) {
      myF.processError('api1000-server.get-rss ', err, 55);
      res.send([{"error":"api1000-server.get-rss"}]);
    }
    
  });
});

//tested in test.js
server.get('/=cpu', function(req, res) {
  try {
    const CPUout = process.cpuUsage();
    const CPUUSER = + (parseFloat(CPUout.user) / 1000000).toFixed(2);
    const CPUSYST = + (parseFloat(CPUout.system) / 1000000).toFixed(2);
    const CPUFormat = {
      user: CPUUSER ,
      system: CPUSYST
    };
    res.send(CPUFormat);
  } catch(err) {
    myF.processError('api1000-server.get-cpu ', err, 55);
    res.send([{"error":"api1000-server.get-cpu"}]);
  }
  
});

//tested in test.js
server.get('/=mem', function(req, res) {
  try {
    const memRes1 = util.inspect((process.memoryUsage().rss / 1048576));
    const memRes2 = util.inspect((process.memoryUsage().heapTotal / 1048576));
    const memRes3 = util.inspect((process.memoryUsage().heapUsed / 1048576));
    const memRes = {};
    memRes.rss = + parseFloat(memRes1).toFixed(2);
    memRes.heapTotal = + parseFloat(memRes2).toFixed(2);
    memRes.heapUsed = + parseFloat(memRes3).toFixed(2);
  res.send(memRes);
  } catch(err) {
    myF.processError('api1000-server.get-mem ', err, 55);
    res.send([{"error":"api1000-server.get-mem"}]);
  }
  
});

server.on('uncaughtException', function(req, res, route, err) {
  console.log('erreur api1000 ligne 90 : ' + err);
  res.send(500, '0');
});

server.listen(1000);
