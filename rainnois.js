const schedule = require('node-schedule');
const myF = require('./noisetfunc.js');
const capteur1 = 42; //'pluvio'
const path1 = 'pluie.csv';
const path2 = 'pluie24.csv';
const strURL1 = 'http://localhost:81/JSON?request=getstatus&ref=' + capteur1;
const options = {
  url: strURL1,
  method: 'GET',
  headers: {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

schedule.scheduleJob('10 4,9,14,19,24,29,34,39,44,49,54,58 * * * *', () => {
  myF.getContentProm(options)
  .then((response) => {
    const pluie = JSON.parse(response).Devices[0].value;
    const sep = ",";
    const dateNow = myF.dateZZ();
    const madate = `${dateNow} 00:00:00 `;
    const texte = madate + sep + pluie + '\r\n';
    myF.eraseLastLineProm(path1)
    .then(() => {
      myF.appendToFileProm(path1, texte)
        .then(() => {});
    })
    .then(() => {
      myF.getCumulProm(path2, +myF.dateHH())
      .then((valeur) => {
        const reste = pluie - valeur;
        myF.writeValHourProm(path2, +myF.dateHH() + 1, reste)
        .then(() => {return true});
      })
    })
    .catch((err) => {
      myF.processError('jobFiveMin request ', err, 38);
      return false;
    });
  })
  .catch((err) => {
      myF.processError('jobFiveMin getContentProm ', err, 38);
      return false;
  });
});

schedule.scheduleJob('10 1 0 * * *', () => {
  myF.getContentProm(options)
  .then((response) => {
    const firstLine= 'heure,mm\r\n';
    const pluie = JSON.parse(response).Devices[0].value;
    const sep = ",";
    const madate = `${myF.dateNF()}`;
    const texte = madate + sep + pluie + '\r\n';
    myF.appendToFileProm(path1, texte)
    .then(() => {
      myF.writeNewFileProm(path2, firstLine)
      .then();
    });
  })
  .catch( (err) => {
    myF.processError('jobOnceADay getContentProm ', err, 60);
    return false;
  });
});