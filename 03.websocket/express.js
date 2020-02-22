const express = require("express");
const bodyParser = require("body-parser");
const nunjucks = require("nunjucks");
const flash = require("express-flash");
const cookie = require("cookie-parser");
const sessionParser = require("./sessionParser");
const app = express();
// 设置模版引擎
nunjucks.configure("./views", {
    autoescape: true,
    express: app,
    watch: true,
})

// 解析数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// 设置静态资源路径
app.use(express.static("./static"));
app.use(cookie());
// 解析session
app.use(sessionParser);
// 使用flash
app.use(flash());
// 设置路由
app.use("/", require("./routes/index.route"))

module.exports = app;
