const express = require("express");
const router = express.Router();
const validator = require("../middleware/validator.middleware");
const createAvatar = require("../utils/createAvatar");
const generatePassword = require("../utils/generatePassword");
const db = require("../db");
// 首页
router.get("/", (req, res, next) => {
    if (req.session.user && req.session.user.id) {
        const user = req.session.user;
        res.render("index.html", {user});
    } else {
        res.redirect("/login");
    }
});

// 登录页面
router.get("/login", (req, res, next) => {
    res.render("login.html");
});

router.post("/login", validator({
    name: [{
        required: true,
        message: "请填写用户名！"
    }],
    password: [{
        required: true,
        message: "请填写密码！"
    }]
}, "/login"), async (req, res, next) => {
    const { name, password } = req.body;
    const _password = generatePassword(password);
    const resp = await db.query("select * from user_table where name=? && password=?", [name, _password]);
    const user = resp[0];
    if(user){
        req.session.user = user;
        res.redirect("/");
    }else{
        req.flash("error", "用户名或密码错误！");
        res.redirect("/login");
    }
    
});
// 注册页面
router.get("/register", (req, res, next) => {
    res.render("register.html");
});
router.post("/register", validator({
    name: [{
        required: true,
        message: "请填写用户名！"
    }],
    nickName: [{
        required: true,
        message: "请填写昵称！"
    }],
    password: [{
        required: true,
        message: "请填写密码！"
    }]
}, "/register"), async (req, res, next) => {
    const {name, nickName, password} = req.body;
    const avatar = await createAvatar("../static/img", nickName);
    const _password = generatePassword(password);
    await db.query("insert into user_table (name, nickName, avatar, password) values (?, ?, ?, ?)", [name, nickName, avatar, _password]);
    res.redirect("/");
});

// 退出登录
router.get("/logout", (req, res, next)=>{
    req.session.user = null;
    res.redirect("/");
});

module.exports = router;