import React, { Component } from "react";
import { Avatar } from "@mui/material";
export class StatusCheck extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="flex flex-col items-center justify-center p-1">
        <div className=" flex flex-col items-center justify-center w-full md:w-3/5">
          <div className=" w-full flex flex-col items-center">
            <Avatar sx={{ width: 120, height: 120 }} />

            <div className="w-full bg-yellow-100  text-yellow-600 p-2 rounded-md mt-1">
              You can only update photo
            </div>

            <div className="w-full flex flex-col md:flex-row items-center justify-evenly">
              <button className="h-10 rounded-lg lg:w-2/5 w-4/5 p-6 mt-2  flex items-center justify-center bg-gray-500">
                <input
                  class="text-white text-1xl md:text-1xl "
                  type="file"
                  name="file"
                />
              </button>
              <button className="h-10 rounded-lg lg:w-2/5 w-4/5 p-6 mt-2  flex items-center justify-center bg-gray-700">
                <h1 class="text-white text-1xl md:text-2xl ">Upload</h1>
              </button>
            </div>

            <button className="h-10 rounded-lg  p-8 mt-14 flex items-center justify-evenly bg-gradient-to-r from-red-light to-blue-light">
              <h1 class="text-white text-2xl md:text-4xl  ">complete update</h1>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default StatusCheck;
