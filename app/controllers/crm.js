const httpStatus = require('http-status');
const response = require('../response');
const db = require('../models').sequelize;
// const Sequelize = require('sequelize');
// const XLSX = require('xlsx');
const crmSevices = require('../services/crmServices/crm_enquiry');
// const commonService = require('../services/common');
// const { USER_TYPE } = require('../constant/constant');
// const { where,literal } = require('sequelize');
// const { Op } = require('sequelize');
// const { REGEX_PATTERN } = require('../constant/constant');

// const states = require('efl_state_codes')
// const cities = require('efl_zip_codes')



const createOrUpdateChannelPartner = async (req, res) => {
  const dbTrans = await db.transaction();
  try {
    const result = await crmSevices.createOrUpdateChannelPartner(req.body, req.data, dbTrans);

    console.log("Create Result:", result); // ✅ debug print
    if (result.error) throw result;

    await dbTrans.commit();
    return response.success(req, res, {msgCode: result.msgCode,data: result.data}, result.status || 200); // ✅ fallback to 200
  } catch (err) {await dbTrans.rollback();console.error("CREATE USER ERROR >>>", err);
    return response.error(req, res, {
      msgCode: err.msgCode || 'CP_OPERATION_FAILED',
      data: err.data || null
    }, err.status || 500);
  }
};






// console.log(db,"////////");


module.exports = {
  createOrUpdateChannelPartner
}