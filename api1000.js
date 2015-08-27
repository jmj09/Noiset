/*jslint node: true */
'use strict';
var express = require('express');
var app = express();
//var util = require('util');
var exec = require('child_process').exec,
  child;
var options = {
  timeout: 1000,
  killSignal: 'SIGKILL'
}
// Add private api get proxying
exports.api = function api() {
  app.get('/rss', function (req, res) {

  child = exec('tasklist',
    options,
    function (err, stdout, stderr) {

      if (err) {
        if (err) {throw err; }
      }
      var lines = stdout.toString().split('\n'),
        results = new Array(100),
        i,
        numline = 0,
        j;
      for (i = 0; i < 100; i += 1) {
        results[i] = new Array(3);
        for (j = 0; j < 3; j += 1) {
          results[i][j] = '';
        }
      }
      lines.forEach(function (line) {
        var proc = line.substring(0, 26),
          pid =  line.substring(26, 35),
          util1 =  line.substring(66, 69),
          util2 =  line.substring(70, 73);

        if (numline > 2) {
          if (proc) {
            results[numline - 2][0] = proc;
            results[numline - 2][1] = pid;
            results[numline - 2][2] = util1 + util2;
          }
        }
        numline += 1;
      });

      res.type('text/plain');
      res.send(results);

      lines = null;
      results = null;
      numline = null;

    });
  });
app.listen(1000);
//console.log('listening on port 1000');
}
