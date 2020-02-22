const WebSocket = require("ws");
const sessionParser = require("./sessionParser");
const db = require("./db");
// 用户列表
const clients = [];
module.exports = (server) => {
    const wss = new WebSocket.Server({
        clientTracking: false,
        noServer: true
    });
    wss.on("connection", function (client, request) {
        const { id, name, nickName, avatar } = request.session.user;
        // 将当前用户存储到用户列表中
        clients.push(client);
        console.log("当前用户数量：", clients.length);
        // 接收到消息
        client.on("message", function (data) {
            const result = {
                user: {id, name, nickName, avatar},
                content: data
            }
            // client.send(JSON.stringify(result));
            // 依次给每个用户发消息
            clients.forEach(client => client.send(JSON.stringify(result)));
        });
        client.on("close", function(){
            console.log("断开了");
            const index = clients.findIndex(item => item === client);
            clients.splice(index, 1);
        })
    });
    server.on('upgrade', function upgrade(request, socket, head) {
        sessionParser(request, {}, () => {
            if(request.session.user && request.session.user.id){
                wss.handleUpgrade(request, socket, head, function done(ws) {
                    wss.emit('connection', ws, request);
                });
            }else{
                // 如果没有登录，则直接断开
                socket.destroy();
            }
        });
    });
}