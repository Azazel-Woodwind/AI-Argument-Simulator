import ConfigForm from "../components/ConfigForm";
import PropositionForm from "../components/PropositionForm";
import { useState, useRef } from "react";
import Arguments from "../components/Arguments";
import ShowConfig from "../components/ShowConfig";
import Bot from "../Bot";
import Header from "../components/Header";
import SavedArguments from "../components/SavedArguments";

const bot1 = new Bot("Man", true);
const bot2 = new Bot("Woman", false);

function Main() {
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [argumentStarted, setArgumentStarted] = useState(false);
  const [proposition, setProposition] = useState("");
  const [showSavedarguments, setShowSavedArguments] = useState(false);
  const [startNewArgument, setStartNewArgument] = useState(true);
  const [nextArgument, setNextArgument] = useState("");
  const [botArguments, setBotArguments] = useState([]);
  const turnNumber = useRef(1);
  const convoID = useRef();
  const skipDialogue = useRef(false);

  const getNextBot = () => (turnNumber.current % 2 === 1 ? bot1 : bot2);

  const generatePrompt = (bot) => {
    let prompt = `The following is a debate between a ${bot1.name} and a ${
      bot2.name
    } on the proposition: ${proposition} The ${bot1.name} is debating ${
      bot1.isFor ? "for" : "against"
    } this proposition and the ${bot2.name} is debating ${
      bot2.isFor ? "for" : "against"
    } this proposition.\nContinue the conversation.\n\n`;
    if (botArguments.length) {
      prompt += botArguments.join("\n");
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

    setBotArguments((currentState) => {
      currentState.push(text);
      return currentState;
    });
    setStartNewArgument(false);
    turnNumber.current++;
  };

  const fetchAndDisplayNextArgument = async () => {
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
          proposition,
          bot1Config: bot1,
          bot2Config: bot2,
        }),
      };

      try {
        const argument = await fetch("/api/arguments", reqOptions);
        alert("Argument saved");
      } catch (error) {
        alert(error);
      }
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div>
        <Header
          className="header"
          onClick={() => setShowSavedArguments(!showSavedarguments)}
          text={showSavedarguments ? "Close" : "Saved Arguments"}
        />
        <ShowConfig
          toggleConfigForm={() => setShowConfigForm(!showConfigForm)}
          text={showConfigForm ? "Close config" : "Open config"}
        />
        {showConfigForm && <ConfigForm bot1={bot1} bot2={bot2} />}
        <PropositionForm
          onSubmitExtra={(proposition) => {
            if (!argumentStarted) {
              setArgumentStarted(true);
              setProposition(proposition);
            }
          }}
          onReset={() => {
            setArgumentStarted(false);
            convoID.current = undefined;
            setBotArguments([]);
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
      {showSavedarguments && <SavedArguments />}
    </div>
  );
}

export default Main;
