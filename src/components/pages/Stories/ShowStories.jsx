import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

import {
  ArrowLeftIcon,
  ArrowNarrowRightIcon,
  ArrowRightIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
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

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  bgcolor: "white",
  height: "90vh",
  width: { xs: "90vw", sm: "90vw", md: "80vw", lg: "40vw" },
  boxShadow: 24,
  borderWidth: 0,
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

export default function ShowStories({ sopen, sclose, data, name }) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [seenStep, setSeenStep] = React.useState([]);
  const maxSteps = data.length;

  const handleNext = (index, datas) => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    handleStepChange(index, datas);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  let pushSeen = [];
  const handleStepChange = (step, datas) => {
    let seen = {};

    // setTimeout(() => {
    //   step + 2 === maxSteps ? timer() : console.log("going");
    // }, 5000);
  };

  // const submit = (e) => {
  //   e.preventDefault();
  //   setCurr(true);
  //   const auth = getAuth();
  //   var name = profile.displayName.substring(0, 10);
  //   setDoc(doc(collection(db, "viewedstories")), {
  //     id,
  //     descrip,

  //     uri,
  //   })
  //     .then(() => {
  //       // storie updated!

  //       console.log("done");
  //       setErrorr("");
  //       putUserstories(e);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setErrorr("error, please re-enter the fields and try again");
  //       sopen();
  //     });
  // };

  // const putUserstories = (e) => {
  //   e.preventDefault();
  //   var name = profile.displayName.substring(0, 10);
  //   const auth = getAuth();
  //   setDoc(
  //     doc(collection(db, `users/${auth.currentUser.uid}`, "viewedstories")),
  //     {
  //       id,
  //       descrip,
  //       uri,
  //     }
  //   )
  //     .then(() => {
  //       // Profile updated!
  //       scheck();
  //       console.log("done");
  //       setErrorr("");
  //       setDescrip("");

  //       setId("");

  //       setUri("");
  //       setImage(null);
  //       sclose();
  //       setCurr(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setErrorr("error, please re-enter the fields and try again");
  //       sopen();
  //     });
  // };

  const timer = (e) => {
    setTimeout(() => {
      sclose();
      setActiveStep(0);
    }, 500);
  };

  const toDelete = (datas, index) => {
    console.log("delete" + index);
  };

  return (
    <Modal
      open={sopen}
      onClose={sclose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={[style, { border: "none" }]} className="rounded-md border-0">
        <Box
          className=" flex flex-col p-1  "
          style={{
            position: "absolute",
            backgroundColor: "transparent",
            zIndex: 2,
            color: "white",
            width: "100vw",
          }}
        >
          <Box
            className=" flex items-center justify-center"
            style={{
              color: "white",
              width: "100%",
              zIndex: 3,
            }}
          >
            <Box
              style={{
                color: "white",
                width: "100%",
              }}
            >
              {" "}
              <MobileStepper
                variant="dots"
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                sx={{
                  backgroundColor: "transparent",
                  color: "white",
                  width: "100vw",
                  borderRadius: 30,
                }}
              />
            </Box>
          </Box>
          <Box
            className=" w-max p-1 rounded-sm "
            style={{
              color: "white",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            {name}
          </Box>
        </Box>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          enableMouseEvents
        >
          {data.map((step, index) => {
            return (
              <div
                className="rounded-md"
                style={{
                  height: "90vh",
                  backgroundImage: `url(${step.uri})`,
                  width: "100%",
                  overflow: "hidden",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",

                  aspectRatio: "1:1",
                }}
                key={Math.random().toString(36).substring(2, 9)}

                // onClick={() => toDelete(step, index)}
              >
                {Math.abs(activeStep - index) <= 2 ? (
                  <Box
                    // onClick={() => handleStepChange(index, step)}
                    className=" text-gray-400  flex flex-col h-full justify-between "
                  >
                    <div></div>
                    <Box className="h-4/5 w-full flex justify-between">
                      <Button
                        size="small"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                      />

                      <Button
                        size="small"
                        onClick={() => handleNext(index, step)}
                        disabled={activeStep === maxSteps - 1}
                      />
                    </Box>
                    <Box className="flex flex-col gap-2 ">
                      <Box
                        className=" w-full p-2 text-md "
                        style={{
                          color: "white",
                          backgroundColor: "rgba(0,0,0,0.5)",
                        }}
                      >
                        {step.descrip}
                      </Box>
                    </Box>
                  </Box>
                ) : null}
              </div>
            );
          })}
        </SwipeableViews>
      </Box>
    </Modal>
  );
}
