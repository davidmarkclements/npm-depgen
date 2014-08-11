#!/usr/bin/env node

var exec = require('child_process').exec;
var extend = require('extend');
var argv = require('optimist').argv;
var package;
function tryPackage() {
  try {
    package = require(process.cwd() + '/package.json');
  } catch (e) {}
}

if (argv.p) { tryPackage(); }

exec('npm ls --depth 0 --json | node '+ __dirname + '/index.js',
  function (err, stdout) {
    if (err) { 
       console.log(err);
       return;
    }
    var deps = JSON.parse(stdout); 
    console.log(JSON.stringify(deps, 0, 2));
    
    if (package) {
      console.log('Merging dependencies into package.json');
      package.dependencies = package.dependencies || {};
      extend(package.dependencies, deps);
      require('fs').writeFileSync('./package.json', JSON.stringify(package, 0, 2))
    }

  });
