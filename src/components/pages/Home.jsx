import { getAuth } from "firebase/auth";
import {
  Avatar,
  Button,
  Modal,
  Box,
  Divider,
  Popover,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import React, { Component } from "react";
import Menu from "./Menu";
import SideBar from "./Sidebar";
import {
  doc,
  getDocs,
  getFirestore,
  collection,
  onSnapshot,
  query,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { app } from "../../firebase";
import {
  getDatabase,
  ref,
  onValue,
  push,
  onDisconnect,
  set,
  serverTimestamp,
  get,
  child,
} from "firebase/database";
import { PlusIcon, SearchIcon } from "@heroicons/react/outline";
import AddStory from "./Stories/AddStory";
import GetStories from "./Stories/GetStories";
import ProductPost from "./Homepages/ProductPost";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: Boolean,
      open: false,
      data: [],
      products: [],
      story: [],
    };
  }

  componentDidMount() {
    // this.checkConnection();
    this.connect();
    this.checkMyStories();
    this.checkSellers();
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

  checkMyStories = async () => {
    const db = getFirestore(app);
    const q = query(
      collection(db, "users", getAuth().currentUser.uid, "stories")
    );
    let list = [];
    let stories = [];
    let err = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let haveStories = {};
      haveStories = doc.data();
      stories.push(haveStories);
    });

    let irish = [...new Set(stories)];
    this.setState({ data: irish });
  };

  checkSellers = () => {
    let hasSellers = [];
    var dbRef = ref(getDatabase());
    get(child(dbRef, `users/${getAuth().currentUser.uid}/ suscribers/`))
      .then((snapshot) => {
        let list = {};
        if (snapshot.exists()) {
          list = snapshot.val();
          for (const key in list) {
            if (key !== getAuth().currentUser.uid) {
              hasSellers.push(key);
            }
          }

          this.getStore(hasSellers);
          this.checkStories(hasSellers);
          console.log(snapshot.val());
        } else {
          console.log("No data available");
        }
      })

      .catch((error) => {
        console.error(error);
      });
  };
  getStore = async (hasSellers) => {
    const db = getFirestore(app);
    const q = query(collection(db, "products"));
    let list = [];
    let stories = [];
    let storyid = [];
    let haveStories = {};
    let dataPush = [];
    let dataObj = [];
    let uniqueId = [];
    let uniqueData = [];
    let xxx = [];
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      let storiesid = doc.data().id;
      if (storiesid.includes(hasSellers)) {
        storyid.push(doc.data().id);
        uniqueId = [...new Set(storyid)];
        dataObj.push(doc.data());
        uniqueData = [...new Set(dataObj)];
        list.push(uniqueData);
        let see = [];
        console.log(dataObj);
      }
    });
    this.setState({ products: dataObj, open: false });
  };

  checkStories = async (x) => {
    const db = getFirestore(app);
    const q = query(collection(db, "stories"));
    let list = [];
    let stories = [];
    let storyid = [];
    let haveStories = {};
    let dataPush = [];
    let dataObj = [];
    let uniqueId = [];
    let uniqueData = [];
    let xxx = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let storiesid = doc.data().id;
      if (storiesid.includes(x)) {
        storyid.push(doc.data().id);
        uniqueId = [...new Set(storyid)];
        dataObj.push(doc.data());
        uniqueData = [...new Set(dataObj)];
        list.push(storyid);
        let see = [];
        console.log(uniqueId);
      }
      for (var i = 0; i < uniqueData.length; i++) {
        for (var j = 0; j < uniqueId.length; j++) {
          if (
            uniqueData[i].id === uniqueId[j] &&
            uniqueData[i].id !== getAuth().currentUser.uid &&
            uniqueId[j] !== getAuth().currentUser.uid
          ) {
            dataPush.push(uniqueData[i]);
            const uds = dataPush.map((o) => o.descrip);
            const ufiltered = dataPush.filter(
              (cc, index) => !uds.includes(cc.descrip, index + 1)
            );
            haveStories = {
              id: uniqueId[j],
              key: Math.random().toString(36).substring(2, 9),
              data: ufiltered,
            };
            xxx = [haveStories];

            // let storySet = [...new Set(xxx)];
            // stories.push(storySet);
          }
        }
      }
    });
    const ids = xxx.map((o) => o.id);
    const filtered = xxx.filter(
      ({ id }, index) => !ids.includes(id, index + 1)
    );

    this.setState({ story: filtered });
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
        this.checkMyStories();
        this.checkSellers();

        this.setState({ isConnected: true });
      } else {
        console.log("not connected");
        this.setState({ isConnected: false });
      }
    });
  };

  render() {
    return (
      // <div className="flex justify-center items-center h-full">
      //   seems you haven't suscribed to any seller
      // </div>
      <Box className=" gap-4 p-1">
        <Box className="flex items-center g">
          <Box className="p-1 w-max">
            <div className="flex flex-col gap-1 items-center ">
              <button
                onClick={() => this.setState({ open: true })}
                className=" rounded-full w-max p-1"
              >
                <PlusIcon
                  style={{ width: 40, height: 40 }}
                  className="text-gray-500 text-blue-300 hover:text-blue-400 "
                />
              </button>
              <p className=" text-xs text-gray-500 ">Add use case</p>
            </div>
          </Box>
          <AddStory
            sopen={this.state.open}
            sclose={() => {
              this.setState({ open: false });
            }}
            scheck={() => this.checkMyStories()}
          />
          <GetStories data={this.state.data} story={this.state.story} />
        </Box>
        <ProductPost products={this.state.products} />
      </Box>
    );
  }
}

export default Home;
