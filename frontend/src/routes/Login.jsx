import { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { username, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <h1>Login</h1>
      <p>Please login to your account</p>

      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Username"
            onChange={onChange}
          />
        </div>
        <div>
          <input
            type="text"
            name="password"
            value={password}
            placeholder="Password"
            onChange={onChange}
          />
        </div>
        <input type="submit" value="Register" />
      </form>
    </div>
  );
};

export default Login;
