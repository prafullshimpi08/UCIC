'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};
// let sequelize;
// if (process.env.NODE_ENV) {
//   sequelize = new Sequelize(config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: console.log,
  // benchmark: true,
  // logging: (msg,time, ...rest)=>{
  //   console.log("111",msg)
  //   console.log("222",time)
  //   console.log("333",rest)
  // },
  pool: {
    max: 50,
    min: 0,
    acquire: 300000,
    idle: 10000,
    idleTimeoutMillis: 10000,
    acquireTimeout: 300000,
    evict: 10000, 
    waitForConnections: true,
  },
  // dialectOptions: {
  //   // options: {
  //   //   // encrypt: true,
  //   //   // connectTimeout: 60000,
  //   //   // requestTimeout: 300000,
  //   // }
  // }
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error.message);
  })

sequelize.sync({ force: false, alter: false, logging: false })
  .then(() => {
    console.log(`DB_NAME & tables created!`);
  }).catch((error) => {
    console.log("cfalseatchError>>>>>>>>", error)
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

global.db = db.sequelize;

module.exports = db;
