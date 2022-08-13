import { useState } from "react";
import UserContext from "../UserContext";

const PropositionForm = ({ onSubmitExtra, onReset }) => {
  const [propositionText, setPropositionText] = useState("");

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
    </form>
  );
};

export default PropositionForm;
