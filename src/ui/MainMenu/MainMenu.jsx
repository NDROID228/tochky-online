// import React, { useEffect } from 'react';
// import "./MainMenu.css";
// import useRandomNumbers from "../../usefulFunctions/Generate4Numbers";
// import Canvass from "../../ui/Canvas/Canvas";

// const MainApp = () => {
//   const [user, setUsername] = useState();
//   const [isOpen, setIsOpen] = useState(true);
//   const { concatenatedNumber } = useRandomNumbers();
//   const [socket, setSocket] = useState(null);

//   const handleCange = (event) => {
//     setUsername(event.target.value);
//   };

//   const submitHandler = (event) => {
//     event.preventDefault();
//     setIsOpen(false);
//     if (user) {
//       document.cookie = `currentUsername=${user}`;
//     } else {
//       document.cookie = `currentUsername= Player_${concatenatedNumber}`;
//     }
//   };
//   useEffect(() => {
//     const ws = new WebSocket('ws://localhost:8080');

//     ws.onopen = () => {
//       console.log('WebSocket соединение установлено');
//     };

//     ws.onmessage = (event) => {

//     };

//     ws.onclose = () => {
//       console.log('WebSocket соединение закрыто');
//     };

//     setSocket(ws);

//     return () => {
//       ws.close();
//     };
//   }, []);

//   return (
//     <main style={{ backgroundColor: "gray" }}>
//       {/* <side>
//           <select name="language" id="language">
//             <option selected value="en">
//               English
//             </option>
//             <option value="ua">
//               Ukrainian
//             </option>
//           </select>
//         </side> */}

//       {isOpen && (
//         <>
//           <div className="overlay"></div>

//           <section style={{ position: "absolute", zIndex: "2" }}>
//             <div className="box-logo">
//               <img src="/tmp_logo.svg" alt="Logo" />
//               <h1 className="title">Tochky online</h1>
//             </div>
//             <form id="auth">
//               <div className="for-input">
//                 <input
//                   className="input-effect"
//                   type="text"
//                   name="player_name"
//                   id="player_name"
//                   placeholder="Name"
//                   onChange={handleCange}
//                 />
//                 <span className="focus-border"></span>
//               </div>
//               <button onClick={submitHandler}>Play</button>
//             </form>
//           </section>
//         </>
//       )}
//       <Canvass isOpen={isOpen}/>
//       {/* <side>
//           <div name="language" id="language">
//               <button id="player_settings"></button>
//           </div>
//         </side> */}
//     </main>
//   );
// };

// export default MainApp;
import React, { useState, useEffect, useMemo, useLayoutEffect } from "react";
import "./MainMenu.css";
import useRandomNumbers from "../../usefulFunctions/Generate4Numbers";
import Canvass from "../../ui/Canvas/Canvas";
import useWebSocket from "react-use-websocket";
import map from "../../store/mapStore";
const MainApp = () => {
  useEffect(() => {
    const disableContextMenu = (event) => {
      event.preventDefault();
    };

    document.addEventListener("contextmenu", disableContextMenu);

    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
    };
  }, []);




  // websocket configuration
  const socketUrl = "ws://localhost:8080";
  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(socketUrl, {
    share: true,
    onOpen: () => console.log("opened"),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  const [isOpen, setIsOpen] = useState(true);
  const { concatenatedNumber } = useRandomNumbers();
  const [username, setUsername] = useState("");
  const { GRID_SIZE, CANVAS_SIZE, STEP } = map();

  useLayoutEffect(() => {
    sendJsonMessage({
      type: "mapSettings",
      body: { GRID_SIZE: GRID_SIZE, CANVAS_SIZE: CANVAS_SIZE, STEP: STEP },
    });
  }, [GRID_SIZE,CANVAS_SIZE,STEP]);
  // console.log(GRID_SIZE);
  const handleChange = (event) => {
    setUsername(event.target.value);
  };
  const submitHandler = (event) => {
    event.preventDefault();
    setIsOpen(false);

    if (username) {
      document.cookie = `currentUsername=${username}`;
      sendJsonMessage({
        type: "userReg",
        body: { name: username },
      });
    } else {
      const userWithoutName = `Player_${concatenatedNumber}`;
      document.cookie = `currentUsername=${userWithoutName}`;
      sendJsonMessage({
        type: "userReg",
        body: { name: userWithoutName },
      });
    }
  };

  return (
    <main style={{ backgroundColor: "gray" }}>
      {isOpen && (
        <>
          <div className="overlay"></div>
          <section style={{ position: "absolute", zIndex: "2" }}>
            <div className="box-logo">
              <img src="/tmp_logo.svg" alt="Logo" />
              <h1 className="title">Tochky online</h1>
            </div>
            <form id="auth">
              <div className="for-input">
                <input
                  className="input-effect"
                  type="text"
                  name="player_name"
                  id="player_name"
                  placeholder="Name"
                  onChange={handleChange}
                />
                <span className="focus-border"></span>
              </div>
              <button onClick={submitHandler}>Play</button>
            </form>
          </section>
        </>
      )}
      <Canvass
        isOpen={isOpen}
        sendJsonMessage={sendJsonMessage}
        lastJsonMessage={lastJsonMessage}
      />
    </main>
  );
};

export default MainApp;
