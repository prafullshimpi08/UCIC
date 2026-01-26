const httpStatus = require('http-status');
const response = require('../response');
const db = require('../models').sequelize;
// const Sequelize = require('sequelize');
// const XLSX = require('xlsx');
const companyService = require('../services/crmServices/companyService');
// const commonService = require('../services/common');
// const { USER_TYPE } = require('../constant/constant');
// const { where,literal } = require('sequelize');
// const { Op } = require('sequelize');
// const { REGEX_PATTERN } = require('../constant/constant');

// const states = require('efl_state_codes')
// const cities = require('efl_zip_codes')



const createCompany = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const result = await companyService.createCompany(req.body, req.data, transaction);

    if (result.error) throw result;
    await transaction.commit();

    return response.success(req, res,{ msgCode: result.msgCode, data: result.data },result.status || 201);
  } catch (err) {
    await transaction.rollback();

    console.error("CREATE COMPANY ERROR >>>", err);

    return response.error(req, res,{ msgCode: err.msgCode || "COMPANY_CREATE_FAILED", data: err.data || null },  err.status || 500 );
  }
};


const updateCompanyContactDetails = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const Company = db.models.company;
    const { companyId, contactPersonName, email, phoneNo } = req.body;

    if (!companyId) {
      throw { msgCode: "COMPANY_ID_REQUIRED", status: 400
      };
    }

    const company = await Company.findByPk(companyId, { transaction });

    if (!company) {
      throw { msgCode: "COMPANY_NOT_FOUND", status: 404 };
    }

    await company.update(
      {
        contact_person_name: contactPersonName,
        email: email,
        phone_no: phoneNo
      },
      { transaction }
    );

    await transaction.commit();

    return response.success(req, res, {msgCode: "COMPANY_CONTACT_UPDATED_SUCCESSFULLY", data: company }, 200);

  } catch (err) {
    await transaction.rollback();
    console.error("UPDATE COMPANY ERROR >>>", err);

    return response.error( req, res, { msgCode: err.msgCode || "COMPANY_UPDATE_FAILED", data: err.data || null }, err.status || 500);
  }
};









// console.log(db,"////////");


module.exports = {
  createCompany,
 updateCompanyContactDetails,
  


}