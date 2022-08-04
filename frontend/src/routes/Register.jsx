import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    conPassword: "",
  });

  const { username, password, conPassword } = formData;

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
      <h1>Register</h1>
      <p>Please create an account</p>

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
        <div>
          <input
            type="text"
            name="conPassword"
            value={conPassword}
            placeholder="Confirm Password"
            onChange={onChange}
          />
        </div>
        <input type="submit" value="Register" />
      </form>
    </div>
  );
};

export default Register;
