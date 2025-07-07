const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: API quản lý hồ sơ người dùng
 */

// Cấu hình multer cho upload file
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/avatars/');
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, req.user.user_id + '-' + uniqueSuffix + '-' + file.originalname);
	},
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
	},
	fileFilter: function (req, file, cb) {
		if (file.mimetype.startsWith('image/')) {
			cb(null, true);
		} else {
			cb(new Error('Chỉ cho phép upload file ảnh'), false);
		}
	},
});

// Apply auth middleware to all routes
router.use(authMiddleware);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);
router.post('/upload-avatar', upload.single('avatar'), userController.uploadAvatar);
router.put('/deactivate', userController.deactivateAccount);

module.exports = router;
