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

const WebSocket = require("ws"); // Імпорт модуля WebSocket для Node.js
const wss = new WebSocket.Server({ port: 8080 }); // Створення WebSocket сервера на порту 8080
const uuidv4 = require("uuid").v4; // Імпорт функції генерації UUID v4 з модуля uuid

const connections = {}; // Об'єкт для зберігання з'єднань WebSocket
const users = {}; // Об'єкт для зберігання інформації про користувачів

// Налаштування параметрів сцени та руху
const GRID_SIZE = 150; // Розмір ячейки сітки
const CANVAS_SIZE = 3000; // Розмір канвасу
const STEP = 3; // Крок руху
const stagePos = { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 }; // Початкові координати сцени

// Обробник реєстрації нового користувача
const userRegHandler = (...params) => {
  const [ws, name, uuid] = params;
  connections[uuid] = ws;
  users[uuid] = {
    username: name,
    position: { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 }, // Початкова позиція користувача
    keyPressed: {}, // Об'єкт для зберігання натисканих клавіш
  };
  return;
};

// Обробник подій натискання клавіш
const keyEventHandler = (...params) => {
  const [ws, keyEvent, key, uuid] = params;
  const userInfo = users[uuid];
  if (keyEvent == "keydown") {
    // userInfo.keyPressed[key] = true; // Зберігання інформації про натискання клавіші
    ws.send(
      JSON.stringify({
        type: "positionChange",
        body: { message: "Key pressed: " + key },
      })
    ); // Відправка повідомлення про натискання клавіші
  }
  if (keyEvent == "keyup") {
    // userInfo.keyPressed[key] = false; // Зберігання інформації про відпускання клавіші
    ws.send(
      JSON.stringify({
        type: "positionChange",
        body: { message: "Key released: " + key },
      })
    ); // Відправка повідомлення про відпускання клавіші
  }
  return;
};

// Обробник закриття з'єднання з користувачем
const closeHandler = (uuid) => {
  delete connections[uuid]; // Видалення з'єднання з об'єкта з'єднань
  delete users[uuid]; // Видалення користувача з об'єкта користувачів
  return;
};

// Обробник підключення нового клієнта до WebSocket сервера
wss.on("connection", function connection(ws) {
  console.log("Новий клієнт підключений");
  const uuid = uuidv4(); // Генерація унікального ідентифікатора користувача
  console.log(uuid);

  ws.on("message", function incoming(bytes) {
    const messageObj = JSON.parse(bytes.toString()); // Розпакування отриманого повідомлення
    switch (messageObj.type) {
      case "userReg":
        const { name } = messageObj.body;
        userRegHandler(ws, name, uuid); // Виклик обробника реєстрації користувача
        console.log(users); // Виведення інформації про користувачів (для відладки)
        break;
      case "keyEvent":
        const { key, eventType } = messageObj.body;
        keyEventHandler(ws, eventType, key, uuid); // Виклик обробника подій натискання клавіш
        break;
      default:
        break;
    }

    console.log("Получено сообщение от клиента:", messageObj); // Виведення отриманого повідомлення (для відладки)
  });

  ws.on("close", function close() {
    closeHandler(uuid); // Виклик обробника закриття з'єднання з користувачем
  });
});

wss.on("listening", function () {
  console.log("WebSocket сервер запущений на порту 8080");
});