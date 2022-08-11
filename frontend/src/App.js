import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import { UserProvider } from "./UserContext";

function App() {
  return (
    <div className="main">
      <UserProvider>
        <Outlet />
      </UserProvider>
    </div>
  );
}

export default App;
