var startStopDaemon = require('start-stop-daemon');

  var options = {
    outFile: 'customOutFile.log',
    errFile: 'customErrFile.log',
    max: 3 //the script will run 3 times at most
  };

  startStopDaemon(options, function() {
     "use strict";
  //console.log("enter");
  const fileToRead = "speak.txt";
  const onFileChange = require("on-file-change");
  const fs = require("fs");
  onFileChange(fileToRead, () => {
    //console.log("File changed!");
    fs.readFile(fileToRead, 'utf8', (err, data) => {
      if (err) throw err;
      //console.log(data);
      speakText(data);
    });
  });
  });


function speakText(texte) {
  "use strict";
  const SimpleTTS = require('simpletts');
  SimpleTTS.getVoices().then(function(voices) {
    SimpleTTS.read({
      text: texte,
      voice: voices[2], // optionnal, object or text, default first language detected
      volume: 30, // optionnal, percentage, 0 -> 100, default 100
      speed: 50 // optionnal, percentage, 0 -> 100, default 50
    }).then(function() {
      //console.log("done"); // for debug
    }).catch(function(err) {
      console.log("erreur 28 " +  err);
    });
  }).catch(function(err) {
    console.log("erreur 31 " + err);
  });
}