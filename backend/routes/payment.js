const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createPaymentIntent,
  confirmPayment,
  createRazorpayOrder,
  verifyRazorpayPayment
} = require('../controllers/paymentController');

router.post('/stripe/create-intent', protect, createPaymentIntent);
router.post('/stripe/confirm', protect, confirmPayment);
router.post('/razorpay/create-order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

module.exports = router;