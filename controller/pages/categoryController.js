const Category = require('../../models/CategoryModel/categoryModel');

const renderAddCategory = (req, res) => {
  res.render('add-category', { activePage: 'addCategory' });
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || name.trim().length < 4) {
      req.flash('error', 'Category name must be at least 4 characters long.');
      return res.redirect('/pages/category/add');
    }

    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });
    if (existingCategory) {
      req.flash('error', 'Category already exists. Duplicate category names are not allowed.');
      return res.redirect('/pages/category/add');
    }

    await Category.create({ name: name.trim(), description });
    req.flash('success', 'Category created successfully.');
    res.redirect('/pages/categories');
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      req.flash('error', 'Category already exists. Duplicate category names are not allowed.');
    } else if (err.errors && err.errors.name) {
      req.flash('error', err.errors.name.message);
    } else {
      req.flash('error', 'Failed to create category.');
    }
    res.redirect('/pages/category/add');
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
    if (!name || name.trim().length < 4) {
      req.flash('error', 'Category name must be at least 4 characters long.');
      return res.redirect(`/pages/category/${req.params.id}/edit`);
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      req.flash('error', 'Category not found.');
      return res.redirect('/pages/categories');
    }

    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      _id: { $ne: req.params.id }
    });
    if (existingCategory) {
      req.flash('error', 'Category already exists. Duplicate category names are not allowed.');
      return res.redirect(`/pages/category/${req.params.id}/edit`);
    }

    category.name = name.trim();
    category.description = description;
    await category.save();

    req.flash('success', 'Category updated successfully.');
    res.redirect('/pages/categories');
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      req.flash('error', 'Category already exists. Duplicate category names are not allowed.');
    } else if (err.errors && err.errors.name) {
      req.flash('error', err.errors.name.message);
    } else {
      req.flash('error', 'Failed to update category.');
    }
    res.redirect(`/pages/category/${req.params.id}/edit`);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      req.flash('error', 'Category not found.');
      return res.redirect('/pages/categories');
    }

    await category.deleteOne();
    req.flash('success', 'Category deleted successfully.');
    res.redirect('/pages/categories');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete category.');
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
