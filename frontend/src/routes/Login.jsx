import { useEffect } from "react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import Header from "../components/Header";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { username, password } = formData;

  const navigate = useNavigate();

  const { setUsername } = useContext(UserContext);

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
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const reqOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    };

    const response = await fetch("/api/users/login", reqOptions);
    const data = await response.json();
    setUsername(data.username);

    sessionStorage.setItem("token", `Bearer ${data.token}`);
    navigate("/");
  };

  return (
    <div>
      <Header className="header" />
      <h1>Login</h1>
      <p>Please login to your account</p>

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
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default Login;
