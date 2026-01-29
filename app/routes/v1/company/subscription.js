const router = require('express').Router();
const subscriptionController = require('../../../controllers/subscription');

router.post('/createSubscriptionPlan', subscriptionController.createSubscriptionPlan);
router.put('/updateSubscriptionPlan', subscriptionController.updateSubscriptionPlan);
router.delete('/deleteSubscriptionPlan', subscriptionController.deleteSubscriptionPlan);

router.get('/listSubscriptionPlans', subscriptionController.getSubscriptionList);
router.post('/assignSubscription', subscriptionController.assignSubscription);
router.get('/assignedSubscriptionList', subscriptionController.getAssignedSubscriptionList);

module.exports = router;
