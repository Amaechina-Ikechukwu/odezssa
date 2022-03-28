import { Avatar, Divider } from "@mui/material";
import { Box } from "@mui/system";
import React, { Component } from "react";

import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import { getAuth } from "firebase/auth";
import UpdateProfile from "./UpdateProfile";
import {
  doc,
  getDoc,
  getFirestore,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { app } from "../../firebase";
import { connect } from "../logics/checkConnect";

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      user: {},
    };
  }

  getUsers = () => {
    const db = getFirestore(app);
    onSnapshot(doc(db, "users", getAuth().currentUser.uid), (doc) => {
      this.setState({ user: doc.data() });
      console.log("Current data: ", doc.data());
    });
  };

  // getUser = async () => {
  //   const db = getFirestore(app);
  //   const userRef = collection(db, "users");

  //   const docRef = onSnapshot(doc(userRef, getAuth().currentUser.uid));
  //   console.log(getAuth().currentUser.uid);
  //   const docSnap = await getDoc(docRef);
  //   console.log(docSnap.exists);
  //   if (docSnap.exists) {
  //     console.log("Document data:", docSnap.data());
  //     this.setState({ user: docSnap.data() });
  //   } else {
  //     // doc.data() will be undefined in this case
  //     console.log("No such document!");
  //   }
  // };

  componentDidMount() {
    // const getUser = async () => {
    //   const db = getFirestore(app);
    //   const userRef = collection(db, "users");

    //   const docRef = doc(userRef, getAuth().currentUser.uid);
    //   console.log(getAuth().currentUser.uid);
    //   const docSnap = await getDoc(docRef);
    //   console.log(docSnap.exists);
    //   if (docSnap.exists) {
    //     console.log("Document data:", docSnap.data());
    //   } else {
    //     // doc.data() will be undefined in this case
    //     console.log("No such document!");
    //   }
    // };
    this.getUsers();
    console.log(connect);
  }

  Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  render() {
    var profile = getAuth().currentUser;
    var user = this.state.user;
    return (
      <Box className="h-screen">
        <Box>
          <Box
            height={"30vh"}
            className="flex  flex-col items-center justify-center bg-gradient-to-r from-red-light to-blue-light  p-2"
          >
            <Box className="flex-col items-center justify-center ">
              <p className="text-6xl text-white"> {profile.displayName}</p>
            </Box>
          </Box>
        </Box>
        <Box
          className="mt-1 bg-gradient-to-r from-red-light to-blue-light"
          sx={{
            flexGrow: 1,
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Tabs
            bgcolor="lightgreen"
            // value={value}
            // onChange={handleChange}
            variant="scrollable"
            scrollButtons
            aria-label="visible arrows tabs example"
            sx={{
              height: "5vh",
            }}
            TabIndicatorProps={{
              style: {
                backgroundColor: "white",
                color: "white",
              },
            }}
          >
            <Tab label={<p className="text-white text-2xl">Info</p>} />
            <Tab label={<p className="text-white text-2xl">Purchases</p>} />
            <Tab label={<p className="text-white text-2xl">Info</p>} />
            <Tab label={<p className="text-white text-2xl">Info</p>} />
          </Tabs>
        </Box>
        {/* <Box height={"55vh"} sx={{ overflow: "auto" }}>
        <Box className="flex">
          <Box bgcolor={"white"} height={"100px"} padding={2}>

          </Box>
        </Box>
      </Box> */}

        {/* //////////////////////////////////////////////////////////////////////////////////////////////// */}
        <Box className=".card md:p-2 flex-col items-center justify-center  md:justify-start">
          <Divider className="mt-2">
            <Avatar
              sx={{ width: "150px", height: "150px" }}
              className=" my-2"
              alt="AI"
              src={profile.photoURL}
            />
          </Divider>
          <div className="px-1">
            <div className="bg-yellow-100 text-yellow-400 p-2 rounded-md">
              Only you can see this info
            </div>
          </div>
          <Box className="h-full w-full flex-col justify-evenly  ">
            <Box className=" flex flex-col w-full  text-gray-400">
              <div className="flex justify-around w-full h-full mb-2">
                <p className="w-3/5">Email </p>{" "}
                <p className="w-1/5 break-words"> {profile.email}</p>
              </div>
              <div className="flex justify-around w-full h-full mb-2">
                <p className="w-3/5">Country </p>{" "}
                <p className="w-1/5"> {user.country}</p>
              </div>
              <div className="flex justify-around w-full mb-2">
                <p className="w-3/5">State </p>
                <p className="w-1/5 break-words"> {user.state}</p>
              </div>
              <div className="flex justify-around w-full mb-2">
                <p className="w-3/5">Phone </p>{" "}
                <p className="w-1/5"> {user.phoneNumber}</p>
              </div>
              <div className="flex justify-around w-full mb-2">
                <p className="w-3/5">Address </p>{" "}
                <p className="w-1/5"> {user.address}</p>
              </div>
            </Box>
            <Box className="h-full flex flex-col items-end text-gray-400 p-2">
              <div className="flex h justify-evenly">
                <button
                  onClick={() => {
                    this.setState({ open: true });
                  }}
                  className="p-2 bg-gray-500 text-white rounded-md m-1"
                >
                  Edit
                </button>
                <button className="p-2 bg-red-light text-white rounded-md m-1">
                  Delete Account
                </button>
              </div>
            </Box>
          </Box>
        </Box>
        <UpdateProfile
          sopen={this.state.open}
          sclose={() => {
            this.setState({ open: false });
          }}
          user={this.state.user}
        />
      </Box>
    );
  }
}
export default Profile;
