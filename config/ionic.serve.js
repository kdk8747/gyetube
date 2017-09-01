
const child_process = require('child_process');

console.log('parent (PID ' + process.pid + ': starting child');
let proc = child_process.exec('ionic serve --address 175.195.88.228');
proc.stdout.pipe(process.stdout);
proc.stderr.pipe(process.stderr);
proc.on('close', (code) => {
  console.log('parent: child process exited with code ' + code);
});
