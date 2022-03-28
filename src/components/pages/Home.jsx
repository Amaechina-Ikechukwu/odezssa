import { getAuth } from "firebase/auth";
import React, { Component } from "react";
import Menu from "./Menu";
import SideBar from "./Sidebar";

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(getAuth().currentUser.displayName);
    return (
      <div className="flex justify-between h-screen">
        <Menu />
        <div className="w-2/3"></div>
        <SideBar />
      </div>
    );
  }
}

export default Home;
