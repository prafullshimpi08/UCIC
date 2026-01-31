const httpStatus = require("http-status");
const db = require("../../models").sequelize
const commonService = require("../common");
const { Op } = require("sequelize");


// const BasicInfo = async (body, loginDetails, transaction) => {
//   try {
//     console.log('DB MODELS >>', Object.keys(db)); 
// const UcicManage = db['ucic_manage'];

//     const payload = {
//       company_name: body.company_name,
//       company_type: body.company_type,
//       registration_number: body.registration_number,
//       pan_number: body.pan_number,
//       gst_number: body.gst_number,
//       status: 'DRAFT', 
//     };

//     const company = await commonService.create(UcicManage, payload, transaction);

//     if (!company) {
//       return {
//         error: true,
//         msgCode: 'COMPANY_NOT_CREATED',
//         status: httpStatus.SERVICE_UNAVAILABLE
//       };
//     }

//     return {
//       error: false,
//       msgCode: 'COMPANY_BASICINFO_CREATED',
//       data: company,
//       status: httpStatus.CREATED
//     };

//   } catch (err) {
//     console.error('🚀 BasicInfo Service Error:', err);
//     return {
//       error: true,
//       msgCode: 'COMPANY_BASICINFO_FAILED',
//       status: httpStatus.INTERNAL_SERVER_ERROR
//     };
//   }
// };

const createUcic = async (body, transaction) => {
  try {
    const UcicManage = db.models.ucic_manage;

    const payload = {
  company_name: body.company_name,
  company_type: body.company_type,
  registration_number: body.registration_number,
  pan_number: body.pan_number,
  gst_number: body.gst_number,
  status: "DRAFT"
};


    const ucic = await commonService.create(UcicManage, payload, transaction);

    if (!ucic) {
      return {
        error: true,
        msgCode: "UCIC_NOT_CREATED",
        status: httpStatus.SERVICE_UNAVAILABLE
      };
    }

    return {
      error: false,
      msgCode: "UCIC_CREATED_SUCCESSFULLY",
      data: ucic,
      status: httpStatus.CREATED
    };
  } catch (err) {
    console.error("🚀 createUcic error:", err);
    return {
      error: true,
      msgCode: "UCIC_CREATE_FAILED",
      status: httpStatus.INTERNAL_SERVER_ERROR
    };
  }
};


// const ContactInfo = async (body, loginDetails, transaction) => {
//   try {
// const UcicManage = db['ucic_manage']; 
//     const { id, contact_person, designation, email, phone, address, city, state, pincode } = body;

//     if (!id) return { error: true, msgCode: "ID_REQUIRED", status: 400 };

//     const existing = await commonService.findByCondition(UcicManage, { id });
//     if (!existing) return { error: true, msgCode: "RECORD_NOT_FOUND", status: 404 };

//     const updatePayload = { contact_person, designation, email, phone, address, city, state, pincode };

//     const updatedCount = await commonService.updateData(UcicManage, updatePayload, { id }, transaction);
//     if (!updatedCount) return { error: true, msgCode: "CONTACTINFO_UPDATE_FAILED", status: 500 };

//     const updatedRow = await commonService.findByCondition(UcicManage, { id });

//     return { error: false, msgCode: "CONTACTINFO_UPDATED_SUCCESSFULLY", data: updatedRow, status: 200 };
//   } catch (err) {
//     console.error("🚀 ContactInfo Service Error:", err);
//     return { error: true, msgCode: "CONTACTINFO_UPDATE_FAILED", status: 500 };
//   }
// };

const updateUcicContact = async (ucicId, body, transaction) => {
  try {
    const UcicManage = db.models.ucic_manage;

    const payload = {
  contact_person: body.contact_person,
  designation: body.designation,
  email: body.email,
  phone: body.phone,
  address: body.address,
  state: body.state,
  city: body.city,
  pincode: body.pincode
};


    const condition = { id: ucicId };

    const result = await commonService.updateData(
      UcicManage,
      payload,
      condition,
      transaction
    );

    if (!result || result[0] === 0) {
      return {
        error: true,
        msgCode: "UCIC_NOT_FOUND",
        status: httpStatus.NOT_FOUND
      };
    }

    return {
      error: false,
      msgCode: "UCIC_CONTACT_UPDATED_SUCCESSFULLY",
      status: httpStatus.OK
    };
  } catch (err) {
    console.error("🚀 updateUcicContact error:", err);
    return {
      error: true,
      msgCode: "UCIC_CONTACT_UPDATE_FAILED",
      status: httpStatus.INTERNAL_SERVER_ERROR
    };
  }
};



const updateUcicBusiness = async (ucicId, body, transaction) => {
  try {
    const UcicManage = db.models.ucic_manage;

    const payload = {
  ucic: body.ucic,
  business_type: body.business_type,
  business_description: body.business_description,
  annual_turnover_cr: body.annual_turnover_cr,
  employee_count: body.employee_count,
  bank_name: body.bank_name,
  account_number: body.account_number,
  ifsc_code: body.ifsc_code
};

    const condition = { id: ucicId };

    const result = await commonService.updateData(
      UcicManage,
      payload,
      condition,
      transaction
    );

    if (!result || result[0] === 0) {
      return {
        error: true,
        msgCode: "UCIC_NOT_FOUND",
        status: httpStatus.NOT_FOUND
      };
    }

    return {
      error: false,
      msgCode: "UCIC_BUSINESS_UPDATED_SUCCESSFULLY",
      status: httpStatus.OK
    };
  } catch (err) {
    console.error("🚀 updateUcicBusiness error:", err);
    return {
      error: true,
      msgCode: "UCIC_BUSINESS_UPDATE_FAILED",
      status: httpStatus.INTERNAL_SERVER_ERROR
    };
  }
};

const createState = async (body, transaction) => {
  try {
    // console.log("MODELS >>>", Object.keys(db.models));

    const State = db.models.state;

    const payload = {
      name: body.name
    };

    const state = await commonService.create(State, payload, transaction);

    if (!state) {
      return {
        error: true,
        msgCode: "STATE_NOT_CREATED",
        status: httpStatus.SERVICE_UNAVAILABLE
      };
    }

    return {
      error: false,
      msgCode: "STATE_CREATED_SUCCESSFULLY",
      data: state,
      status: httpStatus.CREATED
    };
  } catch (err) {
    console.error("🚀 createState error:", err);
    return {
      error: true,
      msgCode: "STATE_CREATE_FAILED",
      status: httpStatus.INTERNAL_SERVER_ERROR
    };
  }
};

const updateState = async (body, transaction) => {
  try {
    const State = db.models.state;

    const query = { id: body.stateId };

    const result = await commonService.updateData(State, { name: body.name }, query, transaction);

    if (!result || result[0] === 0) {
      return {
        error: true,
        msgCode: "STATE_NOT_FOUND",
        status: httpStatus.NOT_FOUND
      };
    }

    return {
      error: false,
      msgCode: "STATE_UPDATED_SUCCESSFULLY",
      data: { id: body.stateId, name: body.name },
      status: httpStatus.OK
    };

  } catch (err) {
    console.error("🚀 updateState error:", err);
    return {
      error: true,
      msgCode: "STATE_UPDATE_FAILED",
      status: httpStatus.INTERNAL_SERVER_ERROR
    };
  }
};


const getAllStates = async () => {
  try {
    const State = db.models.state;

    const states = await commonService.getList(State, null, ["id", "name"], null, null, [["name", "ASC"]]);

    if (!states || !states.rows.length) {
      return { error: true, msgCode: "NO_STATES_FOUND", status: httpStatus.NOT_FOUND };
    }

    return { error: false, msgCode: "STATES_FETCHED_SUCCESSFULLY", data: states.rows, status: httpStatus.OK };

  } catch (err) {
    console.error("🚀 getAllStates error:", err);
    return { error: true, msgCode: "STATES_FETCH_FAILED", status: httpStatus.INTERNAL_SERVER_ERROR };
  }
};


const createCity = async (body, transaction) => {
  try {
    const City = db.models.city;

    if (!body.stateId || !body.name) {
      return { error: true, msgCode: "CITY_NAME_STATEID_REQUIRED", status: httpStatus.BAD_REQUEST };
    }

    const payload = {
      name: body.name,
      state_id: body.stateId
    };

    const city = await commonService.create(City, payload, transaction);

    if (!city) {
      return { error: true, msgCode: "CITY_NOT_CREATED", status: httpStatus.SERVICE_UNAVAILABLE };
    }

    return { error: false, msgCode: "CITY_CREATED_SUCCESSFULLY", data: city, status: httpStatus.CREATED };

  } catch (err) {
    console.error("🚀 createCity error:", err);
    return { error: true, msgCode: "CITY_CREATE_FAILED", status: httpStatus.INTERNAL_SERVER_ERROR };
  }
};

// UPDATE CITY
const updateCity = async (body, transaction) => {
  try {
    const City = db.models.city;

    if (!body.cityId) {
      return { error: true, msgCode: "CITY_ID_REQUIRED", status: httpStatus.BAD_REQUEST };
    }

    const query = { id: body.cityId };
    const data = { name: body.name };

    if (body.stateId) data.state_id = body.stateId;

    const result = await commonService.updateData(City, data, query, transaction);

    if (!result || result[0] === 0) {
      return { error: true, msgCode: "CITY_NOT_FOUND", status: httpStatus.NOT_FOUND };
    }

    return { error: false, msgCode: "CITY_UPDATED_SUCCESSFULLY", data: result, status: httpStatus.OK };

  } catch (err) {
    console.error("🚀 updateCity error:", err);
    return { error: true, msgCode: "CITY_UPDATE_FAILED", status: httpStatus.INTERNAL_SERVER_ERROR };
  }
};


// GET ALL CITIES (filter by stateId if provided)
const getAllCities = async (stateId = null) => {
  try {
    const City = db.models.city;
    let condition = {};

    if (stateId) {
      condition.state_id = stateId; // filter by selected state
    }

    const cities = await commonService.getList(
      City,
      Object.keys(condition).length ? condition : null,
      ["id", "name", "state_id"],
      null,
      null,
      [["name", "ASC"]]
    );

    if (!cities || !cities.rows.length) {
      return { error: true, msgCode: "NO_CITIES_FOUND", status: httpStatus.NOT_FOUND };
    }

    return { error: false, msgCode: "CITIES_FETCHED_SUCCESSFULLY", data: cities.rows, status: httpStatus.OK };

  } catch (err) {
    console.error("🚀 getAllCities error:", err);
    return { error: true, msgCode: "CITIES_FETCH_FAILED", status: httpStatus.INTERNAL_SERVER_ERROR };
  }
};

const getUcicList = async (queryParams) => {
  try {
    const UcicManage = db.models.ucic_manage;
    const { page = 1, limit = 10, search, id } = queryParams;
    const offset = (page - 1) * limit;

    if (id) {
      const ucic = await UcicManage.findByPk(id);
      if (!ucic) {
        return { error: true, msgCode: "UCIC_NOT_FOUND", status: httpStatus.NOT_FOUND };
      }
      return {
        error: false,
        msgCode: "UCIC_FETCHED_SUCCESSFULLY",
        data: ucic,
        status: httpStatus.OK
      };
    }

    let condition = {};
    if (search) {
      condition = {
        [Op.or]: [
          { company_name: { [Op.like]: `%${search}%` } },
          { registration_number: { [Op.like]: `%${search}%` } },
          { pan_number: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const order = [['id', 'DESC']];

    const list = await UcicManage.findAndCountAll({
      where: condition,
      limit: parseInt(limit),
      offset: offset,
      order: order,
      distinct: true
    });

    return {
      error: false,
      msgCode: "UCIC_LIST_FETCHED_SUCCESSFULLY",
      data: list || { count: 0, rows: [] },
      status: httpStatus.OK
    };
  } catch (err) {
    console.error("🚀 getUcicList error:", err);
    return { error: true, msgCode: "UCIC_LIST_FETCH_FAILED", status: httpStatus.INTERNAL_SERVER_ERROR };
  }
};




module.exports = {
  createUcic,
  updateUcicContact,
  updateUcicBusiness,
  createState,
  updateState,
  getAllStates,
  createCity,
  updateCity,
  getAllCities,
  getUcicList
};
