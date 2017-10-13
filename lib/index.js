#!/usr/bin/env node

let commander = require('commander');
let packageJson = require('../package.json');
let apkReader = require('node-apk-parser');

let line = '-----------------------------------';
commander
  .version(packageJson.version)
  .description('this is simple tools');

commander
  .command('apk <d> [otherDirs...]')
  .description('analysis the apk and output the info')
  .action((d, otherDirs) => {
    let arrs = [];
    arrs.push(analysisApk(d));
    if (otherDirs) {
      otherDirs.forEach((d, i) => {
        arrs.push(analysisApk(d));
      })
    }

    outputInfo(arrs);
  });

function outputInfo(arrs = []) {
  let len = 40, num = 0,line='';
  arrs.forEach((d, i) => {
    num = (('|||versionCode' + d.package).replace(/[\u0391-\uFFE5]/g, "aa").length + 10);
    len = num > len ? num : len;
  });
  for(let i=0;i<len;i++){
    line+='-';
  }
  console.log('analysis apk start');
  console.log(line);
  arrs.forEach((d, i) => {
    console.log('          dir | %s ',d.dir);
    console.log('         name | %s ',d.name);
    console.log('      package | %s ',d.package);
    console.log('  versionName | %s ',d.versionName);
    console.log('  versionCode | %s ',d.versionCode);
    console.log(line);
  });
  console.log('analysis apk end');
}

function analysisApk(dir) {
  let reader = apkReader.readFile(dir),
    manifest = reader.readManifestSync(),
    params = {},
    appliction = manifest.application || {};

  params.versionCode = manifest.versionCode;
  params.versionName = manifest.versionName;
  params.package = manifest.package;
  params.name = appliction.label;
  params.dir = dir;
  return params;
}

commander.parse(process.argv);