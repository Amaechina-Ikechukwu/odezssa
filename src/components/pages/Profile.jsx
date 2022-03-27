import { Avatar, Divider } from "@mui/material";
import { Box } from "@mui/system";
import React, { Component } from "react";

import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

export class Profile extends Component {
  constructor(props) {
    super(props);
  }

  Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  render() {
    return (
      <Box className="h-screen">
        <Box>
          <Box
            height={"30vh"}
            className="flex  flex-col items-center justify-center bg-gradient-to-r from-red-light to-blue-light  p-2"
          >
            <Box className="flex-col items-center justify-center ">
              <p className="text-6xl text-white"> {"profile.Fullname"}</p>
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
                <p className="w-1/5 break-words"> {"profile.email"}</p>
              </div>
              <div className="flex justify-around w-full h-full mb-2">
                <p className="w-3/5">Country </p>{" "}
                <p className="w-1/5"> {"profile.country"}</p>
              </div>
              <div className="flex justify-around w-full mb-2">
                <p className="w-3/5">State </p>
                <p className="w-1/5 break-words"> {"profile.state"}</p>
              </div>
              <div className="flex justify-around w-full mb-2">
                <p className="w-3/5">Phone </p>{" "}
                <p className="w-1/5"> {"profile.phone"}</p>
              </div>
              <div className="flex justify-around w-full mb-2">
                <p className="w-3/5">Address </p>{" "}
                <p className="w-1/5"> {"profile.address"}</p>
              </div>
            </Box>
            <Box className="h-full flex flex-col items-end text-gray-400 p-2">
              <div className="flex h justify-evenly">
                <button
                  // onClick={() => {
                  //   setOpen(true);
                  // }}
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
      </Box>
    );
  }
}
export default Profile;
