const httpStatus = require('http-status');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

var lngMsg = {};
fs.readdirSync(path.join(__dirname, 'lng')).filter(file => {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-5) === '.json');
}).forEach(file => {
  const fileName = file.slice(0, -5);
  const lng = require(path.join(__dirname, 'lng', file));
  lngMsg[fileName] = lng;
});

exports.success = async (req, res, result, code, dbTrans) => {
  console.log("API CALLED -> ", req.originalUrl, req.body);
  const lng = req.headers["accept-language"] || "en";
  try {
    const response = {
      success: true,
      status_code: code,
      message: (lngMsg[lng] ? lngMsg[lng][result.msgCode] : lngMsg['en'][result.msgCode]) || result.msgCode || httpStatus[code],
      result: result.data ? result.data : {},
      time: Date.now()
    };
    if (dbTrans !== undefined) {
      await dbTrans.commit();
    }
    return res.status(code).json(response);

  }
  catch (error) {
    console.log("🚀 ~ file: index.js ~ line 32 ~ exports.success= ~ error", error)
    if (dbTrans !== undefined) {
      await dbTrans.rollback()
    }
    return res.json(
      {
        success: true,
        status_code: 500,
        message: lngMsg[lng] ? lngMsg[lng]['INTERNAL_SERVER_ERROR'] : lngMsg['en']['INTERNAL_SERVER_ERROR'],
        result: '',
        time: Date.now()
      });
  }
};
const getLoggingMethod = (statusCode) => {
  if (!statusCode) return "error";

  if (statusCode >= 500) return "error";
  if (statusCode >= 400) return "warn";
  if (statusCode >= 300) return "info";

  return "info";
};


const loggerToConsole = {
  error: console.error,
  warn: console.warn,
  info: console.log,
};

const loggerToFile = {
  error: console.error, // abhi ke liye console hi
  warn: console.warn,
  info: console.log,
};


exports.error = async (req, res, error, code, dbTrans) => {
  console.log("API CALLED -> ", req.originalUrl, req.body);
  const lng = req.headers["accept-language"] || "en";
  try {
    //logging crash
    const logLevel = getLoggingMethod(code);
    const data = { endPoint: req.originalUrl, req: req.body, error: error, status: code };
    loggerToConsole[logLevel](JSON.stringify(data));
    loggerToFile[logLevel](JSON.stringify(data));

    const response = {
      success: false,
      status_code: code,
      message: (lngMsg[lng] ? lngMsg[lng][error.msgCode] : lngMsg['en'][error.msgCode]) || error.msgCode || httpStatus[code],
      result: error.data? error.data: {},
      time: Date.now()
    };
    if (dbTrans !== undefined) {
      await dbTrans.rollback()
    }
    res.status(code).json(response);
  }
  catch (err) {
    if (dbTrans !== undefined) {
      await dbTrans.rollback()
    }
    const logLevel = getLoggingMethod(err.status);
    loggerToConsole[logLevel](JSON.stringify(err));
    loggerToFile[logLevel](JSON.stringify(err));
    return res.status(500).json({
      success: false,
      status_code: 500,
      message: lngMsg[lng] ? lngMsg[lng]['INTERNAL_SERVER_ERROR'] : lngMsg['en']['INTERNAL_SERVER_ERROR'],
      result: '',
      time: Date.now()
    });
  }
};