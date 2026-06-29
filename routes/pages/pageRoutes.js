const pageRouter = require('express').Router();

const {dashboardControllerRender , userdetailsController} = require('../../controller/pages/pageController');
const { renderAddBlog, createBlog, renderViewBlogs, renderEditBlog, updateBlog, deleteBlog } = require('../../controller/pages/blogController');
const multer = require('multer');
const path = require('path');

// configure multer storage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '..', '..', 'public', 'uploads'));
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

	if (req.cookies && req.cookies.userId) {
		return next();
	}

	return res.redirect('/auth/login');
}

pageRouter.get('/dashboard', requireAuth, dashboardControllerRender);
pageRouter.get('/blog/add', requireAuth, renderAddBlog);
pageRouter.post('/blog/add', requireAuth, upload.single('image'), createBlog);
pageRouter.get('/blogs', requireAuth, renderViewBlogs);
pageRouter.get('/blog/:id/edit', requireAuth, renderEditBlog);
pageRouter.post('/blog/:id/edit', requireAuth, upload.single('image'), updateBlog);
pageRouter.post('/blog/:id/delete', requireAuth, deleteBlog);


module.exports = {pageRouter};