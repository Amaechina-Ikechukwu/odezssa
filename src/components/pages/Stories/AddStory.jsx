import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Avatar, Button, CardMedia, Modal, Typography } from "@mui/material";

import { ArrowNarrowRightIcon, XCircleIcon } from "@heroicons/react/outline";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { app } from "../../../firebase";
import {
  doc,
  setDoc,
  getFirestore,
  onSnapshot,
  collection,
} from "firebase/firestore";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";

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
  width: { xs: "90vw", sm: "90vw", md: "80vw", lg: "60vw" },
  height: "90vh",
  bgcolor: "white",
  borderRaduis: "200px",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
  borderRaduis: 50,
};

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="white">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

export default function AddStory({ sopen, sclose, scheck }) {
  var profile = getAuth().currentUser;

  //   var profile = useSelector((state) => state.profile.value[0]);
  // let user = {};

  const getUsers = () => {
    const db = getFirestore(app);
    onSnapshot(doc(db, "users", getAuth().currentUser.uid), (doc) => {
      // this.setState({ user: doc.data() });
      // setUser(doc.data());
      // console.log("Current data: ", user);
      // setCountry(user.country);
      // setState(user.state);
      // setAddress(user.address);
      // setPhone(user.phoneNumber);
    });
  };

  const [image, setImage] = useState(null);
  const [descrip, setDescrip] = useState("");
  const [uri, setUri] = useState("");
  const [id, setId] = useState(profile.uid);

  const [errorr, setErrorr] = useState("");
  const [load, setLoad] = useState("");
  const [curr, setCurr] = useState(false);
  const [cur, setCur] = useState(false);
  const onPick = (event) => {
    setImage(event.target.files[0]);

    console.log(event.target.files);
    uploadImage(event.target.files[0]);
    // timer(event.target.files[0]);
  };

  const timer = (e) => {
    setTimeout(() => {
      uploadImage(e);
    }, 7000);
  };

  const handleClose = () => {
    setCurr(false);
  };
  const uploadImage = (e) => {
    const storage = getStorage(app);
    const storageRef = ref(
      storage,
      `stories/${profile.uid}/${Math.random()
        .toString(36)
        .substring(2, 9)}odezssa`
    );

    // [START storage_monitor_upload]
    var uploadTask = uploadBytesResumable(storageRef, e);

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
            sopen();
            break;
          case "storage/canceled":
            // User canceled the upload
            setLoad("User canceled the upload");
            sopen();
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            setLoad("Unknown error occurred, inspect error.serverResponse");
            sopen();
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

  const required = (e, downloadURL) => {
    if (descrip === "") {
      setErrorr("Please fill the descrip field");
    } else if (image === "") {
      setErrorr("select an image field");
    } else {
      setErrorr("");

      submit(e);
    }
  };

  const putUserstories = (e) => {
    e.preventDefault();
    var name = profile.displayName.substring(0, 10);
    const auth = getAuth();
    setDoc(doc(collection(db, `users/${auth.currentUser.uid}`, "stories")), {
      id,
      descrip,
      uri,
    })
      .then(() => {
        // Profile updated!
        scheck();
        console.log("done");
        setErrorr("");
        setDescrip("");

        setId("");

        setUri("");
        setImage(null);
        sclose();
        setCurr(false);
      })
      .catch((error) => {
        console.log(error);
        setErrorr("error, please re-enter the fields and try again");
        sopen();
      });
  };

  const submit = (e) => {
    e.preventDefault();
    setCurr(true);
    const auth = getAuth();
    var name = profile.displayName.substring(0, 10);
    setDoc(doc(collection(db, "stories")), {
      id,
      descrip,

      uri,
    })
      .then(() => {
        // storie updated!

        console.log("done");
        setErrorr("");
        putUserstories(e);
      })
      .catch((error) => {
        console.log(error);
        setErrorr("error, please re-enter the fields and try again");
        sopen();
      });
  };

  const clear = () => {
    setImage(null);
    setUri("");
  };

  React.useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleToggle = () => {
    setCurr(!curr);
  };

  return (
    <Modal
      open={sopen}
      onClose={sclose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="rounded-md flex flex-col justify-evenly gap-5">
        {" "}
        <div className="mt-2">
          <div className=" text-blue-400  rounded-md text-lg">Add Use Case</div>
          <div className=" text-orange-300  rounded-md text-md">
            not automatically deleted but removed by the seller has see fit.
          </div>
        </div>
        <Box className="flex flex-col items-center justify-between h-full">
          <Box className="flex flex-col gap-3 items-center justify-center  h-full">
            {image !== null ? (
              <div className="bg-gray-200 text-gray-400 w-4/5 flex items-center justify-center rounded-md h-full">
                {" "}
                {uri !== "" ? (
                  <img
                    style={{
                      objectFit: "contain ",
                      aspectRatio: "16:9",
                      objectPosition: "center",
                    }}
                    src={uri}
                  />
                ) : (
                  <div className=" w-4/5 flex items-center justify-center rounded-md h-full">
                    <CircularProgressWithLabel
                      className="text-gray-400 "
                      value={load}
                      sx={{ fontSize: 20, color: "gray" }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <Box className="bg-gray-200 text-gray-400 w-4/5 flex items-center justify-center rounded-md h-full">
                {" "}
                Add Photo
              </Box>
            )}

            <Box>
              <button
                className="h-10 rounded-lg     bg-gray-500 "
                onClick={() => clear()}
              >
                <input
                  class="text-white text-1xl md:text-1xl "
                  type="file"
                  name="file"
                  onChange={onPick}
                />
              </button>
            </Box>
          </Box>

          <Box className="flex flex-col items-center mt-2 w-full">
            <TextField
              id="outlined-basic"
              label="Brief description"
              variant="outlined"
              margin="normal"
              fullWidth
              onChange={(e) => setDescrip(e.target.value)}
            />

            <Box>
              <div>
                {errorr !== "" ? (
                  <div className="w-full bg-red-100  text-red-600 p-2 rounded-md m-1">
                    {errorr}
                  </div>
                ) : null}
              </div>
            </Box>
            <Box>
              <Button
                autoCapitalize={"false"}
                onClick={required}
                className="h-12 rounded-lg w-max  p-8 mt-3 flex items-center justify-evenly bg-gradient-to-r from-blue-300 to-blue-400"
              >
                <Typography variant="h3" class="text-white text-lg mr-2 ">
                  Add Use Case
                </Typography>
                {curr !== false ? (
                  <CircularProgress
                    className="text-white "
                    value={curr}
                    sx={{ color: "white", fontSize: 10 }}
                    size={20}
                  />
                ) : (
                  <ArrowNarrowRightIcon className="w-10 text-white h-20" />
                )}
              </Button>
              {/* <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 2,
                }}
                open={curr}
                onClick={handleClose}
              >
                <CircularProgressWithLabel
                  className="text-white "
                  value={load}
                  sx={{ color: "white", fontSize: 20 }}
                />
              </Backdrop> */}
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
