const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("./static"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(function(req, res, next){
    if(req.headers.origin === "http://localhost:3030"){
        // 允许哪个源进行跨域
        res.setHeader("Access-Control-Allow-origin", req.headers.origin);
        // 允许前端设置请求头
        res.setHeader("Access-Control-Allow-headers", "content-type,token");
        // 允许哪些请求方式，默认只有get和post可以
        res.setHeader("Access-Control-Allow-Methods", "PUT");
        // 允许携带cookie信息
        res.setHeader("Access-Control-Allow-Credentials", true);
        // 允许前端访问响应头里的哪个数据
        res.setHeader("Access-Control-Expose-Headers", "name");
    }
    next();
});
app.get("/detail", function(req, res, next){
    console.log(req.headers);
    const data = { message: "hello world" };
    res.send(data);
});
app.post("/add", function(req, res, next){
    console.log(req.headers);
    console.log(req.body);
    res.setHeader("name", "Lucy");
    res.send(req.body);
});
app.put("/add", function(req, res, next){
    res.send(req.body);
});

// 启动服务
app.listen(8080, () => {
    console.log("server is running at port: 8080");
})