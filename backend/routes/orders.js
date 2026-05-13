const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getMyOrders,
  getRestaurantOrders
} = require('../controllers/orderController');

router.route('/')
  .post(protect, createOrder)
  .get(protect, authorize('admin'), getOrders);

router.route('/my-orders')
  .get(protect, getMyOrders);

router.route('/restaurant/:restaurantId')
  .get(protect, authorize('restaurant', 'admin'), getRestaurantOrders);

router.route('/:id')
  .get(protect, getOrder);

router.route('/:id/status')
  .put(protect, updateOrderStatus);

module.exports = router;