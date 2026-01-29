const ucicService = require("../services/crmServices/ucicService");
const response = require("../response");
const db = require('../models'); // <- pure db object


const httpStatus = require('http-status');


// const BasicInfo = async (req, res) => {
//   const transaction = await db.transaction();
//   try {
//     const result = await ucicService.BasicInfo(req.body, req.data, transaction);

//     if (result.error) throw result;

//     await transaction.commit();

//     return response.success(
//   req,
//   res,
//   { msgCode: result.msgCode, data: result.data },
//   result.status || 200 // <-- yaha default OK
// );


//   } catch (err) {
//     await transaction.rollback();
//     console.error('CREATE BASIC INFO ERROR >>>', err);

//     return response.error(
//   req,
//   res,
//   { msgCode: err.msgCode || "BASICINFO_UPDATE_FAILED", data: err.data || null },
//   err.status || httpStatus.INTERNAL_SERVER_ERROR // <-- default 500
// );

//   }
// };


const createUcic = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const result = await ucicService.createUcic(req.body, transaction);

    if (result.error) throw result;

    await transaction.commit();

    return response.success(
      req,
      res,
      { msgCode: result.msgCode, data: result.data },
      result.status || 201
    );
  } catch (err) {
    await transaction.rollback();

    console.error("CREATE UCIC ERROR >>>", err);

    return response.error(
      req,
      res,
      { msgCode: err.msgCode || "UCIC_CREATE_FAILED", data: err.data || null },
      err.status || 500
    );
  }
};


const updateUcicContact = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    console.log("REQ BODY >>>", req.body);

    const ucicId = req.body.ucic_id || req.body.id;

if (!ucicId) {
  throw { msgCode: "UCIC_ID_REQUIRED", status: 400 };
}

    const result = await ucicService.updateUcicContact(
      ucicId,
      req.body,
      transaction
    );

    if (result.error) throw result;

    await transaction.commit();

    return response.success(
      req,
      res,
      { msgCode: result.msgCode },
      result.status || 200
    );
  } catch (err) {
    await transaction.rollback();

    console.error("UPDATE UCIC CONTACT ERROR >>>", err);

    return response.error(
      req,
      res,
      { msgCode: err.msgCode || "UCIC_UPDATE_FAILED", data: err.data || null },
      err.status || 500
    );
  }
};


const updateUcicBusiness = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    console.log("REQ BODY >>>", req.body);

    const ucicId = req.body.ucic_id || req.body.id || req.body.ucicId;

    if (!ucicId) {
      throw { msgCode: "UCIC_ID_REQUIRED", status: 400 };
    }

    const result = await ucicService.updateUcicBusiness(
      ucicId,
      req.body,
      transaction
    );

    if (result.error) throw result;

    await transaction.commit();

    return response.success(
      req,
      res,
      { msgCode: result.msgCode },
      result.status || 200
    );
  } catch (err) {
    await transaction.rollback();

    console.error("UPDATE UCIC BUSINESS ERROR >>>", err);

    return response.error(
      req,
      res,
      { msgCode: err.msgCode || "UCIC_UPDATE_FAILED", data: null },
      err.status || 500
    );
  }
};



const createState = async (req, res) => {
   const transaction = await db.sequelize.transaction();

  try {
    const result = await ucicService.createState(req.body, transaction);

    if (result.error) throw result;

    await transaction.commit();

    return response.success(
      req,
      res,
      { msgCode: result.msgCode, data: result.data },
      result.status || 201
    );
  } catch (err) {
    await transaction.rollback();

    console.error("CREATE STATE ERROR >>>", err);

    return response.error(
      req,
      res,
      { msgCode: err.msgCode || "STATE_CREATE_FAILED", data: err.data || null },
      err.status || 500
    );
  }
};

const updateState = async (req, res) => {
  const transaction = await db.sequelize.transaction(); 

  try {
    const result = await ucicService.updateState(req.body, transaction);

    if (result.error) throw result;

    await transaction.commit();

    return response.success(
      req,
      res,
      { msgCode: result.msgCode, data: result.data },
      result.status || 200
    );

  } catch (err) {
    await transaction.rollback();

    console.error("UPDATE STATE ERROR >>>", err);

    return response.error(
      req,
      res,
      { msgCode: err.msgCode || "STATE_UPDATE_FAILED", data: err.data || null },
      err.status || 500
    );
  }
};

const getAllStates = async (req, res) => {
  try {
    const result = await ucicService.getAllStates();

    if (result.error) throw result;

    return response.success(
      req,
      res,
      { msgCode: result.msgCode, data: result.data },
      result.status || 200
    );

  } catch (err) {
    console.error("GET ALL STATES ERROR >>>", err);

    return response.error(
      req,
      res,
      { msgCode: err.msgCode || "STATES_FETCH_FAILED", data: err.data || null },
      err.status || 500
    );
  }
};


const createCity = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const result = await ucicService.createCity(req.body, transaction);

    if (result.error) throw result;

    await transaction.commit();

    return response.success(req, res, { msgCode: result.msgCode, data: result.data }, result.status || 201);

  } catch (err) {
    await transaction.rollback();
    console.error("CREATE CITY ERROR >>>", err);
    return response.error(req, res, { msgCode: err.msgCode || "CITY_CREATE_FAILED", data: err.data || null }, err.status || 500);
  }
};

// UPDATE CITY
const updateCity = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const result = await ucicService.updateCity(req.body, transaction);

    if (result.error) throw result;

    await transaction.commit();

    return response.success(req, res, { msgCode: result.msgCode, data: result.data }, result.status || 200);

  } catch (err) {
    await transaction.rollback();
    console.error("UPDATE CITY ERROR >>>", err);
    return response.error(req, res, { msgCode: err.msgCode || "CITY_UPDATE_FAILED", data: err.data || null }, err.status || 500);
  }
};

// GET ALL CITIES
const getAllCities = async (req, res) => {
  try {
    const stateId = req.query.stateId; // optional, frontend will send selected stateId
    const result = await ucicService.getAllCities(stateId);

    if (result.error) throw result;

    return response.success(
      req,
      res,
      { msgCode: result.msgCode, data: result.data },
      result.status || 200
    );

  } catch (err) {
    console.error("GET ALL CITIES ERROR >>>", err);
    return response.error(
      req,
      res,
      { msgCode: err.msgCode || "CITIES_FETCH_FAILED", data: err.data || null },
      err.status || 500
    );
  }
};




module.exports = {
    createUcic,
    updateUcicContact,
    updateUcicBusiness,
    updateState,
    getAllStates,
    createState,
    createCity,
    updateCity,
    getAllCities
};
