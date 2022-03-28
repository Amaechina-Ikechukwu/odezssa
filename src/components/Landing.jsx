import React, { Component } from "react";
import "../App.css";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
const colors = require("tailwindcss/colors");
export class Landing extends Component {
  constructor() {
    super();
    this.state = {
      A: false,
    };
  }

  googlesign = () => {
    var auth = getAuth();
    var provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user.metadata);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  googlesignout = () => {
    var auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };

  timer = () => {
    setTimeout(() => {
      this.setState({
        A: true,
      });
    }, 3000);
  };

  componentDidMount() {
    this.timer();
  }

  render() {
    return (
      <div className=" flex flex-col md:flex-row items-center justify-evenly px-4 h-screen w-full lg:h-screen lg:w-full">
        <div class="bg-odes-img bg-cover flex items-center justify-center   h-full border-red-900">
          <h1 class="font-extrabold text-transparent text-7xl md:text-9xl bg-clip-text bg-gradient-to-r from-red-light to-blue-light h-auto">
            odezssa
          </h1>
        </div>

        <div className="lg:w-2/5 h-full flex flex-col items-center justify-center">
          {this.state.A === false ? (
            <div>
              <div class="flex flex-col items-center ">
                <h1 className="text-5xl lg:text-8xl">find what you need</h1>
                <div className="animate-wiggle bg-gradient-to-r from-red-light to-blue-light h-3 w-full  m-10 " />
                <h3 className="text-4xl  lg:text-7xl ">
                  RATHER, CREATE YOUR OWN STORE...
                </h3>
              </div>
            </div>
          ) : (
            <div class="flex flex-col items-center justify-center w-full  ">
              <button
                onClick={() => this.googlesign()}
                className="h-10 rounded-lg w-full p-10   flex items-center justify-center bg-gradient-to-b from-grad to-black"
              >
                <h1 class="text-white text-4xl p-4  flex items-center justify-center">
                  connect with google
                </h1>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Landing;
