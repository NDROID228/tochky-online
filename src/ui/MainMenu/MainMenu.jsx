import { useState } from "react";
import "./MainMenu.css";
import useRandomNumbers from "../../usefulFunctions/Generate4Numbers";

const MainApp = () => {
  const [user, setUser] = useState();
  const [isOpen, setIsOpen] = useState(true);
  const { concatenatedNumber } = useRandomNumbers();

  const handleCange = (event) => {
    setUser(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setIsOpen(false);
    if (user) {
      document.cookie = `currentUsername=${user}`;
    } else {
      document.cookie = `currentUsername= Player_${concatenatedNumber}`;
    }
  };

  return (
    <main>
      {/* <side>
          <select name="language" id="language">
            <option selected value="en">
              English
            </option>
            <option value="ua">
              Ukrainian
            </option>
          </select>
        </side> */}
      {isOpen && (
        <section>
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
                onChange={handleCange}
              />
              <span className="focus-border"></span>
            </div>
            <button onClick={submitHandler}>Play</button>
          </form>
        </section>
      )}

      {/* <side>
          <div name="language" id="language">
              <button id="player_settings"></button>
          </div>
        </side> */}
    </main>
  );
};

export default MainApp;
