import { useRef, useState } from "react";
import RangeSlider from "./RangeSlider";

const ConfigForm = ({ bot1, bot2 }) => {
  const [bot1Border, setBot1Border] = useState("2px solid blue");
  const [bot2Border, setBot2Border] = useState("");
  const [nameText, setNameText] = useState(bot1.name);
  const [isFor, setIsFor] = useState(bot1.isFor);
  const [model, setModel] = useState(bot1.model);
  const [temp, setTemp] = useState(bot1.temp);
  const [freqPenalty, setFreqPenalty] = useState(bot1.freqPenalty);
  const [presPenalty, setPresPenalty] = useState(bot1.presPenalty);
  let currentSelectedBot = useRef(bot1);
  let unselectedBot = useRef(bot2);

  const bot1ButtonStyle = {
    border: bot1Border,
  };

  const bot2ButtonStyle = {
    border: bot2Border,
  };

  const changeConfig = (
    setClickedBotBorder,
    clickedBotBorder,
    setOtherBotBorder,
    selectedBot,
    otherBot
  ) => {
    currentSelectedBot.current = selectedBot;
    unselectedBot.current = otherBot;
    setClickedBotBorder(clickedBotBorder);
    setOtherBotBorder("");
    fillInselectedBot(selectedBot);
  };

  const fillInselectedBot = (selectedBot) => {
    setNameText(selectedBot.name);
    setIsFor(selectedBot.isFor);
    setModel(selectedBot.model);
    setTemp(selectedBot.temp);
    setFreqPenalty(selectedBot.freqPenalty);
    setPresPenalty(selectedBot.presPenalty);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    currentSelectedBot.current.name = nameText;
    currentSelectedBot.current.isFor = isFor;
    unselectedBot.current.isFor = !isFor;
    currentSelectedBot.current.model = model;
    currentSelectedBot.current.temp = temp;
    currentSelectedBot.current.freqPenalty = freqPenalty;
    currentSelectedBot.current.presPenalty = presPenalty;

    alert("Changes saved");
  };

  const resetDefaults = () => {
    if (
      // eslint-disable-next-line no-restricted-globals
      confirm(
        "Are you sure you want to reset this bot to its default settings?"
      )
    ) {
      currentSelectedBot.current.setDefaults();
      fillInselectedBot(currentSelectedBot.current);
    }
  };

  return (
    <div>
      <button
        style={bot1ButtonStyle}
        onClick={() =>
          changeConfig(
            setBot1Border,
            "2px solid blue",
            setBot2Border,
            bot1,
            bot2
          )
        }
      >
        Bot 1
      </button>
      <button
        style={bot2ButtonStyle}
        onClick={() =>
          changeConfig(
            setBot2Border,
            "2px solid red",
            setBot1Border,
            bot2,
            bot1
          )
        }
      >
        Bot 2
      </button>
      <form onSubmit={onSubmit}>
        <div className="form-control">
          <p style={{ margin: 0 }}>You are a/an</p>
          <label>
            <input
              type="text"
              value={nameText}
              onChange={(e) => setNameText(e.target.value)}
              placeholder="Intelligent Man"
            />
          </label>
        </div>
        <div className="form-control">
          <p style={{ margin: 0 }}>You are arguing</p>
          <label>
            <input
              type="radio"
              checked={isFor}
              onChange={() => setIsFor(true)}
              name="side"
              value="for"
            />
            For
          </label>
          <label>
            <input
              type="radio"
              checked={!isFor}
              onChange={() => setIsFor(false)}
              name="side"
              value="against"
            />
            Against
          </label>
        </div>
        <div className="form-control">
          <p style={{ margin: 0 }}>Model</p>
          <label>
            <input
              type="radio"
              name="model"
              value="text-davinci-002"
              checked={model === "text-davinci-002"}
              onChange={() => setModel("text-davinci-002")}
            />
            text-davinci-002
          </label>
          <label>
            <input
              type="radio"
              name="model"
              value="text-curie-001"
              checked={model === "text-curie-001"}
              onChange={() => setModel("text-curie-001")}
            />
            text-curie-001
          </label>
          <label>
            <input
              type="radio"
              name="model"
              value="text-babbage-001"
              checked={model === "text-babbage-001"}
              onChange={() => setModel("text-babbage-001")}
            />
            text-babbage-001
          </label>
          <label>
            <input
              type="radio"
              name="model"
              value="text-ada-001"
              checked={model === "text-ada-001"}
              onChange={() => setModel("text-ada-001")}
            />
            text-ada-001
          </label>
        </div>
        <div className="form-control">
          <p style={{ margin: 0 }}>Temperature</p>
          <label>
            <RangeSlider
              min={0}
              max={1}
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
            />
          </label>
        </div>
        <div className="form-control">
          <p style={{ margin: 0 }}>Frequency Penalty</p>
          <label>
            <RangeSlider
              min={0}
              max={2}
              value={freqPenalty}
              onChange={(e) => setFreqPenalty(e.target.value)}
            />
          </label>
        </div>
        <div className="form-control">
          <p style={{ margin: 0 }}>Presence penalty</p>
          <label>
            <RangeSlider
              min={0}
              max={2}
              value={presPenalty}
              onChange={(e) => setPresPenalty(e.target.value)}
            />
          </label>
        </div>
        <input type="submit" value="Confirm changes" />
        <button type="button" onClick={resetDefaults}>
          Reset defaults
        </button>
      </form>
    </div>
  );
};

export default ConfigForm;
