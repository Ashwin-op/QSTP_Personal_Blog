const Joi = require('@hapi/joi');

const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .min(4)
            .required(),
        username: Joi.string()
            .min(4)
            .required()
    });
    return schema.validate(data);
};

const loginValidation = data => {
    const schema = Joi.object({
        password: Joi.string()
            .min(4)
            .required(),
        username: Joi.string()
            .min(4)
            .required()
    });
    return schema.validate(data);
};

const blogValidation = data => {
    const schema = Joi.object({
        blogTitle: Joi.string()
            .required(),
        blogBody: Joi.string()
            .required()
    });
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.blogValidation = blogValidation;
