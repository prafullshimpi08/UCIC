    const router = require('express').Router();
    // const uploadFiles = require('shared-services').upload;

    // const { verifyAuthToken, authorization,verifyLinkToken, checkBasicAuth } = require('shared-services').auth;
    // const { validate, checkProfileStatus, checkLoanExistence, checkApplicantExistence, checkLoanExistenceForEEL,
    //     checkApplicantExistenceForEEL,
    //     checkEnquiryExistence
    // } = require('../../../middleware');


    //const { QUERY } = require('../../../constant/constant').REQUEST_INPUT_TYPE;
    // const multer = require('multer');
    // const upload = multer({ storage: multer.memoryStorage() });
    const crmControllers = require('../../../controllers/crm');

    // const crmSchema = require('../../../validation/crm');
    // const { checkVisitExistence, checkLeadExistence, checkEnquiryAndLead,checkExistingVisitToday, checkExistenceCP  } = require('../../../middleware/userLoanApp');

    // router.post('/create-cp',verifyAuthToken,validate(crmSchema.createChannelPartner),crmControllers.createOrUpdateChannelPartner);

    router.post('/createUser',crmControllers.createOrUpdateChannelPartner);

    module.exports = router;