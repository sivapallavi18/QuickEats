const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuByRestaurant
} = require('../controllers/menuController');

router.route('/')
  .get(getMenuItems)
  .post(protect, authorize('restaurant', 'admin'), createMenuItem);

router.route('/restaurant/:restaurantId')
  .get(getMenuByRestaurant);

router.route('/:id')
  .get(getMenuItem)
  .put(protect, authorize('restaurant', 'admin'), updateMenuItem)
  .delete(protect, authorize('restaurant', 'admin'), deleteMenuItem);

module.exports = router;
