 const router = require('express').Router();

const { routes } = require('..');
 const subscriptionController = require('../../../controllers/subscription');


router.post('/createSubscriptionPlan',subscriptionController.createSubscriptionPlan);
router.put('/updateSubscriptionPlan', subscriptionController.updateSubscriptionPlan);
router.delete('/deleteSubscriptionPlan', subscriptionController.deleteSubscriptionPlan);




module.exports = router;

