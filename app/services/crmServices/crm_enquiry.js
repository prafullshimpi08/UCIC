const db = require('../../models').sequelize;
const httpStatus = require('http-status');
const { Op } = require("sequelize");
// const { commonService } = require('shared-services');
// const { LOAN_APPLICATION_ID, APPLICANT_TYPE, LEAD_STATUS, PROSPECT_STATUS, EMPANELMENT_DOCTYPES } = require('../../constant/constant');
// const { generateApplicationId } = require('../../utils/helper');
// const axios = require('axios');

const commonService = require('../common');


const createOrUpdateChannelPartner = async (body, loginDetails, transaction) => {
  try {
    const { User } = db.models;

    // console.log(body);
    const createdCP = await commonService.create(User, body, transaction);

    if (!createdCP) {
      return {
        error: true,
        msgCode: 'CP_NOT_CREATED',
        status: httpStatus.SERVICE_UNAVAILABLE,
      };
    }

    return {
      error: false,
      msgCode: 'CP_CREATED_SUCCESSFULLY',
      data: createdCP,
      status: httpStatus.CREATED,
    };
  } catch (err) {
    console.log("🚀 ~ createOrUpdateChannelPartner ~ error:", err);
    return {
      error: true,
      msgCode: 'CP_OPERATION_FAILED',
      status: httpStatus.SERVICE_UNAVAILABLE,
    };
  }
};



module.exports = {
    createOrUpdateChannelPartner,
}