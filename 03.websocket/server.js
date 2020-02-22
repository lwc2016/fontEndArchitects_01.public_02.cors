const http = require("http");
const createWebSocket = require("./createWebSocket");
const app = require("./express");
const db = require("./db");

// 创建服务
const server = http.createServer(app);

// 创建socket
createWebSocket(server);

// 启动服务
server.listen(3030, () => {
    console.log("server is running at port: 3030");
})