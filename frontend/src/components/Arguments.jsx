import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Argument from "./Argument";
import ContinuePrompt from "./ContinuePrompt";

const Arguments = ({
  convoID,
  fetchAndDisplayNextArgument,
  botArguments,
  startNewArgument,
  nextArgument,
  skipDialogue,
  saveArgument,
  setStartNewArgument,
}) => {
  useEffect(() => {
    if (!convoID.current) {
      convoID.current = uuidv4();
      console.log(convoID.current);
    }
    fetchAndDisplayNextArgument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {botArguments.current.map((argument, i) => (
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
      <button onClick={saveArgument}>Save argument</button>
    </div>
  );
};

export default Arguments;
