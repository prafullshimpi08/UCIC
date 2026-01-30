const Joi = require('joi');

const createCompany = Joi.object({
    legalCompanyName: Joi.string().required().messages({
        'any.required': 'Legal Company Name is required',
        'string.empty': 'Legal Company Name cannot be empty'
    }),
    tradeName: Joi.string().optional().allow(null, ''),
    cin: Joi.string().optional().allow(null, ''),
    pan: Joi.string().optional().allow(null, ''),
    address: Joi.string().optional().allow(null, ''),
    country: Joi.string().optional().allow(null, ''),
    industryType: Joi.string().optional().allow(null, ''),
    id: Joi.number().integer().optional().allow(null, '')

});

const updateContactDetails = Joi.object({
    companyId: Joi.number().integer().required().messages({
        'any.required': 'Company ID is required'
    }),
    contactPersonName: Joi.string().required().messages({
        'any.required': 'Contact Person Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    }),
    phoneNo: Joi.string().required().messages({
        'any.required': 'Phone Number is required'
    })
});

const addCompanyImage = Joi.object({
    companyId: Joi.number().integer().required().messages({
        'any.required': 'Company ID is required'
    }),
    imageType: Joi.string().optional().allow(null, ''),
    imageUrl: Joi.string().optional().allow(null, '')
});

const updateCompany = Joi.object({
    companyId: Joi.number().integer().required().messages({
        'any.required': 'Company ID is required'
    }),
    legalCompanyName: Joi.string().optional().allow(null, ''),
    tradeName: Joi.string().optional().allow(null, ''),
    cin: Joi.string().optional().allow(null, ''),
    pan: Joi.string().optional().allow(null, ''),
    address: Joi.string().optional().allow(null, ''),
    country: Joi.string().optional().allow(null, ''),
    industryType: Joi.string().optional().allow(null, ''),
    contactPersonName: Joi.string().optional().allow(null, ''),
    email: Joi.string().email().optional().allow(null, ''),
    phoneNo: Joi.string().optional().allow(null, ''),
    isBlocked: Joi.boolean().optional()
});

const deleteCompany = Joi.object({
    companyId: Joi.number().integer().required().messages({
        'any.required': 'Company ID is required'
    })
});

const blockUnblockCompany = Joi.object({
    companyId: Joi.number().integer().required().messages({
        'any.required': 'Company ID is required'
    }),
    isBlocked: Joi.boolean().required().messages({
        'any.required': 'isBlocked status is required',
        'boolean.base': 'isBlocked must be a boolean'
    })
});

const updateProfileStatus = Joi.object({
    companyId: Joi.number().integer().required().messages({
        'any.required': 'Company ID is required'
    }),
    isCompanyProfileCompleted: Joi.boolean().required().messages({
        'any.required': 'isCompanyProfileCompleted status is required',
        'boolean.base': 'isCompanyProfileCompleted must be a boolean'
    })
});

module.exports = {
    createCompany,
    updateContactDetails,
    addCompanyImage,
    updateCompany,
    deleteCompany,
    blockUnblockCompany,
    updateProfileStatus
};