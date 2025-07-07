const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Admin Management
 *   description: API quản lý hệ thống dành cho admin
 */

// Apply auth middleware and admin role check to all routes
router.use(authMiddleware);
router.use(requireAdmin);

// ================================
// DASHBOARD
// ================================
router.get('/dashboard/stats', adminController.getDashboardStats);

// ================================
// CHARITY MANAGEMENT
// ================================
router.get('/charities', adminController.getAllCharities);
router.get('/charities/pending', adminController.getPendingCharities);
router.get('/charities/:id', adminController.getCharityById);
router.put('/charities/:id/verify', adminController.verifyCharity);

// ================================
// PROJECT APPROVAL
// ================================
router.get('/campaigns', adminController.getAllCampaigns);
router.get('/campaigns/pending', adminController.getPendingCampaigns);
router.put('/campaigns/:id/approve', adminController.approveCampaign);
router.put('/campaigns/:id/reject', adminController.rejectCampaign);

// ================================
// DAO MEMBER MANAGEMENT
// ================================
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/approve-dao', adminController.approveDAOMember);
router.put('/users/:id/reject-dao', adminController.rejectDAOMember);
router.put('/users/:id/ban', adminController.banUser);
router.put('/users/:id/unban', adminController.unbanUser);

// ================================
// VOTING MANAGEMENT
// ================================
router.get('/votes', adminController.getAllVotes);
router.delete('/votes/:id', adminController.deleteVote);

// ================================
// NEWS MANAGEMENT
// ================================
router.post('/news', adminController.createNews);
router.get('/news', adminController.getAllNews);
router.get('/news/:id', adminController.getNewsById);
router.put('/news/:id', adminController.updateNews);
router.delete('/news/:id', adminController.deleteNews);
router.put('/news/:id/publish', adminController.publishNews);

module.exports = router;
