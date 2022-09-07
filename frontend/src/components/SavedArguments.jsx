import { useEffect, useState, useCallback } from "react";

const SavedArguments = ({
  fetchData,
  args,
  setArgs,
  isLoaded,
  loadArgument,
}) => {
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onClick = async (id) => {
    try {
      const response = await fetch(`/api/arguments/${id}`, {
        method: "DELETE",
        headers: { Authorization: sessionStorage.getItem("token") },
      });
      const data = await response.json();
      console.log(data);
      setArgs(args.filter((arg) => arg._id !== id));
      alert("Argument deleted");
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(args);

  return (
    <div style={{ minWidth: "250px", width: "250px" }}>
      {!isLoaded ? (
        <p>Loading...</p>
      ) : args.length ? (
        args.map((arg, i) => (
          <div style={{ border: "2px solid black" }} key={i}>
            <p>Proposition: {arg.proposition}</p>
            <p>Bot 1: {arg.bot1Config.name}</p>
            <p>Bot 2: {arg.bot2Config.name}</p>
            <p>Saved at: {arg.createdAt}</p>
            <button
              style={{ display: "inline-block" }}
              onClick={() =>
                loadArgument(
                  arg._id,
                  arg.bot1Config,
                  arg.bot2Config,
                  arg.proposition
                )
              }
            >
              Load
            </button>
            <button
              onClick={() => {
                console.log(arg);
                onClick(arg._id);
              }}
              style={{ display: "inline-block" }}
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No saved arguments</p>
      )}
    </div>
  );
};

export default SavedArguments;
