const express = require("express");

const app = express();

app.use(express.static("./static"));

// 启动服务
app.listen(8080, () => {
    console.log("server is running at port: 8080");
})