import { useEffect } from "react";

const ContinuePrompt = ({ onKeyDown }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        onKeyDown();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onKeyDown]);

  return <p>{"<press enter to continue>"}</p>;
};

export default ContinuePrompt;
