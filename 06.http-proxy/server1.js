const express = require("express");
const proxy = require("express-http-proxy");

const app = express();

app.use(express.static("./static"));

app.use('/api', proxy('localhost:8080'));
// 启动服务
app.listen(3030, () => {
    console.log("server is running at port: 3030");
})