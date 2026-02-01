    const router = require('express').Router();
    const multer = require('multer');
    const path = require('path');
    const fs = require('fs');
   
    const companyController = require('../../../controllers/company');
    const  {
        createCompany,
        updateContactDetails,
        addCompanyImage,
        updateCompany,
        deleteCompany,
        blockUnblockCompany,
        updateProfileStatus,
        updateCompanyStatus
    } = require('../../../validations/companyValidation');
    const validate = require('../../../middleware/validate');

    // Multer Configuration
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir);
    }

    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    router.post('/createCompany', validate(createCompany), companyController.createCompany);
    router.post('/updateContactDetails', validate(updateContactDetails), companyController.updateCompanyContactDetails);
    router.post('/addCompanyImage', upload.array('images'), validate(addCompanyImage), companyController.addCompanyImage);
    router.post('/updateCompany', validate(updateCompany), companyController.updateCompany);
    router.post('/deleteCompany', validate(deleteCompany), companyController.deleteCompany);
    router.post('/blockUnblockCompany', validate(blockUnblockCompany), companyController.blockUnblockCompany);
    router.post('/updateCompanyProfileStatus', validate(updateProfileStatus), companyController.updateCompanyProfileStatus);
    router.post('/changeCompanyStatus', validate(updateCompanyStatus), companyController.updateCompanyStatus);
    router.get('/getCompanyList', companyController.getCompanyList);
    
    router.get('/getTotalCompanyCount', companyController.getTotalCompanyCount);
    router.get('/getPendingCompanies', companyController.getPendingCompanies);
    // router.get('/getCompanyList/:id', companyController.getCompanyList);

    module.exports = router;