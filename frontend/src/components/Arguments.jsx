import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Argument from "./Argument";
import ContinuePrompt from "./ContinuePrompt";

const Arguments = ({ bot1, bot2, proposition }) => {
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
    while (startingIndex !== text.length - 1 && !skipDialogue.current) {
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

    const response = await fetch("/api/arguments/", requestOptions);
    let responseText = (await response.json()).responseText;
    // console.log(responseText);

    if (!responseText.toLowerCase().startsWith(nextBot.name.toLowerCase())) {
      responseText = `${nextBot.name}: ${responseText}`;
    }

    incrementDisplayedText(responseText, nextBot.name.length + 3);
  };

  useEffect(() => {
    // console.log(1);
    convoID.current = uuidv4();
    fetchAndDisplayNextArgument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {botArguments.map((argument, i) => (
        <Argument key={i} text={argument} />
      ))}
      {startNewArgument ? (
        <Argument
          text={nextArgument}
          onKeyDown={() => {
            skipDialogue.current = true;
          }}
        />
      ) : (
        <ContinuePrompt
          onKeyDown={() => {
            fetchAndDisplayNextArgument();
            setStartNewArgument(true);
          }}
        />
      )}
    </div>
  );
};

export default Arguments;
