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

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import {
  ChatAlt2Icon,
  HomeIcon,
  MenuAlt1Icon,
  SearchCircleIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import { ShoppingBagIcon } from "@heroicons/react/outline";
import { ViewListIcon } from "@heroicons/react/solid";
import { ChatIcon } from "@heroicons/react/solid";
import { ClipboardListIcon, PhoneIcon } from "@heroicons/react/outline";
import {
  Link,
  NavLink,
  useHistory,
  useNavigate,
  Navigate,
  useNavigationType,
} from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

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
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: true,
      open: false,
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClickClose = () => {
    this.setState({ open: false });
  };

  active =
    "hover:text-blue-300 bg-white  text-gray-700  p-4  flex flex-row justify-evenly w-36 mb-2  opacity-80";
  inactive =
    " hover:text-lg text-gray-400 p-4 rounded-md flex flex-row justify-evenly items-center w-full mb-2";

  googlesignout = () => {
    const { navigation } = this.props;

    var auth = getAuth();
    signOut(auth)
      .then((mssg) => {
        console.log(mssg);
        // Sign-out successful.

        window.location.assign("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    return (
      <Box className=" p-2 lg:border-r-2 flex flex-row bg-slate-50  lg:flex-col items-center justify-around  md:items-center  lg:w-36  ">
        <Box className=" flex flex-col justify start ">
          <h1 className=" font-bold text-3xl md:text-3xl lg:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-red-light to-blue-light">
            odezssa
          </h1>
        </Box>
        <Box className=" flex lg:flex-col items-center justify-end lg:justify-evenly h-full   w-full">
          <Box className="md:block lg:hidden ">
            <Tabs aria-label="icon tabs example" indicatorColor="disabled">
              <Tab
                sx={{ borderWidth: "none" }}
                icon={
                  <MenuAlt1Icon
                    width={20}
                    // color={!value ? "rgba(0,0,0,.65)" : "rgba(0,0,0,.25)"}
                  />
                }
                aria-label="phone"
              />
              <Tab
                icon={
                  <SearchIcon
                    width={20}
                    // color={value ? "rgba(0,0,0,.65)" : "rgba(0,0,0,.25)"}
                  />
                }
                aria-label="favorite"
              />
            </Tabs>
          </Box>
          <Box className="hidden md:hidden lg:block ">
            <Box className="flex flex-col items-center mb-2 justify-evenly mr-4 w-full mb-2 ">
              <NavLink
                className={({ isActive }) =>
                  isActive ? this.active : this.inactive
                }
                to="/"
              >
                <HomeIcon width={20} className=" mr-1 " />
                <p className="text-1xl font-normal">Home </p>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? this.active : this.inactive
                }
                to="/market"
              >
                <ShoppingBagIcon width={20} className=" mr-1" />
                <p className="text-1xl  font-normal">Market </p>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? this.active : this.inactive
                }
                to="/wishlist"
              >
                <ClipboardListIcon width={20} className="mr-1" />
                <p className="text-1xl  font-normal">Wishlist </p>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? this.active : this.inactive
                }
                to="/chats"
              >
                <ChatAlt2Icon width={20} className=" mr-1" />
                <p className="text-1xl  font-normal">Messages </p>
              </NavLink>
            </Box>
          </Box>
          <Divider></Divider>

          <Box className="p-2 w-full bg-gray-100 rounded-lg w-full mt-3 hidden lg:block">
            <button
              onClick={() => this.handleClickOpen()}
              className="hover: hover:text-red-500 text-red-400 p-2 rounded-md flex flex-row justify-evenly items-center w-full "
            >
              log out
            </button>
            <button className="hover:bg-gray-100 hover:text-yellow-500 text-yellow-300 p-2 rounded-md flex flex-row justify-evenly items-center w-full ">
              settings
            </button>
          </Box>
          <Dialog
            open={this.state.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => this.handleClickClose()}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{"Leaving odezssa :( ?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Continue log-out? Odezssa is still here for you :)
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                onClick={() => this.handleClickClose()}
              >
                Stay
              </Button>
              <Button onClick={() => this.googlesignout()}>Log Out</Button>
            </DialogActions>
          </Dialog>

          <NavLink to="/profile">
            <Box
              display="flex"
              flexDirection={"column"}
              alignItems="center"
              justifyContent={"center"}
              className=" rounded-full "
            >
              <Avatar
                src={getAuth().currentUser.photoURL}
                alt="AI"
                className="h-24 w-24"
              />
              <p className="truncate flex items-center justify-center">
                {getAuth().currentUser.displayName.substring(0, 6)}...
              </p>
            </Box>
          </NavLink>
        </Box>
        <Modal>
          <Box
            sx={{
              ...style,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box className="flex flex-col    ">
              <NavLink
                activeClassName=" bg-gradient-to-r from-red-light to-blue-light text-blue-50  p-4 rounded-md flex flex-row justify-center  mb-2"
                className="hover:bg-gradient-to-r from-red-light to-blue-light hover:text-slate-50 text-gray-400 p-4 rounded-md flex flex-row justify-center items-center mb-2"
                to="/home"
              >
                <HomeIcon width={30} className=" mr-5" />
                <p className=" font-bold text-3xl">Home </p>
              </NavLink>
              <NavLink
                activeClassName=" bg-gradient-to-r from-red-light to-blue-light text-blue-50  p-4 rounded-md flex flex-row justify-center  mb-2"
                className="hover:bg-gradient-to-r from-red-light to-blue-light hover:text-slate-50 text-gray-400 p-4 rounded-md flex flex-row justify-center items-center mb-2"
                to="/market"
              >
                <ShoppingBagIcon width={30} className=" mr-5" />
                <p className=" font-bold text-3xl">Market </p>
              </NavLink>
              <NavLink
                activeClassName=" bg-gradient-to-r from-red-light to-blue-light text-blue-50  p-4 rounded-md flex flex-row justify-center  mb-2"
                className="hover:bg-gradient-to-r from-red-light to-blue-light hover:text-slate-50 text-gray-400 p-4 rounded-md flex flex-row justify-center items-center mb-2"
                to="/wishlist"
              >
                <ClipboardListIcon width={30} className=" mr-5 " />
                <p className=" font-bold text-3xl">Wishlist </p>
              </NavLink>
              <NavLink
                activeClassName=" bg-gradient-to-r from-red-light to-blue-light text-blue-50  p-4 rounded-md flex flex-row justify-center  mb-2"
                className="hover:bg-gradient-to-r from-red-light to-blue-light hover:text-slate-50 text-gray-400 p-4 rounded-md flex flex-row justify-center items-center mb-2"
                to="/chats"
              >
                <ChatAlt2Icon width={30} className=" mr-5" />
                <p className=" font-bold text-3xl">Messages </p>
              </NavLink>
              <Divider></Divider>
              <Box className="p-2 w-full bg-gray-200 shadow-inner shadow-lg rounded-lg mt-3">
                <button className="hover:bg-gray-100 hover:text-slate-50 text-gray-400 p-2 rounded-md flex flex-row justify-evenly items-center w-full ">
                  log out
                </button>
              </Box>
            </Box>
          </Box>
        </Modal>
        <Modal
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
          className="bg-gray-700"
        >
          <Box
            sx={{
              ...styles,
              width: 400,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p className="text-2xl font-bold text-gray-400 mb-2">
              We've noticed you haven't created a profile.... :)
            </p>

            <h2
              className="text-2xl  text-gray-400 mb-2"
              id="parent-modal-title"
            >
              SIGN UP
            </h2>
            <div class="flex flex-col items-center justify-center   w-full  h-2/5 mt-7 ">
              <button className="h-10 rounded-lg w-full p-10 mb-2  flex items-center justify-center bg-gradient-to-b from-grad to-black">
                <Link to="/shopper">
                  <h1 class="text-white text-5xl ">shopper</h1>
                </Link>
              </button>

              <button className="h-10 rounded-lg w-full p-10 mt-2 flex items-center justify-center bg-gradient-to-r from-red-light to-blue-light">
                <Link to="/seller">
                  <h1 class="text-white text-5xl  ">seller</h1>
                </Link>
              </button>
            </div>
          </Box>
        </Modal>
      </Box>
    );
  }
}

export default Menu;
