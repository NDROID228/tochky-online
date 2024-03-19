// const http = require("http");
// const { WebSocketServer } = require("ws");
// const url = require("url");

// const server = http.createServer();
// const wsServer = new WebSocketServer({ server });
// const port = 8080;

// wsServer.on("connection", (connection, request) => {
//   // ws://localhost:8080
//   const { username } = url.parse(request.url, true).query;
//   console.log(username);
// });

// server.listen(port, () => {
//   console.log(`WebSocket сервер запущен на порту ${port}`);
// });

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

const users = [];

wss.on("connection", function connection(ws) {
  console.log("Новый клиент подключен");
  users.push(ws);

  /* 
  message obj {
    type: userReg | keyEvent,
    body: {}
  }
  */

  ws.on("message", function incoming(bytes) {
    const messageObj = JSON.parse(bytes.toString());
    switch (messageObj.type) {
      case "userReg":
        break;
      case "keyEvent":
        console.log("Key pressed:", messageObj.body);
        break;
      default:
        break;
    }

    console.log("Получено сообщение от клиента:", bytes.toString());
  });

  ws.on("close", function close() {
    console.log("Клиент отключился");
    users.splice(users.indexOf(ws), 1);
  });
});

wss.on("listening", function () {
  console.log("WebSocket сервер запущен на порту 8080");
});
