import { useContext, useState } from "react";
import UserContext from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    conPassword: "",
  });
  const [errMessage, setErrMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { username, password, conPassword } = formData;

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setErrMessage("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const reqOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
      }),
    };

    try {
      const response = await fetch("/api/users", reqOptions);
      setErrMessage("Success!");
      setFormData((prevState) => {
        Object.keys(prevState).forEach((key) => {
          prevState[key] = "";
        });
        return prevState;
      });
    } catch (error) {
      console.log(error);
      setErrMessage("Something went wrong.");
    }
  };

  return (
    <>
      <Header className="header" />
      {success ? (
        <div>
          <h1>Success!</h1>
        </div>
      ) : (
        <div>
          <h1>Register</h1>
          <p>Please create an account</p>
          {errMessage && <p>{errMessage}</p>}
          <form onSubmit={onSubmit}>
            <div>
              <input
                type="text"
                name="username"
                value={username}
                autoComplete="off"
                placeholder="Username"
                onChange={onChange}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={onChange}
              />
            </div>
            <div>
              <input
                type="password"
                name="conPassword"
                value={conPassword}
                placeholder="Confirm Password"
                onChange={onChange}
              />
            </div>
            <input type="submit" value="Register" />
          </form>
        </div>
      )}
    </>
  );
};

export default Register;
