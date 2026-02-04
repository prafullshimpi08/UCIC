const router = require('express').Router();
const ucicCompany = require('../../../controllers/ucic_company');

router.get('/listUcics', ucicCompany.listUcics);
router.get('/review', ucicCompany.getReviews);


module.exports = router;