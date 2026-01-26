    const router = require('express').Router();
    const multer = require('multer');
    const path = require('path');
    const fs = require('fs');
   
    const companyController = require('../../../controllers/company');

    // Multer Configuration
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir);
    }

    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    router.post('/createCompany',companyController.createCompany);
    router.post('/updateContactDetails',companyController.updateCompanyContactDetails);
    router.post('/addCompanyImage', upload.array('images'), companyController.addCompanyImage);
    router.post('/updateCompany', companyController.updateCompany);
    router.post('/deleteCompany', companyController.deleteCompany);
    router.post('/blockUnblockCompany', companyController.blockUnblockCompany);
    router.get('/getCompanyList', companyController.getCompanyList);

    module.exports = router;