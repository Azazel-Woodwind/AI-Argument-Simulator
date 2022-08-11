import ConfigForm from "../components/ConfigForm";
import PropositionForm from "../components/PropositionForm";
import { useState } from "react";
import Arguments from "../components/Arguments";
import ShowConfig from "../components/ShowConfig";
import Bot from "../Bot";
import Header from "../components/Header";

const bot1 = new Bot("Man", true);
const bot2 = new Bot("Woman", false);

function Main() {
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [argumentStarted, setArgumentStarted] = useState(false);
  const [proposition, setProposition] = useState("");

  return (
    <div>
      <Header className="header" />
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
        onReset={() => setArgumentStarted(false)}
      />
      {argumentStarted && (
        <Arguments bot1={bot1} bot2={bot2} proposition={proposition} />
      )}
    </div>
  );
}

export default Main;
