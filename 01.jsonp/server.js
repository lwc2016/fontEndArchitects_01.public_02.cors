const express = require("express");

const app = express();

app.get("/detail", function(req, res, next){
    const { callback } = req.query;
    const data = { message: "hello world" };
    res.send(`${callback}(${JSON.stringify(data)})`);
});

// 启动服务
app.listen(3030, () => {
    console.log("server is running at port: 3030");
})