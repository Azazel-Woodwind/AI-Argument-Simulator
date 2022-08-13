import { useEffect, useState } from "react";

const SavedArguments = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [args, setArgs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      const reqOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: token },
      };
      const response = await fetch("/api/arguments", reqOptions);
      const data = await response.json();
      setArgs(data);
      console.log(data);
      setIsLoaded(true);
    };
    fetchData();
  }, []);

  return (
    <div>
      {!isLoaded ? (
        <p>Loading...</p>
      ) : (
        args.map((arg, i) => (
          <div style={{ border: "2px solid black" }} key={i}>
            <p>Proposition: {arg.proposition}</p>
            <p>Bot 1: {arg.bot1Config.name}</p>
            <p>Bot 2: {arg.bot2Config.name}</p>
            <p>Saved at: {arg.createdAt}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedArguments;
