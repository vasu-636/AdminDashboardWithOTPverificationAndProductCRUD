const Product = require('../../models/ProductModel/productModel');
const Category = require('../../models/CategoryModel/categoryModel');
const fs = require('fs');
const path = require('path');

const renderAddProduct = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.render('add-product', { categories, activePage: 'addProduct' });
  } catch (err) {
    console.error(err);
    res.redirect('/pages/products');
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    if (!name || name.trim().length < 4) {
      if (req.file && req.file.filename) {
        const filePath = path.join(__dirname, '..', '..', 'public', 'uploads', req.file.filename);
        fs.unlink(filePath, () => {});
      }
      req.flash('error', 'Product name must be at least 4 characters long.');
      return res.redirect('/pages/product/add');
    }

    const productData = { name: name.trim(), description, price: Number(price), category, stock: Number(stock) };

    if (req.file && req.file.filename) {
      productData.image = '/public/uploads/' + req.file.filename;
    }

    await Product.create(productData);
    req.flash('success', 'Product created successfully.');
    res.redirect('/pages/products');
  } catch (err) {
    console.error(err);
    if (req.file && req.file.filename) {
      const filePath = path.join(__dirname, '..', '..', 'public', 'uploads', req.file.filename);
      fs.unlink(filePath, () => {});
    }
    if (err.errors && err.errors.name) {
      req.flash('error', err.errors.name.message);
    } else {
      req.flash('error', 'Failed to create product.');
    }
    res.redirect('/pages/product/add');
  }
};

const renderViewProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category').sort({ createdAt: -1 });
    res.render('view-products', { products, activePage: 'viewProducts' });
  } catch (err) {
    console.error(err);
    res.redirect('/pages/dashboard');
  }
};

const renderEditProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    const categories = await Category.find().sort({ name: 1 });
    if (!product) return res.redirect('/pages/products');
    res.render('edit-product', { product, categories, activePage: 'editProduct' });
  } catch (err) {
    console.error(err);
    res.redirect('/pages/products');
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    if (!name || name.trim().length < 4) {
      if (req.file && req.file.filename) {
        const filePath = path.join(__dirname, '..', '..', 'public', 'uploads', req.file.filename);
        fs.unlink(filePath, () => {});
      }
      req.flash('error', 'Product name must be at least 4 characters long.');
      return res.redirect(`/pages/product/${req.params.id}/edit`);
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash('error', 'Product not found.');
      return res.redirect('/pages/products');
    }

    if (req.file && req.file.filename) {
      if (product.image) {
        const existingPath = path.join(__dirname, '..', '..', product.image.replace('/public/', 'public/'));
        fs.unlink(existingPath, () => {});
      }
      product.image = '/public/uploads/' + req.file.filename;
    }

    product.name = name.trim();
    product.description = description;
    product.price = Number(price);
    product.category = category;
    product.stock = Number(stock);
    await product.save();

    req.flash('success', 'Product updated successfully.');
    res.redirect('/pages/products');
  } catch (err) {
    console.error(err);
    if (req.file && req.file.filename) {
      const filePath = path.join(__dirname, '..', '..', 'public', 'uploads', req.file.filename);
      fs.unlink(filePath, () => {});
    }
    if (err.errors && err.errors.name) {
      req.flash('error', err.errors.name.message);
    } else {
      req.flash('error', 'Failed to update product.');
    }
    res.redirect(`/pages/product/${req.params.id}/edit`);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash('error', 'Product not found.');
      return res.redirect('/pages/products');
    }

    if (product.image) {
      const existingPath = path.join(__dirname, '..', '..', product.image.replace('/public/', 'public/'));
      fs.unlink(existingPath, () => {});
    }
    await product.deleteOne();

    req.flash('success', 'Product deleted successfully.');
    res.redirect('/pages/products');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete product.');
    res.redirect('/pages/products');
  }
};

module.exports = {
  renderAddProduct,
  createProduct,
  renderViewProducts,
  renderEditProduct,
  updateProduct,
  deleteProduct
};
