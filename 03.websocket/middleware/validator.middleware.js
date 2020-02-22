const Validator = require("standard-validator");
module.exports = (rules, redirect)=>{
    return (req, res, next) => {
        const validator = new Validator(req.body, rules);
        validator.validate((error)=>{
            if(error){
                Object.keys(error).forEach(key => req.flash(`${key}_error`, error[key]));
                res.redirect(redirect);
                return null;
            }   
            next();
        });
    };
};