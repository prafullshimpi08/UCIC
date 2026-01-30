// app/controllers/crm/subscriptionController.js
const db = require('../models').sequelize;
const subscriptionService = require('../services/crmServices/companyService');
const response = require('../response');
const httpStatus = require('http-status');
const { toIntBoolean } = require('../utils/helper');
const { deleteQuery } = require('../services/common');

const createSubscriptionPlan = async (req, res) => {
  const transaction = await db.transaction(); // ✅ start transaction

  try {
    // call service
    const result = await subscriptionService.createSubscriptionPlan(req.body, req.data, transaction);

    if (result.error) throw result;

    await transaction.commit(); // ✅ commit transaction

    return response.success(
      req,
      res,
      { msgCode: result.msgCode, data: result.data },
      result.status || 201
    );
  } catch (err) {
    await transaction.rollback(); // ✅ rollback transaction on error

    console.error("CREATE SUBSCRIPTION PLAN ERROR >>>", err);

    return response.error(
      req,
      res,
      { msgCode: err.msgCode || "SUBSCRIPTION_CREATE_FAILED", data: err.data || null },
      err.status || 500
    );
  }
};

const updateSubscriptionPlan = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const SubscriptionPlan = db.models.subscription_plan;
    const { planId, planName, monthlyPrice, recordsPerMonth, aumLimitCr, numberOfUsers, supportLevel, features, status } = req.body;

    if (!planId) {
      throw { msgCode: "SUBSCRIPTION_ID_REQUIRED", status: 400 };
    }

    const plan = await SubscriptionPlan.findByPk(planId, { transaction });

    if (!plan) {
      throw { msgCode: "SUBSCRIPTION_NOT_FOUND", status: 404 };
    }

    // Normalize features to 1 / 0
    
    const rawFeatures = features || {};
    const normalizedFeatures = {
      sso_support: toIntBoolean(rawFeatures.ssoSupport),
      api_access: toIntBoolean(rawFeatures.apiAccess),
      custom_reports: toIntBoolean(rawFeatures.customReports),
      phone_support: toIntBoolean(rawFeatures.phoneSupport),
      dedicated_account_manager: toIntBoolean(rawFeatures.dedicatedAccountManager)
    };

    await plan.update(
      {
        plan_name: planName,
        monthly_price: monthlyPrice,
        records_per_month: recordsPerMonth,
        aum_limit_cr: aumLimitCr,
        number_of_users: numberOfUsers,
        support_level: supportLevel,
        ...normalizedFeatures,
        status: status || plan.status
      },
      { transaction }
    );

    await transaction.commit();

    return response.success(req, res, { msgCode: "SUBSCRIPTION_UPDATED_SUCCESSFULLY", data: plan }, 200);

  } catch (err) {
    await transaction.rollback();
    console.error("UPDATE SUBSCRIPTION PLAN ERROR >>>", err);

    return response.error(
      req,
      res,
      { msgCode: err.msgCode || "SUBSCRIPTION_UPDATE_FAILED", data: err.data || null },
      err.status || 500
    );
  }
};


const deleteSubscriptionPlan = async (req, res) => {
  const transaction = await db.transaction();
  try {
    const { planId } = req.body;
    if (!planId) throw { msgCode: "SUBSCRIPTION_ID_REQUIRED", status: 400 };

    const result = await deleteQuery(db.models.subscription_plan, { id: planId }, transaction, true);

    if (!result) throw { msgCode: "SUBSCRIPTION_DELETE_FAILED", status: 500 };

    await transaction.commit();
    return response.success(req, res, { msgCode: "SUBSCRIPTION_DELETED_SUCCESSFULLY", data: result }, 200);

  } catch (err) {
    await transaction.rollback();
    return response.error(
      req, 
      res, 
      { msgCode: err.msgCode || "SUBSCRIPTION_DELETE_FAILED", data: err.data || null }, 
      err.status || 500
    );
  }
};

const getSubscriptionList = async (req, res) => {
  try {
    const result = await subscriptionService.getSubscriptionList(req.query);

    if (result.error) {
      return response.error(
        req,
        res,
        { msgCode: result.msgCode },
        result.status || 500
      );
    }

    return response.success(
      req,
      res,
      {
        msgCode: result.msgCode,
        data: result.data
      },
      result.status || 200
    );
  } catch (err) {
    console.error("GET SUBSCRIPTION LIST ERROR >>>", err);
    return response.error(
      req,
      res,
      { msgCode: "SUBSCRIPTION_LIST_FETCH_FAILED", data: err },
      500
    );
  }
};


const assignSubscription = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const result = await subscriptionService.assignSubscriptionPlan(req.body, transaction);

    if (result.error) throw result;

    await transaction.commit();

    return response.success(req,res,{ msgCode: result.msgCode, data: result.data },200);
  } catch (err) {
    await transaction.rollback();

    console.error("ASSIGN SUBSCRIPTION ERROR >>>", err);

    return response.error(
      req,
      res,
      { msgCode: err.msgCode || "SUBSCRIPTION_ASSIGN_FAILED", data: err.data || null },
      err.status || 500
    );
  }
};

const getAssignedSubscriptionList = async (req, res) => {
  try {
    const result = await subscriptionService.getAssignedSubscriptionList(req.query);

    if (result.error) {
      return response.error(
        req,
        res,
        { msgCode: result.msgCode },
        result.status || 500
      );
    }

    return response.success(
      req,
      res,
      {
        msgCode: result.msgCode,
        data: result.data
      },
      result.status || 200
    );
  } catch (error) {
    console.error("GET ASSIGNED SUBSCRIPTION LIST ERROR >>>", error);
    return response.error(
      req,
      res,
      { msgCode: "ASSIGNED_SUBSCRIPTION_LIST_FETCH_FAILED", data: error },
      500
    );
  }
};



module.exports = {
  createSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
    getSubscriptionList,
    assignSubscription,
    getAssignedSubscriptionList


};
