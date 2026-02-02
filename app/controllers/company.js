const httpStatus = require('http-status');
const response = require('../response');
const db = require('../models').sequelize;
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
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
    const CompanyUser = db.models.company_user;
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

    await CompanyUser.create(
      {
        company_id: companyId,
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


const addCompanyImage = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const Company = db.models.company;
    const CompanyImage = db.models.company_image;
    const { companyId, imageType } = req.body;

    if (!companyId) {
      throw { msgCode: "MISSING_FIELDS", status: 400 };
    }

    const company = await Company.findByPk(companyId, { transaction });
    if (!company) {
      throw { msgCode: "COMPANY_NOT_FOUND", status: 404 };
    }

    const newImagePayloads = [];

    // 1. Handle Multiple Files Upload
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const b64 = file.buffer.toString('base64');
        const dataURI = "data:" + file.mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: `company_${companyId}`
        });

        newImagePayloads.push({
          company_id: companyId,
          image_url: result.secure_url,
          public_id: result.public_id,
          image_type: imageType
        });
      }
    } 
    // 2. Handle Single URL (if passed as string in body)
    else if (req.body.imageUrl) {
      newImagePayloads.push({
        company_id: companyId,
        image_url: req.body.imageUrl,
        image_type: imageType
      });
    }

    if (newImagePayloads.length === 0) {
      throw { msgCode: "IMAGE_REQUIRED", status: 400 };
    }

    // Find old images to delete from Cloudinary later
    const oldImages = await CompanyImage.findAll({
      where: { company_id: companyId },
      attributes: ['public_id'],
      raw: true,
      transaction
    });

    // Delete old image records from the database
    await CompanyImage.destroy({
      where: { company_id: companyId },
      transaction
    });

    const newImages = await CompanyImage.bulkCreate(newImagePayloads, { transaction });

    await transaction.commit();

    // Asynchronously delete old images from Cloudinary after the transaction is committed
    const publicIdsToDelete = oldImages.map(img => img.public_id).filter(id => id);
    if (publicIdsToDelete.length > 0) {
      cloudinary.api.delete_resources(publicIdsToDelete);
    }

    return response.success(req, res, { msgCode: "IMAGES_ADDED_SUCCESSFULLY", data: newImages }, 201);

  } catch (err) {
    await transaction.rollback();
    console.error("ADD IMAGE ERROR >>>", err);
    return response.error(req, res, { msgCode: err.msgCode || "IMAGE_ADD_FAILED", data: err.data || null }, err.status || 500);
  }
};

const updateCompany = async (req, res) => {
  const transaction = await db.transaction();
  try {
    const { companyId, ...updateData } = req.body;

    if (!companyId) {
      throw { msgCode: "COMPANY_ID_REQUIRED", status: 400 };
    }

    const result = await companyService.updateCompany(companyId, updateData, transaction);

    if (result.error) {
      await transaction.rollback();
      return response.error(req, res, { msgCode: result.msgCode, data: result.data }, 500);
    }
    await transaction.commit();

    return response.success(req, res, { msgCode: result.msgCode, data: { id: companyId, ...updateData } }, result.status || 200);
  } catch (err) {
    // Ensure rollback is only called on an active transaction
    if (transaction && !transaction.finished) await transaction.rollback();
    console.error("UPDATE COMPANY ERROR >>>", err);
    return response.error(req, res, { msgCode: err.msgCode || "COMPANY_UPDATE_FAILED", data: err.data || null }, err.status || 500);
  }
};

const deleteCompany = async (req, res) => {
  const transaction = await db.transaction();
  try {
    const { companyId } = req.body;

    if (!companyId) {
      throw { msgCode: "COMPANY_ID_REQUIRED", status: 400 };
    }

    const result = await companyService.deleteCompany(companyId, transaction);

    if (result.error) {
      await transaction.rollback();
      return response.error(req, res, { msgCode: result.msgCode }, result.status || 404 );
    }
    await transaction.commit();

    return response.success(req, res, { msgCode: result.msgCode, data: { id: companyId } }, result.status || 200);
  } catch (err) {
    // Ensure rollback is only called on an active transaction
    if (transaction && !transaction.finished) await transaction.rollback();
    console.error("DELETE COMPANY ERROR >>>", err);
    return response.error(req, res, { msgCode: err.msgCode || "COMPANY_DELETE_FAILED", data: err.data || null }, err.status || 500);
  }
};

const blockUnblockCompany = async (req, res) => {
  const transaction = await db.transaction();
  try {
    const { companyId, isBlocked } = req.body;

    if (!companyId) {
      throw { msgCode: "COMPANY_ID_REQUIRED", status: 400 };
    }
    if (typeof isBlocked !== 'boolean') {
        throw { msgCode: "IS_BLOCKED_BOOLEAN_REQUIRED", status: 400 };
    }

    const result = await companyService.blockUnblockCompany(companyId, isBlocked, transaction);

    if (result.error) {
      await transaction.rollback();
      return response.error(req, res, { msgCode: result.msgCode, data: result.data }, result.status || 500);
    }
    await transaction.commit();

    return response.success(req, res, { msgCode: result.msgCode, data: result.data }, result.status || 200);
  } catch (err) {
    // Ensure rollback is only called on an active transaction
    if (transaction && !transaction.finished) await transaction.rollback();
    console.error("BLOCK/UNBLOCK COMPANY ERROR >>>", err);
    return response.error(req, res, { msgCode: err.msgCode || "COMPANY_BLOCK_UNBLOCK_FAILED", data: err.data || null }, err.status || 500);
  }
};

const updateCompanyProfileStatus = async (req, res) => {
  const transaction = await db.transaction();
  try {
    const { companyId, isCompanyProfileCompleted } = req.body;

    if (!companyId) {
      throw { msgCode: "COMPANY_ID_REQUIRED", status: 400 };
    }
    if (typeof isCompanyProfileCompleted !== 'boolean') {
        throw { msgCode: "IS_COMPLETED_BOOLEAN_REQUIRED", status: 400 };
    }

    const result = await companyService.updateCompanyProfileStatus(companyId, isCompanyProfileCompleted, transaction);

    if (result.error) {
      await transaction.rollback();
      return response.error(req, res, { msgCode: result.msgCode, data: result.data }, result.status || 500);
    }
    await transaction.commit();

    return response.success(req, res, { msgCode: result.msgCode, data: result.data }, result.status || 200);
  } catch (err) {
    // Ensure rollback is only called on an active transaction
    if (transaction && !transaction.finished) await transaction.rollback();
    console.error("UPDATE PROFILE STATUS ERROR >>>", err);
    return response.error(req, res, { msgCode: err.msgCode || "COMPANY_PROFILE_STATUS_UPDATE_FAILED", data: err.data || null }, err.status || 500);
  }
};

const updateCompanyStatus = async (req, res) => {
  const transaction = await db.transaction();
  try {
    const { companyId, companyStatus } = req.body;

    if (!companyId) {
      throw { msgCode: "COMPANY_ID_REQUIRED", status: 400 };
    }
    if (!companyStatus) {
        throw { msgCode: "COMPANY_STATUS_REQUIRED", status: 400 };
    }

    const result = await companyService.updateCompanyStatus(companyId, companyStatus, transaction);

    if (result.error) {
      await transaction.rollback();
      return response.error(req, res, { msgCode: result.msgCode, data: result.data }, result.status || 500);
    }
    await transaction.commit();

    return response.success(req, res, { msgCode: result.msgCode, data: result.data }, result.status || 200);
  } catch (err) {
    // Ensure rollback is only called on an active transaction
    if (transaction && !transaction.finished) await transaction.rollback();
    console.error("UPDATE COMPANY STATUS ERROR >>>", err);
    return response.error(req, res, { msgCode: err.msgCode || "COMPANY_STATUS_UPDATE_FAILED", data: err.data || null }, err.status || 500);
  }
};

const getCompanyList = async (req, res) => {
  try {
    const result = await companyService.getCompanyList({ ...req.query, ...req.params });

    if (result.error) {
      return response.error(req, res, { msgCode: result.msgCode }, result.status || 500);
    }

    return response.success(req, res, { msgCode: result.msgCode, data: result.data }, result.status || 200);
  } catch (err) {
    console.error("GET COMPANY LIST ERROR >>>", err);
    return response.error(req, res, { msgCode: "COMPANY_LIST_FETCH_FAILED", data: err }, 500);
  }
};

const getTotalCompanyCount = async (req, res) => {
  try {
    const result = await companyService.getTotalCompanyCount();

    if (result.error) {
      return response.error(req, res, { msgCode: result.msgCode }, result.status || 500);
    }

    return response.success(req, res, { msgCode: result.msgCode, data: result.data }, result.status || 200);
  } catch (err) {
    console.error("GET TOTAL COMPANY COUNT ERROR >>>", err);
    return response.error(req, res, { msgCode: "COMPANY_COUNT_FETCH_FAILED", data: err }, 500);
  }
};

const getPendingCompanies = async (req, res) => {
  try {
    const result = await companyService.getPendingCompanies(req.query);

    if (result.error) {
      return response.error(req, res, { msgCode: result.msgCode }, result.status || 500);
    }

    return response.success(req, res, { msgCode: result.msgCode, data: result.data }, result.status || 200);
  } catch (err) {
    console.error("GET PENDING COMPANIES ERROR >>>", err);
    return response.error(req, res, { msgCode: "PENDING_COMPANIES_FETCH_FAILED", data: err }, 500);
  }
};








// console.log(db,"////////");

module.exports = {
  createCompany,
  updateCompanyContactDetails,
  addCompanyImage,
  updateCompany,
  deleteCompany,
  blockUnblockCompany,
  updateCompanyProfileStatus,
  updateCompanyStatus,
  getCompanyList,
  getTotalCompanyCount,
  getPendingCompanies,
}