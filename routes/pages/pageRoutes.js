const pageRouter = require('express').Router();

const {dashboardControllerRender, profileController, editProfileController, updateProfileController} = require('../../controller/pages/pageController');
const { renderAddCategory, createCategory, renderViewCategories, renderEditCategory, updateCategory, deleteCategory } = require('../../controller/pages/categoryController');
const { renderAddProduct, createProduct, renderViewProducts, renderEditProduct, updateProduct, deleteProduct } = require('../../controller/pages/productController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, '..', '..', 'public', 'uploads');

try {
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir, { recursive: true });
	}
} catch (error) {
	console.warn('[Vercel Warning] Could not create local uploads folder on read-only filesystem:', error.message);
}

// configure multer storage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		const name = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
		cb(null, name);
	}
});
const upload = multer({ storage: storage });

function requireAuth(req, res, next) {
	if (req.isAuthenticated && req.isAuthenticated()) {
		return next();
	}

	return res.redirect('/auth/login');
}

pageRouter.get('/dashboard', requireAuth, dashboardControllerRender);
pageRouter.get('/category/add', requireAuth, renderAddCategory);
pageRouter.post('/category/add', requireAuth, createCategory);
pageRouter.get('/categories', requireAuth, renderViewCategories);
pageRouter.get('/category/:id/edit', requireAuth, renderEditCategory);
pageRouter.post('/category/:id/edit', requireAuth, updateCategory);
pageRouter.post('/category/:id/delete', requireAuth, deleteCategory);
pageRouter.get('/product/add', requireAuth, renderAddProduct);
pageRouter.post('/product/add', requireAuth, upload.single('image'), createProduct);
pageRouter.get('/products', requireAuth, renderViewProducts);
pageRouter.get('/product/:id/edit', requireAuth, renderEditProduct);
pageRouter.post('/product/:id/edit', requireAuth, upload.single('image'), updateProduct);
pageRouter.post('/product/:id/delete', requireAuth, deleteProduct);
pageRouter.get('/profile', requireAuth, profileController);
pageRouter.get('/profile/edit', requireAuth, editProfileController);
pageRouter.post('/profile', requireAuth, upload.single('profileImage'), updateProfileController);


module.exports = {pageRouter};