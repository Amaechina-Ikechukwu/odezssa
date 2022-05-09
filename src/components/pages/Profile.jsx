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
import ShowStories from "./Stories/ShowStories";
import ViewProducts from "../products/ViewProducts";
import {
  doc,
  getDoc,
  getFirestore,
  collection,
  onSnapshot,
  query,
  getDocs,
} from "firebase/firestore";
import { app } from "../../firebase";
import { connect } from "../logics/checkConnect";
import { getDatabase, ref, onValue, set, get, child } from "firebase/database";

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      user: {},
      products: [],
      story: [],
      productModal: false,
      storyModal: false,
      sellers: Number,
      customers: Number,
      modalOpen: {},
    };
  }

  getUsers = () => {
    const db = getFirestore(app);
    onSnapshot(doc(db, "users", getAuth().currentUser.uid), (doc) => {
      this.setState({ user: doc.data() });
      console.log("Current data: ", doc.data());
    });
  };

  getStore = () => {
    const db = getFirestore(app);
    const q = query(collection(db, "products"));
    let list = [];
    let catt = [];
    const unsubcribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let products = {};
        products = doc.data();

        if (products.id === getAuth().currentUser.uid) {
          list.push(products);
        }
      });

      this.setState({ products: list });
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
    this.setState({ story: irish });
  };
  iSuscribed = () => {
    var dbRef = ref(getDatabase());
    get(child(dbRef, `users/${getAuth().currentUser.uid}/ suscribedTo`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.setState({ sellers: snapshot.size });
          console.log(snapshot);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  hasSuscribers = () => {
    var dbRef = ref(getDatabase());
    get(child(dbRef, `users/${getAuth().currentUser.uid}/ suscribers`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.setState({ customers: snapshot.size });
          console.log(snapshot);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  componentDidMount() {
    this.iSuscribed();
    this.getUsers();
    this.checkMyStories();
    this.getStore();
    this.hasSuscribers();
    console.log(connect);
  }

  Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  productModal = (e) => {
    this.setState({ productModal: true, modalOpen: e });
  };
  storyModal = () => {
    this.setState({ storyModal: false });
  };
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
            <Box>
              <Box className="flex gap-5 justify-center items-center">
                <p className="text-lg text-white font-medium">
                  Suscribed To: {this.state.sellers}{" "}
                  {this.state.sellers > 1 ? "sellers" : "seller"}
                </p>
                <p className="text-lg text-white font-medium">
                  Customers:
                  {this.state.customers === 0 || this.state.customers === NaN
                    ? ` ${0}`
                    : ` ${this.state.customers}`}
                </p>
              </Box>
            </Box>
          </Box>
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
          <Box
            className="flex flex-col gap-4 "
            // sx={{
            //   flexGrow: 1,
            //   padding: "10px",
            //   display: "flex",
            //   alignItems: "center",
            //   justifyContent: "center",
            // }}
          >
            {/* <Tabs
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
          </Tabs> */}
            <Box className="p-2">
              <p className="font-bold text-gray-500">
                Use Cases{" "}
                <p className="font-medium text-gray-400"> Products in use</p>
              </p>
              <Box
                style={{ overflow: "auto" }}
                className="flex flex-row p-1 items-center gap-2  "
              >
                {this.state.story.map((c) => (
                  <div
                    onClick={() => this.setState({ storyModal: true })}
                    className="h-3/4 w-36  rounded-md"
                  >
                    <img
                      className="rounded-md"
                      src={c.uri}
                      style={{ objectSize: "cover", objectPosition: "center" }}
                    />
                  </div>
                ))}
              </Box>
              <ShowStories
                key={Math.random().toString(36).substring(2, 9)}
                data={this.state.story}
                name={getAuth().currentUser.displayName}
                sopen={this.state.storyModal}
                sclose={this.storyModal}
              />
            </Box>
            <Box className="p-2">
              <p className="font-bold text-gray-500">Your Categories</p>
              <Box className="flex flex-row p-1 flex-wrap gap-2 ">
                {this.state.products.map((c) => (
                  <p className=" font-medium p-2 rounded-lg border-sm shadow-md text-gray-500 ">
                    {c.catergory}
                  </p>
                ))}
              </Box>
            </Box>

            <Box className="bg-slate-50 h-full p-2 bg-white grid grid-cols-2  justify-center   md:grid-cols-2  lg:grid-cols-3  gap-2">
              {this.state.products.map((product, index) => (
                <Box className="">
                  <Box
                    key={`${Math.random().toString(36).substring(2, 9)}odezssa`}
                    onClick={() => this.productModal(product)}
                    className="  lg:w-full rounded-md p-2 bg-white shadow-md "
                  >
                    <div className="  h-max ">
                      <div className="font-bold text-gray-500">
                        {product.pName}
                      </div>
                      <div>
                        {" "}
                        <p className="font-medium text-gray-500 text-md  ">
                          {product.descrip}
                        </p>
                      </div>
                    </div>
                    <div>
                      <img
                        className="rounded-md b-2 "
                        src={product.uri}
                        style={{
                          objectFit: "contain ",
                          height: "320px",
                          objectPosition: "center",
                          width: "320px",
                        }}
                      />
                    </div>
                  </Box>
                </Box>
              ))}
              <ViewProducts
                products={this.state.modalOpen}
                isOpen={this.state.productModal}
                isClose={() => {
                  this.setState({ productModal: false });
                }}
              />
            </Box>
          </Box>

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
                <p className="w-1/5">
                  {" "}
                  {user === undefined ? "" : user.country}
                </p>
              </div>
              <div className="flex justify-around w-full mb-2">
                <p className="w-3/5">State </p>
                <p className="w-1/5 break-words">
                  {" "}
                  {user === undefined ? "" : user.state}
                </p>
              </div>
              <div className="flex justify-around w-full mb-2">
                <p className="w-3/5">Phone </p>{" "}
                <p className="w-1/5">
                  {" "}
                  {user === undefined ? "" : user.phoneNumber}
                </p>
              </div>
              <div className="flex justify-around w-full mb-2">
                <p className="w-3/5">Address </p>{" "}
                <p className="w-1/5">
                  {" "}
                  {user === undefined ? "" : user.address}
                </p>
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
          user={this.state.user !== {} ? this.state.user : null}
        />
      </Box>
    );
  }
}
export default Profile;
