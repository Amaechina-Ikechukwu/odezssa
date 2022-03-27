import React from "react";
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
import { app } from "./firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";

function App() {
  const [user, setUser] = React.useState(Boolean);
  React.useEffect(() => {
    console.log(app);
  });
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(true);
    } else {
      setUser(false);
    }
  });
  return (
    <BrowserRouter>
      {user ? (
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/profile" element={<Profile />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
