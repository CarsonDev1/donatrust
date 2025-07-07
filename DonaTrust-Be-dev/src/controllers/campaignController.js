const { check } = require('express-validator');
const campaignService = require('../services/campaignService');
const validate = require('../middleware/validationMiddleware');

/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: API quản lý chiến dịch (public)
 */

/**
 * @swagger
 * /api/campaigns:
 *   get:
 *     summary: Lấy danh sách tất cả chiến dịch (public)
 *     tags: [Campaigns]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng per trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Lọc theo danh mục
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Lọc theo trạng thái
 *       - in: query
 *         name: charity_id
 *         schema:
 *           type: string
 *         description: Lọc theo tổ chức từ thiện
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Chỉ lấy campaign nổi bật
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [created_at, goal_amount, current_amount, end_date]
 *         description: Sắp xếp theo
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Thứ tự sắp xếp
 *     responses:
 *       200:
 *         description: Danh sách chiến dịch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 campaigns:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 */
exports.getAllCampaigns = async (req, res, next) => {
	try {
		const campaigns = await campaignService.getAllCampaigns(req.query);
		res.json(campaigns);
	} catch (error) {
		next(error);
	}
};

/**
 * @swagger
 * /api/campaigns/{id}:
 *   get:
 *     summary: Lấy chi tiết chiến dịch theo ID (public)
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID chiến dịch
 *     responses:
 *       200:
 *         description: Chi tiết chiến dịch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 campaign_id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 goal_amount:
 *                   type: number
 *                 current_amount:
 *                   type: number
 *                 start_date:
 *                   type: string
 *                 end_date:
 *                   type: string
 *                 category:
 *                   type: string
 *                 status:
 *                   type: string
 *                 charity:
 *                   type: object
 *                 progress_updates:
 *                   type: array
 *       404:
 *         description: Không tìm thấy chiến dịch
 */
exports.getCampaignById = async (req, res, next) => {
	try {
		const campaign = await campaignService.getCampaignById(req.params.id);
		res.json(campaign);
	} catch (error) {
		next(error);
	}
};

/**
 * @swagger
 * /api/campaigns/featured:
 *   get:
 *     summary: Lấy danh sách chiến dịch nổi bật
 *     tags: [Campaigns]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *         description: Số lượng campaign nổi bật
 *     responses:
 *       200:
 *         description: Danh sách campaign nổi bật
 */
exports.getFeaturedCampaigns = async (req, res, next) => {
	try {
		const { limit = 6 } = req.query;
		const campaigns = await campaignService.getAllCampaigns({
			featured: true,
			limit,
			page: 1,
			sort: 'created_at',
			order: 'DESC',
		});
		res.json(campaigns);
	} catch (error) {
		next(error);
	}
};

/**
 * @swagger
 * /api/campaigns/categories:
 *   get:
 *     summary: Lấy danh sách categories
 *     tags: [Campaigns]
 *     responses:
 *       200:
 *         description: Danh sách categories
 */
exports.getCategories = async (req, res, next) => {
	try {
		const categories = [
			{ id: 'education', name: 'Giáo dục', icon: '🎓' },
			{ id: 'health', name: 'Y tế', icon: '🏥' },
			{ id: 'environment', name: 'Môi trường', icon: '🌱' },
			{ id: 'poverty', name: 'Xóa đói giảm nghèo', icon: '🍚' },
			{ id: 'disaster', name: 'Cứu trợ thiên tai', icon: '🆘' },
			{ id: 'children', name: 'Trẻ em', icon: '👶' },
			{ id: 'elderly', name: 'Người cao tuổi', icon: '👴' },
			{ id: 'disability', name: 'Người khuyết tật', icon: '♿' },
			{ id: 'animals', name: 'Bảo vệ động vật', icon: '🐕' },
			{ id: 'community', name: 'Cộng đồng', icon: '🏘️' },
		];
		res.json(categories);
	} catch (error) {
		next(error);
	}
};

exports.create = [
	check('charity_id').notEmpty().withMessage('ID tổ chức là bắt buộc'),
	check('title').notEmpty().withMessage('Tiêu đề là bắt buộc'),
	check('goal_amount').isFloat({ min: 0 }).withMessage('Số tiền mục tiêu không hợp lệ'),
	validate,
	async (req, res, next) => {
		try {
			const campaign = await campaignService.create(req.body);
			res.status(201).json(campaign);
		} catch (error) {
			next(error);
		}
	},
];

exports.getAll = async (req, res, next) => {
	try {
		const campaigns = await campaignService.getAll();
		res.json(campaigns);
	} catch (error) {
		next(error);
	}
};

exports.getById = async (req, res, next) => {
	try {
		const campaign = await campaignService.getById(req.params.id);
		res.json(campaign);
	} catch (error) {
		next(error);
	}
};

exports.update = [
	check('title').optional().notEmpty().withMessage('Tiêu đề không được để trống'),
	validate,
	async (req, res, next) => {
		try {
			const campaign = await campaignService.update(req.params.id, req.body);
			res.json(campaign);
		} catch (error) {
			next(error);
		}
	},
];

exports.delete = async (req, res, next) => {
	try {
		await campaignService.delete(req.params.id);
		res.json({ message: 'Đã xóa chiến dịch' });
	} catch (error) {
		next(error);
	}
};
