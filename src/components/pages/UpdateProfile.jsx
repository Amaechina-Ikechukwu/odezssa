import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Avatar, Button, Modal } from "@mui/material";
import Typography from "@mui/material/Typography";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { app } from "../../firebase";
import { doc, setDoc, getFirestore } from "firebase/firestore";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  useHistory,
} from "react-router-dom";

import React, { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  height: "70vh",
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
};

export default function UpdateProfile({ sopen, sclose, user }) {
  var profile = getAuth().currentUser;
  //   var profile = useSelector((state) => state.profile.value[0]);

  const [fullName, setFullName] = useState(profile.displayName);
  const [Email, setEmail] = useState(profile.email);
  const [country, setCountry] = useState(user.country);
  const [state, setState] = useState(user.state);
  const [image, setImage] = useState(profile.photoURL);
  const [address, setAddress] = useState(user.address);
  const [uri, setUri] = useState("");
  const [phone, setPhone] = useState(user.phoneNumber);
  const [load, setLoad] = useState("");
  const [error, seterror] = useState("");
  const onPick = (event) => {
    setImage(event.target.files[0]);
    uploadImage(event);
  };
  const uploadImage = (e) => {
    e.preventDefault();
    const storage = getStorage(app);
    const storageRef = ref(storage, `profile/${profile.uid}`);

    // [START storage_monitor_upload]
    var uploadTask = uploadBytesResumable(storageRef, image);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setLoad(parseInt(`${progress}`));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            setLoad("User doesn't have permission to access the object");
            break;
          case "storage/canceled":
            // User canceled the upload
            setLoad("User canceled the upload");
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            setLoad("Unknown error occurred, inspect error.serverResponse");
            break;
        }
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUri(downloadURL);
          setLoad("");
          console.log("File available at", downloadURL);
        });
      }
    );
  };

  // Add a new document in collection "cities"
  const db = getFirestore(app);
  const pushToFirestore = () => {
    setDoc(doc(db, "users", profile.uid), {
      country: country,
      state: state,
      address: address,
      phoneNumber: phone,
    }).then(() => {
      sclose();
    });
  };

  const submit = (e) => {
    e.preventDefault();

    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: fullName,
      photoURL: `${uri == null ? image : uri}`,
      //   country: country,
      //   state: state,
      //   address: address,
      //   phoneNumber: phone,
    })
      .then(() => {
        // Profile updated!
        // ...
        pushToFirestore();
        console.log("done");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Modal
      open={sopen}
      onClose={sclose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box>
          <div className=" flex flex-col items-center justify-center w-full ">
            <TextField
              id="outlined-basic"
              label="full name"
              variant="outlined"
              margin="normal"
              fullWidth
              defaultValue={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <TextField
              id="outlined-basic"
              label="email address"
              variant="outlined"
              margin="normal"
              fullWidth
              defaultValue={Email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="px-1">
              <div className="bg-yellow-100 text-yellow-400 p-2 rounded-md">
                Only you can see this info
              </div>
            </div>
            <TextField
              id="outlined-basic"
              label="country"
              variant="outlined"
              margin="normal"
              fullWidth
              defaultValue={country}
              onChange={(e) => setCountry(e.target.value)}
            />

            <TextField
              id="outlined-basic"
              label="state/city"
              variant="outlined"
              margin="normal"
              fullWidth
              defaultValue={state}
              onChange={(e) => setState(e.target.value)}
            />

            <TextField
              id="outlined-basic"
              label="residence address"
              variant="outlined"
              margin="normal"
              fullWidth
              defaultValue={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="phone number"
              variant="outlined"
              margin="normal"
              fullWidth
              defaultValue={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className=" flex flex-col items-center justify-center w-full">
            <div className=" w-full flex flex-col items-center">
              <Avatar
                sx={{ width: 120, height: 120 }}
                src={uri ? uri : image}
              />

              <div className="w-full bg-yellow-100  text-yellow-600 p-2 rounded-md mt-1">
                The photo uploads automatically when selected, if you get an
                error, please press Upload button
              </div>

              <div className="w-full flex flex-col md:flex-row items-center justify-evenly">
                <button className="h-10 rounded-lg lg:w-2/5 w-4/5 p-6 mt-2  flex items-center justify-center bg-gray-500">
                  <input
                    class="text-white text-1xl md:text-1xl "
                    type="file"
                    name="file"
                    onChange={onPick}
                  />
                </button>
                <button
                  onClick={uploadImage}
                  className="h-10 rounded-lg lg:w-2/5 w-4/5 p-6 mt-2  flex items-center justify-center bg-gray-700"
                >
                  <h1 class="text-white text-1xl md:text-2xl ">
                    {load !== "" ? `${load}%` : "upload image"}
                  </h1>
                </button>
                {/* <input
                  class="text-gray-500 text-1xl md:text-2xl "
                  type="file"
                  name="file"
                /> */}
              </div>

              {/* {image !== "" ? (
                <div className="w-full bg-yellow-200  text-yellow-400 p-2 rounded-md">
                  The photo uploads automatically when selected, if you get an
                  error, please press Upload button
                </div>
              ) : null} */}

              <button
                onClick={submit}
                className="h-10 rounded-lg  p-8 mt-14 flex items-center justify-evenly bg-gradient-to-r from-red-light to-blue-light"
              >
                <h1 class="text-white text-2xl md:text-4xl  ">
                  complete update
                </h1>
                <ArrowNarrowRightIcon className="w-20 text-white h-20" />
              </button>
            </div>
          </div>
        </Box>
      </Box>
    </Modal>
  );
}
