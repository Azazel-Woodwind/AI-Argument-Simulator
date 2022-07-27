// import "./App.css";
import Header from "./components/Header";
import ConfigForm from "./components/ConfigForm";
import PropositionForm from "./components/PropositionForm";
import { useState } from "react";
import Bot from "./Bot";
import Arguments from "./components/Arguments";

const bot1 = new Bot("Man", true);
const bot2 = new Bot("Woman", false);

function App() {
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [argumentStarted, setArgumentStarted] = useState(false);
  const [proposition, setProposition] = useState("");

  return (
    <div>
      <Header toggleConfigForm={() => setShowConfigForm(!showConfigForm)} />
      {showConfigForm && <ConfigForm bot1={bot1} bot2={bot2} />}
      <PropositionForm
        onSubmit={(e) => {
          e.preventDefault();
          setArgumentStarted(true);
        }}
        setProposition={setProposition}
      />
      {argumentStarted && (
        <Arguments bot1={bot1} bot2={bot2} proposition={proposition} />
      )}
    </div>
  );
}

export default App;
