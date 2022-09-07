import ConfigForm from "../components/ConfigForm";
import PropositionForm from "../components/PropositionForm";
import { useState, useRef, useCallback } from "react";
import Arguments from "../components/Arguments";
import ShowConfig from "../components/ShowConfig";
import Bot from "../Bot";
import Header from "../components/Header";
import SavedArguments from "../components/SavedArguments";
import { v4 as uuidv4 } from "uuid";

let bot1 = new Bot("Man", true);
let bot2 = new Bot("Woman", false);

function Main() {
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [argumentStarted, setArgumentStarted] = useState(false);
  const [showSavedarguments, setShowSavedArguments] = useState(false);
  const [startNewArgument, setStartNewArgument] = useState(true);
  const [nextArgument, setNextArgument] = useState("");
  // const [botArguments, setBotArguments] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [args, setArgs] = useState([]);
  const turnNumber = useRef(1);
  const convoID = useRef();
  const skipDialogue = useRef(false);
  const proposition = useRef("");
  const botArguments = useRef([]);

  const getNextBot = () => (turnNumber.current % 2 === 1 ? bot1 : bot2);

  const generatePrompt = (bot) => {
    let prompt = `The following is a debate between a ${bot1.name} and a ${
      bot2.name
    } on the proposition: ${proposition.current} The ${bot1.name} is debating ${
      bot1.isFor ? "for" : "against"
    } this proposition and the ${bot2.name} is debating ${
      bot2.isFor ? "for" : "against"
    } this proposition.\nContinue the conversation.\n\n`;
    if (botArguments.current.length) {
      prompt += botArguments.current.join("\n");
      prompt += `\n\n${bot.name}:`;
    } else {
      prompt += bot.name + ":";
    }
    console.log(prompt);
    return prompt;
  };

  const incrementDisplayedText = async (text, startingIndex) => {
    let lastChar;
    skipDialogue.current = false;
    while (
      startingIndex !== text.length - 1 &&
      !skipDialogue.current &&
      argumentStarted
    ) {
      setNextArgument(text.slice(0, startingIndex++));
      lastChar = text.charAt(startingIndex - 2);
      if (lastChar === ".") {
        await new Promise((resolve) =>
          setTimeout(() => {
            resolve();
          }, 500)
        );
      } else if (lastChar === ",") {
        await new Promise((resolve) =>
          setTimeout(() => {
            resolve();
          }, 200)
        );
      } else {
        await new Promise((resolve) =>
          setTimeout(() => {
            resolve();
          }, 20)
        );
      }
    }
    if (!convoID.current) {
      return;
    }
    setNextArgument(text);

    botArguments.current.push(text);
    setStartNewArgument(false);
    turnNumber.current++;
  };

  const fetchAndDisplayNextArgument = async () => {
    console.log(proposition.current);
    const nextBot = getNextBot();
    setNextArgument(`${nextBot.name}: <thinking>`);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...nextBot,
        prompt: generatePrompt(nextBot),
        convoID: convoID.current,
      }),
    };

    const response = await fetch(
      "/api/arguments/next-argument",
      requestOptions
    );
    let responseText = (await response.json()).responseText;
    // console.log(responseText);

    if (!responseText.toLowerCase().startsWith(nextBot.name.toLowerCase())) {
      responseText = `${nextBot.name}: ${responseText}`;
    }

    incrementDisplayedText(responseText, nextBot.name.length + 3);
  };

  const fetchData = useCallback(async () => {
    const token = sessionStorage.getItem("token");
    const reqOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
    };
    const response = await fetch("/api/arguments", reqOptions);
    const data = await response.json();
    setArgs(data.map((arg) => ({ ...arg, argument: undefined })));

    setIsLoaded(true);
  }, []);

  const saveArgument = async () => {
    if (!sessionStorage.getItem("token")) {
      alert("You must be logged in to save arguments");
    } else {
      const token = sessionStorage.getItem("token");
      const reqOptions = {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify({
          convoID: convoID.current,
          proposition: proposition.current,
          bot1Config: bot1,
          bot2Config: bot2,
        }),
      };

      try {
        const argument = await fetch("/api/arguments", reqOptions);
        fetchData();
        alert("Argument saved");
      } catch (error) {
        alert(error);
      }
    }
  };

  const loadArgument = async (id, bot1Config, bot2Config, prop) => {
    convoID.current = uuidv4();
    const reqOptions = {
      method: "PUT",
      headers: {
        Authorization: sessionStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        convoID: convoID.current,
      }),
    };
    const response = await fetch(
      `/api/arguments/next-argument/${id}`,
      reqOptions
    );
    const data = await response.json();

    botArguments.current = [];
    turnNumber.current = 1;
    skipDialogue.current = true;
    setStartNewArgument(true);
    setNextArgument("");
    bot1 = bot1Config;
    bot2 = bot2Config;
    proposition.current = prop;
    console.log(proposition.current);
    if (argumentStarted) {
      fetchAndDisplayNextArgument();
    } else {
      setArgumentStarted(true);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ maxWidth: "500px" }}>
        <Header
          className="header"
          setShowSavedArguments={setShowSavedArguments}
          text={showSavedarguments ? "Close" : "Saved Arguments"}
        />
        <ShowConfig
          toggleConfigForm={() => setShowConfigForm(!showConfigForm)}
          text={showConfigForm ? "Close config" : "Open config"}
        />
        {showConfigForm && <ConfigForm bot1={bot1} bot2={bot2} />}
        <PropositionForm
          onSubmitExtra={(prop) => {
            if (!argumentStarted) {
              setArgumentStarted(true);
              proposition.current = prop;
            }
          }}
          onReset={() => {
            setArgumentStarted(false);
            convoID.current = undefined;
            botArguments.current = [];
            turnNumber.current = 1;
            skipDialogue.current = true;
            setStartNewArgument(true);
            setNextArgument("");
          }}
        />
        {argumentStarted && (
          <Arguments
            convoID={convoID}
            fetchAndDisplayNextArgument={fetchAndDisplayNextArgument}
            botArguments={botArguments}
            startNewArgument={startNewArgument}
            nextArgument={nextArgument}
            skipDialogue={skipDialogue}
            saveArgument={saveArgument}
            setStartNewArgument={setStartNewArgument}
          />
        )}
      </div>
      {showSavedarguments && (
        <SavedArguments
          fetchData={fetchData}
          args={args}
          setArgs={setArgs}
          isLoaded={isLoaded}
          loadArgument={loadArgument}
        />
      )}
    </div>
  );
}

export default Main;
