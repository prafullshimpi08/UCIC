require('dotenv').config();
// const { default: agent } = require('skywalking-backend-js');

// require("app-module-path").addPath(`${__dirname}/`);
require('./app/config/index');

const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
// const https = require("https");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./app/models/index");
// const fs = require("fs");
const app = express();
const moment = require('moment');

app.use(express.json());

// app.set(path.join(__dirname));
// global.appRoot = path.join(__dirname);
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });

// app.use(bodyParser.json({ limit: "2mb" }));
// app.use(bodyParser.urlencoded({ extended: true }));

// let httpServer;
// const sslKeyPath = path.join(__dirname, 'app/ssl/efl.key');
// const sslCertPath = path.join(__dirname, 'app/ssl/efl.crt');

if (
  process.env.ENVIRONMENT === 'local' 
//   !fs.existsSync(sslKeyPath) ||
//   !fs.existsSync(sslCertPath)
) {
  httpServer = http.createServer(app).listen(process.env.PORT, () => {
    console.log(`✅ HTTP Server chal raha hai at http://localhost:${process.env.PORT}`);
  });
} 
//else {
//   httpServer = https.createServer({
//     key: fs.readFileSync(sslKeyPath),
//     cert: fs.readFileSync(sslCertPath)
//   }, app).listen(process.env.PORT, () => {
//     console.log(`🔐 HTTPS Server chal raha hai at https://localhost:${process.env.PORT}`);
//   });
// }

// process.on("unhandledRejection", (err) => {
//   console.error("possibly unhandled rejection happened");
//   console.error(err.message);
// });

// const closeHandler = () => {
//   () => sequelize.close();
//   httpServer.close(() => {
//     console.info("Server is stopped successfully");
//     process.exit(0);
//   });
// };

// process.on("SIGTERM", closeHandler);
// process.on("SIGINT", closeHandler);

//API routes
// app.use(require("./app/index"));

// const routes = require('./app')
// app.use('/api', require('./app/index'))


app.use('/api', require('./app/routes/index'))


// app.use(require("./app/index"));

