import { getAuth } from "firebase/auth";
import React, { Component } from "react";
import Menu from "./Menu";
import SideBar from "./Sidebar";
import {
  getDatabase,
  ref,
  onValue,
  push,
  onDisconnect,
  set,
  serverTimestamp,
} from "firebase/database";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: Boolean,
    };
  }

  componentDidMount() {
    // this.checkConnection();
    this.connect();
  }

  checkConnection = () => {
    var db = getDatabase();
    var presenceRef = ref(db, "/.info/connected");
    // onDisconnect(presenceRef)
    //   .set("i disconnected")
    //   .then(() => console.log("Disonnected"));

    onValue(presenceRef, (snap) => {
      // snap.val === true
      //   ? console.log("connected")
      //   : console.log("disconnected");
      if (snap.val === true) {
        console.log("connected");
      } else {
        console.log("disconnected");
      }
    });
  };

  connect = () => {
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
        this.setState({ isConnected: true });
      } else {
        console.log("not connected");
        this.setState({ isConnected: false });
      }
    });
  };

  render() {
    console.log(getAuth().currentUser.displayName);
    if (this.state.isConnected) {
      return (
        <div className="flex justify-between h-screen">
          <Menu />
          <div className="w-2/3">
            {!this.state.isConnected && (
              <div>you are not connected to the interent</div>
            )}
          </div>
          <SideBar />
        </div>
      );
    } else {
      return <div>Seems you do not have an connections</div>;
    }
  }
}

export default Home;
