const Category = require('../../models/CategoryModel/categoryModel');

const renderAddCategory = (req, res) => {
  res.render('add-category', { activePage: 'addCategory' });
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    await Category.create({ name, description });
    res.redirect('/pages/categories');
  } catch (err) {
    console.error(err);
    res.redirect('/pages/categories');
  }
};

const renderViewCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.render('view-categories', { categories, activePage: 'viewCategories' });
  } catch (err) {
    console.error(err);
    res.redirect('/pages/dashboard');
  }
};

const renderEditCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.redirect('/pages/categories');
    res.render('edit-category', { category, activePage: 'editCategory' });
  } catch (err) {
    console.error(err);
    res.redirect('/pages/categories');
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.redirect('/pages/categories');

    category.name = name;
    category.description = description;
    await category.save();

    res.redirect('/pages/categories');
  } catch (err) {
    console.error(err);
    res.redirect('/pages/categories');
  }
};

const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/pages/categories');
  } catch (err) {
    console.error(err);
    res.redirect('/pages/categories');
  }
};

module.exports = {
  renderAddCategory,
  createCategory,
  renderViewCategories,
  renderEditCategory,
  updateCategory,
  deleteCategory
};
