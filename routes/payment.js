const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../Middleware/auth');

// Payment routes
router.post('/create-payment-intent', auth, paymentController.createPaymentIntent);

module.exports = router;
