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

import {
  getDatabase,
  ref,
  onValue,
  push,
  onDisconnect,
  set,
  serverTimestamp,
} from "firebase/database";

function App() {
  const [user, setUser] = React.useState();
  const [isConnected, setIsConnected] = React.useState(Boolean);
  React.useEffect(() => {
    console.log(app);

    onAuthStateChanged(getAuth(), (user) => {
      console.log(user);
      setUser(user);
      if (user !== null) {
        connect();
      }
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

  var connect = () => {
    const db = getDatabase();
    var myConnectionsRef = ref(db, `users/${getAuth().currentUser.uid}`);

    // stores the timestamp of my last disconnect (the last time I was seen online)
    var lastOnlineRef = ref(
      db,
      `users/${getAuth().currentUser.uid}/lastOnline`
    );

    var connectedRef = ref(db, ".info/connected");
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
        const con = push(myConnectionsRef);

        // When I disconnect, remove this device
        onDisconnect(con).remove();

        // Add this device to my connections list
        // this value could contain info about the device or a timestamp too
        set(con, true);

        // When I disconnect, update the last time I was seen online
        onDisconnect(lastOnlineRef).set(serverTimestamp());
        console.log("connected");
        setIsConnected(true);
      } else {
        console.log("not connected");
        setIsConnected(false);
      }
    });
  };

  if (user && isConnected) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    );
  } else if (user && isConnected === false) {
    return <div>not connected</div>;
  } else if (user === null) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    );
  }
  return <div>Loading</div>;
  // return user === false ? (

  // ) : (
  //   <BrowserRouter>
  //     <Routes>
  //       <Route path="/welcome" element={<Landing />} />
  //     </Routes>
  //   </BrowserRouter>
  // );
  // return user == null ? (
  //   <BrowserRouter>
  //     <Routes>
  //       <Route path="/" element={<Landing />} />
  //     </Routes>
  //   </BrowserRouter>
  // ) : (
  //   <BrowserRouter>
  //     <Routes>
  //       <Route path="/" element={<Home />} />

  //       <Route path="/profile" element={<Profile />} />
  //     </Routes>
  //   </BrowserRouter>
  // );
}

export default App;
