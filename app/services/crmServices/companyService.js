const db = require('../../models').sequelize;
const httpStatus = require('http-status');
const { Op } = require("sequelize");
const { toIntBoolean } = require('../../utils/helper');
// const { commonService } = require('shared-services');
// const { LOAN_APPLICATION_ID, APPLICANT_TYPE, LEAD_STATUS, PROSPECT_STATUS, EMPANELMENT_DOCTYPES } = require('../../constant/constant');
// const { generateApplicationId } = require('../../utils/helper');
// const axios = require('axios');


const commonService = require('../common');


const createCompany = async (body, loginDetails, transaction) => {
  try {
    // const { Company } = db.models;

    const Company = db.models.company; 

    if (body.id) {
      const updatePayload = {
        legal_company_name: body.legalCompanyName,
        trade_name: body.tradeName,
        cin: body.cin,
        pan: body.pan,
        address: body.address,
        country: body.country,
        industry_type: body.industryType,
      };

      // Remove undefined keys
      Object.keys(updatePayload).forEach(key => updatePayload[key] === undefined && delete updatePayload[key]);

      const query = { id: body.id };

      // Check PAN uniqueness if provided (excluding current record)
      if (body.pan) {
        const existingWithPan = await commonService.findByCondition(Company, { pan: body.pan, id: { [Op.ne]: body.id } });
        if (existingWithPan) {
          return { error: true, msgCode: "COMPANY_WITH_PAN_EXISTS", status: httpStatus.CONFLICT };
        }
      }

      const updated = await commonService.updateData(Company, updatePayload, query, transaction);

      if (!updated || updated[0] === 0) {
        return { error: true, msgCode: "COMPANY_NOT_FOUND", status: httpStatus.NOT_FOUND };
      }
      const updatedCompany = await Company.findByPk(body.id, { transaction });
      return { error: false, msgCode: "COMPANY_UPDATED_SUCCESSFULLY", data: updatedCompany, status: httpStatus.OK };
    }

    if (body.pan) {
      const existingCompany = await commonService.findByCondition(Company, { pan: body.pan });
      if (existingCompany) {
        return {
          error: true,
          msgCode: "COMPANY_WITH_PAN_EXISTS",
          status: httpStatus.CONFLICT
        };
      }
    }

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

const updateCompanyProfileStatus = async (companyId, isCompanyProfileCompleted, transaction) => {
  try {
    const Company = db.models.company;
    const query = { id: companyId };
    const body = { is_company_profile_completed: isCompanyProfileCompleted };
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
      msgCode: "COMPANY_PROFILE_STATUS_UPDATED",
      // data: company,
      data: { id: companyId, is_company_profile_completed: isCompanyProfileCompleted },
      status: httpStatus.OK
    };
  } catch (err) {
    console.error("🚀 updateCompanyProfileStatus error:", err);
    return { error: true, msgCode: "COMPANY_PROFILE_STATUS_UPDATE_FAILED", status: httpStatus.INTERNAL_SERVER_ERROR };
  }
};

const updateCompanyStatus = async (companyId, status, transaction) => {
  try {
    const Company = db.models.company;
    const query = { id: companyId };
    const body = { company_status: status };
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
      msgCode: "COMPANY_STATUS_UPDATED",
      data: { id: companyId, company_status: status },
      status: httpStatus.OK
    };
  } catch (err) {
    console.error("🚀 updateCompanyStatus error:", err);
    return { error: true, msgCode: "COMPANY_STATUS_UPDATE_FAILED", status: httpStatus.INTERNAL_SERVER_ERROR };
  }
};

const getCompanyList = async (queryParams) => {
  try {
    const Company = db.models.company;
    const CompanyImage = db.models.company_image;
    const { page = 1, limit = 10, search, id } = queryParams;
    const offset = (page - 1) * limit;

    const includeOptions = [{
      model: CompanyImage,
      as: 'images',
      attributes: ['id', 'image_url', 'image_type', 'public_id']
    }];

    if (id) {
      const company = await Company.findOne({ where: { id }, include: includeOptions });
      if (!company) {
        return { error: true, msgCode: "COMPANY_NOT_FOUND", status: httpStatus.NOT_FOUND };
      }
      return {
        error: false,
        msgCode: "COMPANY_FETCHED_SUCCESSFULLY",
        data: company,
        status: httpStatus.OK
      };
    }

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

    const order = [['createdAt', 'DESC']];

    const list = await Company.findAndCountAll({
      where: condition,
      limit: parseInt(limit),
      offset: offset,
      order: order,
      include: includeOptions,
      distinct: true
    });

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

const createSubscriptionPlan = async (body, loginDetails, transaction) => {
  try {
    const SubscriptionPlan = db.models.subscription_plan;

    const rawFeatures = body.features || {};

    const subscriptionPayload = {
      plan_name: body.planName,
      monthly_price: body.monthlyPrice,
      records_per_month: body.recordsPerMonth,
      aum_limit_cr: body.aumLimitCr,
      number_of_users: body.numberOfUsers,
      support_level: body.supportLevel,

      // ✅ FIXED: 0/1/true/false 
      sso_support: toIntBoolean(rawFeatures.ssoSupport),
      api_access: toIntBoolean(rawFeatures.apiAccess),  
      custom_reports: toIntBoolean(rawFeatures.customReports),
      phone_support: toIntBoolean(rawFeatures.phoneSupport),
      dedicated_account_manager: toIntBoolean(rawFeatures.dedicatedAccountManager),

      status: body.status || 'ACTIVE'
      // created_by: loginDetails.userId 
    };

    const subscription = await commonService.create(
      SubscriptionPlan,
      subscriptionPayload,
      transaction
    );

    if (!subscription) {
      return {
        error: true,
        msgCode: 'SUBSCRIPTION_NOT_CREATED',
        status: httpStatus.SERVICE_UNAVAILABLE
      };
    }

    return {
      error: false,
      msgCode: 'SUBSCRIPTION_CREATED_SUCCESSFULLY',
      data: subscription,
      status: httpStatus.CREATED
    };

  } catch (err) {
    console.error('🚀 createSubscriptionPlan error:', err);

    return {
      error: true,
      msgCode: 'SUBSCRIPTION_CREATE_FAILED',
      status: httpStatus.INTERNAL_SERVER_ERROR
    };
  }
};

const getSubscriptionList = async (queryParams) => {
  try {
    const SubscriptionPlan = db.models.subscription_plan;
    const { page = 1, limit = 10, search } = queryParams;
    const offset = (page - 1) * limit;

    let condition = {};
    if (search) {
      condition = {
        [Op.or]: [
          { plan_name: { [Op.like]: `%${search}%` } },
          { support_level: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const attributes = undefined; 
    const order = [['createdAt', 'DESC']];

    const list = await commonService.getList(
      SubscriptionPlan,
      condition,
      attributes,
      parseInt(limit),
      offset,
      order
    );

    return {
      error: false,
      msgCode: "SUBSCRIPTION_LIST_FETCHED_SUCCESSFULLY",
      data: list || { count: 0, rows: [] },
      status: httpStatus.OK
    };
  } catch (err) {
    console.error("🚀 getSubscriptionList error:", err);
    return {
      error: true,
      msgCode: "SUBSCRIPTION_LIST_FETCH_FAILED",
      status: httpStatus.INTERNAL_SERVER_ERROR
    };
  }
};

const assignSubscriptionPlan = async (body, transaction) => {
  try {
    const Company = db.models.company;
    const SubscriptionPlan = db.models.subscription_plan;
    const CompanySubscription = db.models.company_subscription;

    const { companyId, subscriptionPlanId, status } = body;

    const company = await Company.findByPk(companyId, { transaction });
    if (!company) throw { msgCode: "COMPANY_NOT_FOUND" };

    const subscriptionPlan = await SubscriptionPlan.findByPk(subscriptionPlanId, { transaction });
    if (!subscriptionPlan) throw { msgCode: "SUBSCRIPTION_NOT_FOUND" };

    const alreadyAssigned = await CompanySubscription.findOne({
      where: { company_id: companyId, subscription_plan_id: subscriptionPlanId },
      transaction
    });

    if (alreadyAssigned) throw { msgCode: "SUBSCRIPTION_ALREADY_ASSIGNED" };

    const assign = await commonService.create(CompanySubscription, {
      company_id: companyId,
      subscription_plan_id: subscriptionPlanId,
      status: status || "ACTIVE"
    }, transaction);

    if (!assign) throw { msgCode: "SUBSCRIPTION_ASSIGN_FAILED" };

    return { error: false, msgCode: "SUBSCRIPTION_ASSIGNED_SUCCESSFULLY", data: assign };
  } catch (err) {
    console.error("assignSubscriptionPlan error:", err);
    return { error: true, msgCode: err.msgCode || "SUBSCRIPTION_ASSIGN_FAILED" };
  }
};

const getAssignedSubscriptionList = async (queryParams) => {
  try {
    const { page = 1, limit = 10 } = queryParams;
    const offset = (page - 1) * limit;

    const CompanySubscription = db.models.company_subscription;
    const Company = db.models.company;
    const SubscriptionPlan = db.models.subscription_plan;

    if (!CompanySubscription) {
      throw new Error("company_subscription model not found");
    }

    const list = await CompanySubscription.findAndCountAll({
      limit: parseInt(limit),
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Company,
          as: "company",
          attributes: ["legal_company_name"]
        },
        {
          model: SubscriptionPlan,
          as: "subscriptionPlan",
          attributes: ["plan_name"]
        }
      ]
    });

    return {
      error: false,
      msgCode: "ASSIGNED_SUBSCRIPTION_LIST_FETCHED_SUCCESSFULLY",
      data: list,
      status: 200
    };
  } catch (error) {
    console.error("getAssignedSubscriptionList error:", error);
    return {
      error: true,
      msgCode: "ASSIGNED_SUBSCRIPTION_LIST_FETCH_FAILED",
      status: 500
    };
  }
};

module.exports = {
    createCompany,
    updateCompany,
    deleteCompany,
    blockUnblockCompany,
    updateCompanyProfileStatus,
    updateCompanyStatus,
    getCompanyList,
    createSubscriptionPlan,
    getSubscriptionList,
    assignSubscriptionPlan,
    getAssignedSubscriptionList

}