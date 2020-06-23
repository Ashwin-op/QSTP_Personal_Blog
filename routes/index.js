const express = require("express");
const router = express.Router();
const blogs = require("../controllers/blog.js");
const comments = require("../controllers/comment.js");
const auth = require("../controllers/verifyToken.js");

// GET home page
router.get("/blogs", blogs.getBlogs);
router.get("/blogs/:user_id", auth, blogs.getUserBlogs);
router.get("/blog/:blog_id", blogs.getBlogByID);

router.post("/blogs", auth, blogs.createBlog);
router.post("/blog/addComment/:blog_id", auth, comments.createComment);

router.put("/blog/like/:blog_id", auth, blogs.likeBlog);
router.put("/blog/dislike/:blog_id", auth, blogs.disLikeBlog);

router.delete("/blogs/delete/:_id", auth, blogs.deleteBlog);

module.exports = router;
