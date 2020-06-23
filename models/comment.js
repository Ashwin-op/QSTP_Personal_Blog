const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    comment: {type: String, required: true},
    date: {type: Date, default: Date.now},
    user: {type: String, default: "Unknown"},
});

const Comment = mongoose.model('Comments', CommentSchema);

module.exports = Comment;
