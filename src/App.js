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
  const [user, setUser] = React.useState();
  React.useEffect(() => {
    console.log(app);

    onAuthStateChanged(getAuth(), (user) => {
      console.log(user);
      setUser(user);
    });
  });

  const signed = () => {
    const auth = getAuth();
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUser(true);
        console.log(user);
      } else {
        setUser(false);
      }
    });
  };

  // if (user) {
  //   return (
  //     <BrowserRouter>
  //       <Routes>
  //         <Route path="/" element={<Home />} />

  //         <Route path="/profile" element={<Profile />} />
  //       </Routes>
  //     </BrowserRouter>
  //   );
  // } else {
  //   <BrowserRouter>
  //     <Routes>
  //       <Route path="/" element={<Landing />} />
  //     </Routes>
  //   </BrowserRouter>;
  // }
  // return user === false ? (

  // ) : (
  //   <BrowserRouter>
  //     <Routes>
  //       <Route path="/welcome" element={<Landing />} />
  //     </Routes>
  //   </BrowserRouter>
  // );
  return user == null ? (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
