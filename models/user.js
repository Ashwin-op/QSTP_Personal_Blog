const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullName: String,
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    isAdmin: {type: Boolean, default: false}
});

const User = mongoose.model('BlogUser', UserSchema);

module.exports = User;
