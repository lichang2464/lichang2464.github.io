
const WebSocket = require('ws');//引入模块

const wss = new WebSocket.Server({ port: 8091 });//创建一个WebSocketServer的实例，监听端口8080

wss.on('connection', function (ws) {
  console.log(`[SERVER] connection()`);
  ws.on('message', function (message) {
    console.log(`[SERVER] Received: ${message}`);
    wss.clients.forEach(function (client) {
      client.send(message);
    });
  })
});
console.log('server run at 8091')