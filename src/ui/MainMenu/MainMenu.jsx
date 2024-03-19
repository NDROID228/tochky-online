// import React, { useEffect } from 'react';
// import "./MainMenu.css";
// import useRandomNumbers from "../../usefulFunctions/Generate4Numbers";
// import Canvass from "../../ui/Canvas/Canvas";

// const MainApp = () => {
//   const [user, setUser] = useState();
//   const [isOpen, setIsOpen] = useState(true);
//   const { concatenatedNumber } = useRandomNumbers();
//   const [socket, setSocket] = useState(null);

//   const handleCange = (event) => {
//     setUser(event.target.value);
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
import React, { useState, useEffect, useMemo } from 'react';
import "./MainMenu.css";
import useRandomNumbers from "../../usefulFunctions/Generate4Numbers";
import Canvass from "../../ui/Canvas/Canvas";

const MainApp = () => {
  const [user, setUser] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const { concatenatedNumber } = useRandomNumbers();
  const [socket, setSocket] = useState(new WebSocket('ws://localhost:8080'));

  const handleChange = (event) => {
    setUser(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setIsOpen(false);
    if (user) {
      document.cookie = `currentUsername=${user}`;
    } else {
      document.cookie = `currentUsername=Player_${concatenatedNumber}`;
    }
  };

  useEffect(() => {

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      console.log('Received message:', event.data);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
    
  }, []);


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
      <Canvass isOpen={isOpen} socket={socket}/>
    </main>
  );
};

export default MainApp;
