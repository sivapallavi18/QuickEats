const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDeliveryPersons,
  assignDelivery,
  updateDeliveryStatus,
  getMyDeliveries
} = require('../controllers/deliveryController');

router.route('/')
  .get(protect, authorize('admin'), getDeliveryPersons);

router.route('/assign')
  .post(protect, authorize('admin', 'restaurant'), assignDelivery);

router.route('/my-deliveries')
  .get(protect, authorize('delivery'), getMyDeliveries);

router.route('/:id/status')
  .put(protect, authorize('delivery'), updateDeliveryStatus);

module.exports = router;