import Realm from 'realm';
import path from 'path';
import fs from 'fs';

// A useful tool for finding segmentation faults.
// const Segfault = require('segfault-handler');
// Segfault.registerHandler("/tmp/mealprep/fault");

const deleteFolderRecursive = (dir) => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const curPath = `${dir}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
};
const createFolder = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};


const databasesPath = path.join(process.cwd(), '__tests__/databases');
deleteFolderRecursive(databasesPath);
createFolder(databasesPath);

Realm.defaultPath = path.join(databasesPath, 'defaultRealm');
