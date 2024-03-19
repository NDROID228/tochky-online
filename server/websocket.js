const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

const clients = [];

wss.on("connection", function connection(ws) {
  console.log("Новый клиент подключен");

  clients.push(ws);
  ws.on("message", function incoming(message) {
    console.log("Получено сообщение от клиента:", message);
  });

  ws.on("close", function close() {
    console.log("Клиент отключился");
    clients.splice(clients.indexOf(ws), 1);
  });
});

wss.on("listening", function () {
  console.log("WebSocket сервер запущен на порту 8080");
});
