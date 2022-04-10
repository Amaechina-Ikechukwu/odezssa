import React, { Component } from "react";
import {
  Avatar,
  Button,
  ButtonGroup,
  Divider,
  Modal,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

import {
  ChatAlt2Icon,
  HomeIcon,
  MenuAlt1Icon,
  SearchCircleIcon,
  SearchIcon,
} from "@heroicons/react/solid";
import { ShoppingBagIcon } from "@heroicons/react/solid";
import { ViewListIcon } from "@heroicons/react/solid";
import { ChatIcon } from "@heroicons/react/solid";
import { ClipboardListIcon, PhoneIcon } from "@heroicons/react/outline";
import { Link, NavLink, useHistory } from "react-router-dom";
import { getAuth } from "firebase/auth";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",

  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  borderRadius: 5,
  backgroundColor: "white",
};
const styles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "black",
  border: "2px solid #CEA1A1",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  borderRadius: 5,
  backgroundColor: "white",
};

export class SideBar extends Component {
  constructor(props) {
    super(props);
  }
  state = {};
  render() {
    return (
      <Box className=" p-1 lg:border-x-1 flex  w-40  flex-col items-center justify-center  h-full hidden md:hidden lg:block  ">
        <Box className=" flex flex-col justify-start ">
          <h1 className=" font-bold text-3xl md:text-3xl lg:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-red-light to-blue-light">
            Promos
          </h1>
        </Box>
        <Box className="  bg-gradient-to-b from-blue-300 to-blue-500 rounded-md p-1 shadow-md flex flex-col  ">
          <Box className="w-full flex flex-col ">
            <div className=" text-white mb-3 ">
              hey y'all, I've got some discount for you all
            </div>
            <div className=" flex justify-end text-left w-full mt-3">
              <div className="flex flex-col items-end">
                <Avatar src={getAuth().currentUser.photoURL}> Luke</Avatar>
                <h2 className=" text-white text-left">zara sales</h2>
              </div>
            </div>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default SideBar;
