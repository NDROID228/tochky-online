import "./MainMenu.css";

export default function MainMenu() {
  const submitHandler = (event) => {
    event.preventDefault();
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
            />
            <span className="focus-border"></span>
            
          </div>
          <button onClick={submitHandler}>Play</button>
        </form>
      </section>
      {/* <side>
        <div name="language" id="language">
            <button id="player_settings"></button>
        </div>
      </side> */}
    </main>
  );
}
