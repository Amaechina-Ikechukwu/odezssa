import logo from "./logo.svg";
import "./App.css";
import { Landing } from "./components/Landing";
import {
  BrowserRouter,
  Routes,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import StatusCheck from "./components/StatusCheck";
import Home from "./components/pages/Home";
import Profile from "./components/pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/check" element={<StatusCheck />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
