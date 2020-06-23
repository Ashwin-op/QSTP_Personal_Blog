const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

module.exports = (req, res, next) => {
    const {authorization} = req.headers;
    // console.log("authorization", authorization);

    if (!authorization) return res.status(401).json({error: "Login again"});

    const token = authorization.replace("Bearer ", "");

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const {_id} = verified;

        User.findById(_id).then(userDate => {
            req.user = userDate;
            next();
        });
    } catch (err) {
        res.status(400).json("Please login to your account first!");
    }
};
