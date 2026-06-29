const Blog = require('../../models/BlogModel/blogModel');
const fs = require('fs');
const path = require('path');

const renderAddBlog = (req, res) => {
    console.log("Add Blog Page Rendered Successfully !");

  res.render('add-blog');
};

const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blogData = { title, content };
    if (req.file && req.file.filename) {
      blogData.image = '/public/uploads/' + req.file.filename;
    }
    await Blog.create(blogData);
    console.log("Blog Created Successfully !");

    res.redirect('/pages/blogs');
  } catch (err) {
    console.error(err);
  }
};

const renderViewBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    console.log("View Page Loaded Successfully !");
    res.render('view-blogs', { blogs });
  } catch (err) {
    console.error(err);
  }
};

const renderEditBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog){
        console.log("Render Page Loaded Successfully !");
        return res.redirect('/pages/blogs');
    } 
    res.render('edit-blog', { blog });
  } catch (err) {
    console.error(err);
  }
};

const updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.redirect('/pages/blogs');

    if (req.file && req.file.filename) {
      if (blog.image) {
        const existingPath = path.join(__dirname, '..', '..', blog.image.replace('/public/', 'public/'));
        fs.unlink(existingPath, (err) => { /* ignore errors */ });
      }
      blog.image = '/public/uploads/' + req.file.filename;
    }
    blog.title = title;
    blog.content = content;
    await blog.save();

    console.log("Blog Updated Successfully !  UpdatedBlog => ",blog);

    res.redirect('/pages/blogs');
  } catch (err) {
    console.error(err);
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      if (blog.image) {
        const existingPath = path.join(__dirname, '..', '..', blog.image.replace('/public/', 'public/'));
        fs.unlink(existingPath, (err) => {  });
      }
      await blog.deleteOne();

      console.log("Blog Deleted Successfully !");
    }
    res.redirect('/pages/blogs');
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  renderAddBlog,
  createBlog,
  renderViewBlogs,
  renderEditBlog,
  updateBlog,
  deleteBlog
};
