const WebSocket = require("ws"); // Імпорт модуля WebSocket для Node.js
const wss = new WebSocket.Server({ port: 8080 }); // Створення WebSocket сервера на порту 8080
const uuidv4 = require("uuid").v4; // Імпорт функції генерації UUID v4 з модуля uuid

const connections = {}; // Об'єкт для зберігання з'єднань WebSocket
const users = {}; // Об'єкт для зберігання інформації про користувачів

// Налаштування параметрів сцени та руху
const mapSettings = {
  GRID_SIZE: 150,
  CANVAS_SIZE: 3000,
  STEP: 3,
  stagePos: { x: 1500, y: 1500 },
};

// Обробник реєстрації нового користувача
const userRegHandler = (...params) => {
  const [ws, name, uuid] = params;
  connections[uuid] = ws;
  users[uuid] = {
    uid: "",
    username: name,
    position: {
      x: mapSettings.CANVAS_SIZE / 2,
      y: mapSettings.CANVAS_SIZE / 2,
    },
    keyPressed: {},
  };
  ws.send(
    JSON.stringify({
      type: "registration",
      body: { userId: uuid },
    })
  );
  return;
};
console.log(users);
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
  delete connections[uuid];
  delete users[uuid];
};

// Обробник підключення нового клієнта до WebSocket сервера
wss.on("connection", function connection(ws) {
  const uuid = uuidv4(); // Генерація унікального ідентифікатора користувача

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
      case "mapSettings":
        const { GRID_SIZE, CANVAS_SIZE, STEP } = messageObj.body;
        mapSettings.GRID_SIZE = GRID_SIZE;
        mapSettings.CANVAS_SIZE = CANVAS_SIZE;
        mapSettings.STEP = STEP;
        break;
      case "currentUserPosition":
        const { userUID, x, y } = messageObj.body;
        const usersData = [];
        for (let user in users) {
          if (users.hasOwnProperty(user)) {
            const userData = users[user];
            // Если находим пользователя с нужным userUID
            if (user === userUID) {
              // Меняем его позицию
              if (!userData.position) {
                userData.position = {};
              }
              userData.position.x = x;
              userData.position.y = y;
              userData.uid = user;
            }
            // Добавляем пользователя в массив пользователей
            usersData.push(userData);
          }
        }
        // Отправляем обновленные данные о всех пользователях
        ws.send(
          JSON.stringify({
            type: "userListUpdate",
            body: { usersData: usersData },
          })
        );
        break;
      default:
        break;
    }

    console.log("Получено сообщение от клиента:", messageObj);
  });

  // Виклик обробника закриття з'єднання з користувачем
  ws.on("close", function close() {
    closeHandler(uuid);
  });
});

wss.on("listening", function () {
  console.log("WebSocket сервер запущений на порту 8080");
});
