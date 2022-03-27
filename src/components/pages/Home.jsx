import React, { Component } from "react";
import Menu from "./Menu";
import SideBar from "./Sidebar";

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="flex justify-around h-screen">
        <Menu />
        <div className="w-2/3"></div>
        <SideBar />
      </div>
    );
  }
}

export default Home;
