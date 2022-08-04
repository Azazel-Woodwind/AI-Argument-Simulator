import { useLocation, Link } from "react-router-dom";

const Header = () => {
  return (
    <header style={{ display: "flex" }}>
      <Link to="/">Debate Simulator</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </header>
  );
};

export default Header;
