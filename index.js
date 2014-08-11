var JSONStream = require('JSONStream');
var through = require('through');

process.stdin.resume();

function map(dep) {
  var gen ={};
  gen[dep.from.split('@')[0]] = dep.version;
  return gen;
}

function objectify() {
  return through(function (data) {
     var key = Object.keys(data)[0];
     this.queue([key, data[key]]);
  });
}

process.stdin
  .pipe(JSONStream.parse('dependencies.*', map))
  .pipe(objectify())
  .pipe(JSONStream.stringifyObject())
  .pipe(process.stdout);

