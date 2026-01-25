const { env } = require("process");
require('dotenv').config();

  module.exports = {
    "development": {
      "username": env.DB_USER,
      "password": env.DB_PASSWORD,
      "database": env.DB_NAME,
      "host": env.DB_HOST,
      "dialect": process.env.DB_DIALECT,
    },
    "test": {
      "username": env.UAT_DB_USER,
      "password": env.UAT_DB_PASSWORD,
      "database": env.UAT_DB_NAME,
      "host": env.UAT_DB_HOST,
      "dialect": env.DB_DIALECT,
    },
    "production": {
      "username": env.DB_USER,
      "password": env.DB_PASSWORD,
      "database": env.DB_NAME,
      "host": env.DB_HOST,
      "dialect": env.DB_DIALECT,
    }
  }
