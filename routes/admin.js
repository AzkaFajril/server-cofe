const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../Middleware/auth');
const isAdmin = require('../Middleware/isAdmin');

// Admin routes - require both auth and admin role
router.get('/dashboard', auth, isAdmin, adminController.getDashboardStats);
router.get('/users', auth, isAdmin, adminController.getAllUsers);
router.get('/payments', auth, isAdmin, adminController.getAllPayments);
router.put('/orders/:orderId/status', auth, isAdmin, adminController.updateOrderStatus);
router.delete('/users/:userId', auth, isAdmin, adminController.deleteUser);
router.put('/users/:userId', auth, isAdmin, adminController.updateUser);

// Product management routes
router.get('/products', auth, isAdmin, adminController.getAllProducts);
router.post('/products', auth, isAdmin, adminController.createProduct);
router.put('/products/:productId', auth, isAdmin, adminController.updateProduct);
router.delete('/products/:productId', auth, isAdmin, adminController.deleteProduct);

module.exports = router;



