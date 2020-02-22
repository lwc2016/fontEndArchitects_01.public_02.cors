const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("./static"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use((req, res, next)=>{
    console.log("有请求了");
    console.log(req.url);
    next();
})
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

app.use((req, res, next)=>{
    console.log("404错误");
    res.send("404");
})
// 启动服务
app.listen(8080, () => {
    console.log("server is running at port: 8080");
})