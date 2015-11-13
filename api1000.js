/*eslint-env node*/
var express = require("express");
var app = express();
var exec = require("child_process").exec;
var child;
const options = {
  timeout: 5000,
  killSignal: "SIGKILL"
};

app.get("/rss", function (req, res) {
  "use strict";
  child = exec("tasklist", options, function (err, stdout, stderr) {
    if (err) {
      return 0;
    }
    let lines = stdout.toString().split("\n"),
      results = new Array(100),
      i,
      numline = 0,
      j;
    for (i = 0; i < 100; i += 1) {
      results[i] = new Array(3);
      for (j = 0; j < 3; j += 1) {
        results[i][j] = "";
      }
    }

    try {
      lines.forEach(function (line) {
        let proc = line.substring(0, 26),
          pid = line.substring(26, 35),
          util1 = line.substring(66, 69),
          util2 = line.substring(70, 73);

        if (numline > 2) {
          if (proc) {
            results[numline - 2][0] = proc;
            results[numline - 2][1] = pid;
            results[numline - 2][2] = util1 + util2;
          }
        }
        numline += 1;
      });
    } catch(err) {
      //console.log( err.message);
      //console.log("catch de la ligne 47");
    }
    //res.type("text/plain");
    res.json(results);
    lines.length = 0;
    results.length = 0;

  });
});

app.listen(1000);
//console.log("listening on port 1000");
