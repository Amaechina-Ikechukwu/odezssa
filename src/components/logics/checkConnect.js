import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  onValue,
  push,
  onDisconnect,
  set,
  serverTimestamp,
} from "firebase/database";

var connect = () => {
  const db = getDatabase();
  var myConnectionsRef = ref(db, `users/${getAuth().currentUser.uid}`);

  // stores the timestamp of my last disconnect (the last time I was seen online)
  var lastOnlineRef = ref(db, `users/${getAuth().currentUser.uid}/lastOnline`);

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

export { connect };
