import React from "react";

const ShowConfig = ({ toggleConfigForm, text }) => {
  return <button onClick={toggleConfigForm}>{text}</button>;
};

export default ShowConfig;
