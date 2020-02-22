const express = require("express");

const app = express();

app.use(express.static("./static"));

// 启动服务
app.listen(3030, () => {
    console.log("server is running at port: 3030");
})