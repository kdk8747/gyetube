const os = require('os');
const fs = require('fs');

let interfaces = os.networkInterfaces();
let addresses = [];
for (let k in interfaces) {
  for (let k2 in interfaces[k]) {
    let address = interfaces[k][k2];
    if (address.family === 'IPv4' && !address.internal) {
      addresses.push(address.address);
    }
  }
}

function replaceIp(path, ip) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g, ip);

    fs.writeFile(path, result, 'utf8', (err) => {
      if (err) return console.log(err);
    });
  });
}

if (addresses.length === 1) {
  let ip = addresses[0];
  console.log('config.dev.by.ethernet.js : ' + ip);
  replaceIp('./ionic.config.json', ip);
  replaceIp('./config/ionic.serve.js', ip);
  replaceIp('./server/.env', ip);
  replaceIp('./src/app/environment-variables/development.ts', ip);
}
else {
  console.error('There is multiple ip addresses!');
}
