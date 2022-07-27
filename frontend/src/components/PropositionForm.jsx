import { useState } from "react";

const PropositionForm = ({ onSubmit, setProposition }) => {
  const [propositionText, setPropositionText] = useState("");
  return (
    <form
      onSubmit={(e) => {
        setProposition(propositionText);
        onSubmit(e);
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
    </form>
  );
};

export default PropositionForm;
