import { useEffect, useState, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import UserContext from "../UserContext";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { username, setUsername } = useContext(UserContext);

  useEffect(() => {
    const getName = async () => {
      if (sessionStorage.getItem("token")) {
        console.log(username);
        if (username) {
          setUsername(username);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(true);
          const token = sessionStorage.getItem("token");
          const reqOptions = {
            method: "GET",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            withCredentials: true,
            credentials: "include",
          };
          const response = await fetch("/api/users/me", reqOptions);
          const data = await response.json();
          setUsername(data.username);
        }
      }
    };
    getName();
  }, []);

  const signOut = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const showSavedArguments = () => {
    if (!isLoggedIn) {
      alert("You must be logged in to view saved arguments");
    } else {
    }
  };

  return (
    <header style={{ display: "flex" }}>
      <Link to="/">Debate Simulator</Link>
      {isLoggedIn ? (
        <>
          <p>Welcome {username}</p>
          <button onClick={signOut}>Sign out</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/Register">Register</Link>
        </>
      )}
      <button onClick={showSavedArguments}>Saved arguments</button>
    </header>
  );
};

export default Header;
