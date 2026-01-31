const router = require('express').Router();
const ucicManageController = require('../../../controllers/ucic_manage');

router.post('/Basicinfo', ucicManageController.createUcic);
router.put('/Contactinfo', ucicManageController.updateUcicContact);
router.put('/BusinessDetails', ucicManageController.updateUcicBusiness);


router.post('/createState', ucicManageController.createState);
router.put('/updateState', ucicManageController.updateState);
router.get('/getAllStates', ucicManageController.getAllStates);

router.post('/createCity', ucicManageController.createCity);
router.put('/updateCity', ucicManageController.updateCity);
router.get('/getAllCities', ucicManageController.getAllCities);

router.get('/getUcicList', ucicManageController.getUcicList);
// router.get('/getUcicList/:id', ucicManageController.getUcicList);


module.exports = router;
