const fs = require('fs');
const path = require('path');
const debug = require('debug')('models');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.JAWSDB_MARIA_URL);
const db = {};

fs
  .readdirSync(__dirname)
  .filter((file) => {
    debug(file);
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach((file) => {
    let model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
