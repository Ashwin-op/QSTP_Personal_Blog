const User = require("../models/user.js");
const Blog = require('../models/blog.js');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateSchema = require("./validationSchemas/index.js");
const {loginValidation, registerValidation,} = require("./validationSchemas/index.js");

exports.createUser = async (req, res, next) => {
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).json("Email already exists, please login with your ID");

    const userNameExist = await User.findOne({username: req.body.username});
    if (userNameExist) return res.status(400).json("Username  Exists, please select another username");

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const new_user = await new User({
        fullName: req.body.name,
        password: hashedPassword,
        username: req.body.username,
        email: req.body.email,
    });

    const savedUser = new_user.save(err => {
        if (err) res.status(400).json(err.errmsg);
        res.json(`User created! Please login with your credentials`);
    });
};

exports.getUsers = async (req, res, next) => {
    console.log(req.user);
    const users = await User.find({});
    res.send(users);
};

exports.login = async (req, res, next) => {
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const user = await User.findOne({username: req.body.username});
    if (!user) return res.status(400).json("Username doesn't exist");

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json("Incorrect Password");

    await Blog.findById(user._id).populate('comments');

    const token = jwt.sign(
        {_id: user._id},
        process.env.TOKEN_SECRET
    );

    res.cookie("token", token);
    res.header("auth-token", token);
    res.json({token, user});
};

exports.verify = (req, res, next) => res.send("Verified");

exports.logout = async (req, res, next) => {
};
