import { useState } from "react";
import UserContext from "../UserContext";

const PropositionForm = ({ onSubmitExtra, onReset }) => {
  const [propositionText, setPropositionText] = useState("");

  const saveArgument = () => {
    if (!sessionStorage.getItem("token")) {
      alert("You must be logged in to save arguments");
    } else {
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmitExtra(propositionText);
      }}
    >
      <div>
        <label>
          Proposition:
          <input
            type="text"
            placeholder="Is God real?"
            value={propositionText}
            onChange={(e) => setPropositionText(e.target.value)}
          />
        </label>
      </div>
      <input type="submit" value="Let the argument begin" />
      <input type="button" value="Reset argument" onClick={onReset} />
      <input type="button" value="Save argument" onClick={saveArgument} />
    </form>
  );
};

export default PropositionForm;
