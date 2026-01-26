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

const updateCompany = async (companyId, body, transaction) => {
  try {
    const Company = db.models.company;
    const query = { id: companyId };
    const company = await commonService.updateData(Company, body, query, transaction);

    if (!company || company[0] === 0) {
      return {
        error: true,
        msgCode: "COMPANY_NOT_FOUND",
        status: httpStatus.NOT_FOUND
      };
    }

    return { error: false, msgCode: "COMPANY_UPDATED_SUCCESSFULLY", data: company, status: httpStatus.OK };
  } catch (err) {
    console.error("🚀 updateCompany error:", err);
    return { error: true, msgCode: "COMPANY_UPDATE_FAILED", status: httpStatus.INTERNAL_SERVER_ERROR };
  }
};

const   deleteCompany = async (companyId, transaction) => {
  try {
    const Company = db.models.company;
    const query = { id: companyId };
    const result = await commonService.deleteQuery(Company, query, transaction);

    if (!result) {
      return {
        error: true,
        msgCode: "COMPANY_NOT_FOUND",
        status: httpStatus.NOT_FOUND
      };
    }

    return { error: false, msgCode: "COMPANY_DELETED_SUCCESSFULLY", status: httpStatus.OK };
  } catch (err) {
    console.error("🚀 deleteCompany error:", err);
    return { error: true, msgCode: "COMPANY_DELETE_FAILED", status: httpStatus.INTERNAL_SERVER_ERROR };
  }
};

const blockUnblockCompany = async (companyId, isBlocked, transaction) => {
  try {
    const Company = db.models.company;
    const query = { id: companyId };
    const body = { is_blocked: isBlocked };
    const company = await commonService.updateData(Company, body, query, transaction);

    if (!company || company[0] === 0) {
      return {
        error: true,
        msgCode: "COMPANY_NOT_FOUND",
        status: httpStatus.NOT_FOUND
      };
    }

    return {
      error: false,
      msgCode: isBlocked ? "COMPANY_BLOCKED_SUCCESSFULLY" : "COMPANY_UNBLOCKED_SUCCESSFULLY",
      data: company,
      status: httpStatus.OK
    };
  } catch (err) {
    console.error("🚀 blockUnblockCompany error:", err);
    return { error: true, msgCode: "COMPANY_BLOCK_UNBLOCK_FAILED", status: httpStatus.INTERNAL_SERVER_ERROR };
  }
};

const getCompanyList = async (queryParams) => {
  try {
    const Company = db.models.company;
    const { page = 1, limit = 10, search } = queryParams;
    const offset = (page - 1) * limit;

    let condition = {};
    if (search) {
      condition = {
        [Op.or]: [
          { legal_company_name: { [Op.like]: `%${search}%` } },
          { trade_name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const attributes = undefined; // Fetch all columns
    const order = [['createdAt', 'DESC']];

    const list = await commonService.getList(Company, condition, attributes, parseInt(limit), offset, order);

    return {
      error: false,
      msgCode: "COMPANY_LIST_FETCHED_SUCCESSFULLY",
      data: list || { count: 0, rows: [] },
      status: httpStatus.OK
    };
  } catch (err) {
    console.error("🚀 getCompanyList error:", err);
    return { error: true, msgCode: "COMPANY_LIST_FETCH_FAILED", status: httpStatus.INTERNAL_SERVER_ERROR };
  }
};

module.exports = {
    createCompany,
    updateCompany,
    deleteCompany,
    blockUnblockCompany,
    getCompanyList
}