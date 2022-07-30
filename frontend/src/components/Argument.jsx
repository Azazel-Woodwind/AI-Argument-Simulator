import { useEffect } from "react";

const Argument = ({ text, onKeyDown }) => {
  useEffect(() => {
    if (onKeyDown) {
      const handleKeyDown = (event) => {
        if (event.key === "Enter" && !text.endsWith("<thinking>")) {
          onKeyDown();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [onKeyDown, text]);

  return (
    <div>
      <p>{text}</p>
    </div>
  );
};

export default Argument;
