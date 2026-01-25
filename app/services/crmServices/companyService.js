const db = require('../../models').sequelize;
const httpStatus = require('http-status');
const { Op } = require("sequelize");
// const { commonService } = require('shared-services');
// const { LOAN_APPLICATION_ID, APPLICANT_TYPE, LEAD_STATUS, PROSPECT_STATUS, EMPANELMENT_DOCTYPES } = require('../../constant/constant');
// const { generateApplicationId } = require('../../utils/helper');
// const axios = require('axios');


const commonService = require('../common');


const createCompany = async (body, loginDetails, transaction) => {
  try {
    // const { Company } = db.models;

    const Company = db.models.company; 
    const companyPayload = {
      legal_company_name: body.legalCompanyName,
      trade_name: body.tradeName,
      cin: body.cin,
      pan: body.pan,
      address: body.address,
      country: body.country,
      industry_type: body.industryType,
    //   created_by: loginDetails.userId // SuperAdmin ID
    };

    const company = await commonService.create(Company, companyPayload, transaction);

    if (!company) {
      return {
        error: true,
        msgCode: "COMPANY_NOT_CREATED",
        status: httpStatus.SERVICE_UNAVAILABLE
      };
    }

    return {error: false, msgCode: "COMPANY_CREATED_SUCCESSFULLY", data: company, status: httpStatus.CREATED };
  } catch (err) {
    console.error("🚀 createCompany error:", err);

    return { error: true, msgCode: "COMPANY_CREATE_FAILED", status: httpStatus.INTERNAL_SERVER_ERROR};
  }
};




module.exports = {
    createCompany,
}