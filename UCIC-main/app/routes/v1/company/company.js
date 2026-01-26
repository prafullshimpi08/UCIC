    const router = require('express').Router();
   
    const companyController = require('../../../controllers/company');


    router.post('/createCompany',companyController.createCompany);
    router.post('/updateContactDetails',companyController.updateCompanyContactDetails);

    module.exports = router;