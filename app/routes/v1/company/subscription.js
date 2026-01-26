 const router = require('express').Router();

const { routes } = require('..');
 const subscriptionController = require('../../../controllers/subscription');


router.post('/createSubscriptionPlan',subscriptionController.createSubscriptionPlan);
router.put('/updateSubscriptionPlan', subscriptionController.updateSubscriptionPlan);
router.delete('/deleteSubscriptionPlan', subscriptionController.deleteSubscriptionPlan);

// List Subscription Plans
router.get('/listSubscriptionPlans', subscriptionController.getSubscriptionList);

// Assign Subscription Plan to Company
router.post('/assignSubscription', subscriptionController.assignSubscription);

router.get("/assignedSubscriptionList", subscriptionController.getAssignedSubscriptionList);



module.exports = router;

