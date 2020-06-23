const Blog = require("../models/blog.js");
const Comment = require("../models/comment.js");
const mongoose = require("mongoose");

exports.createComment = async (req, res, next) => {
    const {comment, user_name} = req.body;
    const blog_id = req.params.blog_id;

    if (mongoose.isValidObjectId(blog_id)) {
        const blog = await Blog.findById(blog_id)
            .populate("comments")
            .populate("user");

        await new Comment({
            comment,
            user: user_name,
        }).save(async (err, comment) => {
            if (err) res.status(500).json(err);

            blog.comments.unshift(comment._id);
            const updatedBlog = await blog.save();

            Blog.findById(blog_id)
                .populate("comments")
                .populate("user")
                .then(result => res.json(result.comments))
                .catch(error => res.status(501).json({error}));
        });
    } else {
        res.send(502).json("Invalid ID");
    }
};
