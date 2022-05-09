import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Avatar, Button, Modal } from "@mui/material";
import Typography from "@mui/material/Typography";
import { ArrowNarrowRightIcon, XCircleIcon } from "@heroicons/react/outline";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { app } from "../../firebase";
import {
  doc,
  setDoc,
  getFirestore,
  onSnapshot,
  collection,
} from "firebase/firestore";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";

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
  width: "70vw",
  height: "80vh",
  bgcolor: "white",
  borderRaduis: "200px",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
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

export default function OpenMarket({ sopen, sclose, cury, call }) {
  var profile = getAuth().currentUser;

  //   var profile = useSelector((state) => state.profile.value[0]);
  // let user = {};

  const getUsers = () => {
    const db = getFirestore(app);
    onSnapshot(doc(db, "users", getAuth().currentUser.uid), (doc) => {});
  };
  // const [user, setUser] = useState({});
  const [pName, setPName] = useState("");
  const [descrip, setDescrip] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState();
  const [stock, setStock] = useState("");
  const [uri, setUri] = useState("");
  const [id, setId] = useState(profile.uid);
  const [catergory, setCatergory] = useState("");
  const [errorr, setErrorr] = useState("");
  const [load, setLoad] = useState("");
  const [curr, setCurr] = useState(false);
  const [cur, setCur] = useState("");
  const onPick = (event) => {
    setImage(event.target.files[0]);
  };

  const handleClose = () => {
    setCurr(false);
  };
  const uploadImage = (e) => {
    e.preventDefault();
    const storage = getStorage(app);
    const storageRef = ref(
      storage,
      `products/${profile.uid}/${Math.random()
        .toString(36)
        .substring(2, 9)}odezssa`
    );

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
          submit(e, downloadURL);
          console.log("File available at", downloadURL);
        });
      }
    );
  };

  // Add a new document in collection "cities"
  const db = getFirestore(app);

  const required = (e, downloadURL) => {
    if (pName === "") {
      setErrorr("please enter product name field");
    } else if (price === "") {
      setErrorr("Please check the price field");
    } else if (price.length >= 8) {
      setErrorr("Please, the price shouldn't be greater than 8");
    } else if (isNaN(price)) {
      setErrorr("Please, the price field is not a number");
    } else if (descrip === "") {
      setErrorr("Please fill the descrip field");
    } else if (catergory === "") {
      setErrorr("Please fill the catergory field");
    } else if (stock === "") {
      setErrorr("Please check the stock field");
    } else if (isNaN(stock)) {
      setErrorr("Please, the stock field is not a number");
    } else if (stock.length >= 6) {
      setErrorr("Please,the stock field shouldn't be greater than 6");
    } else if (image === "") {
      setErrorr("select an image field");
    } else if (cur === "") {
      setErrorr("select a currency ");
    } else if (discount === "") {
      setErrorr("Please check the discount field");
    } else if (discount.length >= 3) {
      setErrorr("Please, the discount field should be less than 100");
    } else if (isNaN(discount)) {
      setErrorr("Please, the discount field should be a number");
    } else {
      setErrorr("");
      setCurr(true);

      uploadImage(e);
    }
  };

  const putUserProduct = (e, downloadURL) => {
    e.preventDefault();
    var name = profile.displayName.substring(0, 10);
    const auth = getAuth();
    setDoc(doc(collection(db, `users/${auth.currentUser.uid}`, "products")), {
      discount,
      price: `${price} ${cur}`,
      id,
      descrip,
      catergory,
      stock,
      uri: downloadURL,
      pName,
      uName: profile.displayName,
      uPhoto: profile.photoURL,
    })
      .then(() => {
        // Profile updated!

        console.log("done");
        setErrorr("");
        setDescrip("");
        setPrice("");
        setId("");
        setCatergory("");
        setDiscount("");
        setStock("");
        setPName("");
        setUri("");
        setImage("");
        sclose();
        call();
        setCurr(false);
      })
      .catch((error) => {
        console.log(error);
        setErrorr("error, please re-enter the fields and try again");
        sopen();
      });
  };

  const curs = Object.entries(cury);

  const submit = (e, downloadURL) => {
    e.preventDefault();

    const auth = getAuth();
    var name = profile.displayName.substring(0, 10);
    setDoc(doc(collection(db, "products")), {
      discount,
      price: `${price} ${cur}`,
      id,
      descrip,
      catergory,
      stock,
      uri: downloadURL,
      pName,
      uName: name,
      uPhoto: profile.photoURL,
    })
      .then(() => {
        // Profile updated!

        console.log("done");
        setErrorr("");
        putUserProduct(e, downloadURL);
      })
      .catch((error) => {
        console.log(error);
        setErrorr("error, please re-enter the fields and try again");
        sopen();
      });
  };

  React.useEffect(() => {
    getUsers();
  });

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
      <Box sx={style} className="  rounded-md">
        {" "}
        <div className=" text-blue-400  rounded-md text-3xl">
          Add Product, commence sales
        </div>
        <Box>
          <div className=" flex flex-col items-center justify-center w-full ">
            <TextField
              id="outlined-basic"
              label="Name of Product"
              variant="outlined"
              margin="normal"
              fullWidth
              onChange={(e) => setPName(e.target.value)}
            />

            <TextField
              id="outlined-basic"
              label="Brief description"
              variant="outlined"
              margin="normal"
              fullWidth
              onChange={(e) => setDescrip(e.target.value)}
            />
            <div className="px-1">
              <div className="bg-yellow-100 text-yellow-400 p-2 rounded-md">
                Description shouldnt be longer than 50 words
              </div>
            </div>
            <div className="flex w-full flex-col lg:flex-row justify-around items-center p-2">
              <TextField
                id="outlined-basic"
                label="Price"
                variant="outlined"
                margin="normal"
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                onChange={(e) => setPrice(e.target.value)}
              />
              <TextField
                id="standard-select-currency"
                select
                label="Select"
                value={cur}
                style={{ height: 55 }}
                onChange={(e) => setCur(e.target.value)}
                helperText="Please select your currency"
              >
                {curs.map((x) => (
                  <MenuItem key={x[1]} value={x[0]}>
                    {x[0]} : {x[1]}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <TextField
              id="outlined-basic"
              label="Discounted"
              variant="outlined"
              margin="normal"
              fullWidth
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              onChange={(e) => setDiscount(e.target.value)}
            />

            <TextField
              id="outlined-basic"
              label="Stock remaining"
              variant="outlined"
              margin="normal"
              fullWidth
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              onChange={(e) => setStock(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Catergory"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              onChange={(e) => setCatergory(e.target.value)}
            />
          </div>

          <div className=" flex flex-col items-center justify-center w-full">
            <div className=" w-full flex flex-col items-center">
              <Avatar
                sx={{ width: 120, height: 120 }}
                src={uri !== "" ? uri : image}
              />
              <div className="px-1">
                <div className="bg-yellow-100 text-yellow-400 p-2 mt-1 rounded-md">
                  Add best picture for the product
                </div>
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
                {/* <button
                  onClick={uploadImage}
                  className="h-10 rounded-lg lg:w-2/5 w-4/5 p-6 mt-2  flex items-center justify-center bg-gray-700"
                >
                  <h1 class="text-white text-1xl md:text-2xl ">
                    {load !== "" ? `${load}%` : "upload image"}
                  </h1>
                </button> */}
              </div>

              {/* {image !== "" ? (
                <div className="w-full bg-yellow-200  text-yellow-400 p-2 rounded-md">
                  The photo uploads automatically when selected, if you get an
                  error, please press Upload button
                </div>
              ) : null} */}
              <div>
                {errorr !== "" ? (
                  <div className="w-full bg-red-100  text-red-600 p-2 rounded-md mt-1">
                    {errorr}
                  </div>
                ) : null}
              </div>

              <button
                onClick={required}
                className="h-10 rounded-lg  p-8 mt-8 flex items-center justify-evenly bg-gradient-to-r from-blue-300 to-blue-400"
              >
                <h1 class="text-white text-2xl md:text-3xl mr-2 ">
                  Add to store
                </h1>
                {load !== "" ? (
                  <CircularProgressWithLabel
                    className="text-white "
                    value={load}
                    sx={{ color: "white", fontSize: 20 }}
                  />
                ) : (
                  <ArrowNarrowRightIcon className="w-10 text-white h-20" />
                )}
              </button>
              <Backdrop
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
              </Backdrop>
            </div>
          </div>
        </Box>
      </Box>
    </Modal>
  );
}
