import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import { getDatabase, ref, onValue, set, get, child } from "firebase/database";
import CircularProgress from "@mui/material/CircularProgress";
import {
  doc,
  getDocs,
  getFirestore,
  collection,
  onSnapshot,
  query,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { app } from "../../../firebase";
import {
  Avatar,
  Button,
  Modal,
  Box,
  Divider,
  Popover,
  Typography,
  TextField,
  MenuItem,
  getListItemSecondaryActionClassesUtilityClass,
} from "@mui/material";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import ShowStories from "./ShowStories";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 9,
    top: 50,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

function GetStories({ data, story }) {
  const navigation = useNavigate();
  console.log(data);
  const [users, setUsers] = React.useState([]);
  const [products, setproducts] = React.useState([]);

  const [myStory, setMyStory] = React.useState([""]);
  const [storyids, setStoryids] = React.useState([]);
  const [sellers, setSellers] = React.useState([]);
  const [load, setLoad] = React.useState(false);
  const [sload, setsLoad] = React.useState(false);

  React.useEffect(() => {
    getUser();
  }, []);

  function suscribe() {
    const db = getDatabase();
    set(ref(db, `users/${"uid"}/ suscribers/${getAuth().currentUser.uid}`), {
      uid: getAuth().currentUser.uid,
    }).then(() => {
      console.log("done");
    });
  }

  const getUser = () => {
    const db = getFirestore(app);
    const q = query(collection(db, "users"));
    let list = [];

    const unsubcribe = onSnapshot(q, (querySnapshot) => {
      console.log(querySnapshot);
      querySnapshot.forEach((doc) => {
        let users;
        users = { id: doc.id, data: doc.data() };

        list.push(users);
      });
      console.log(list);

      setUsers(list);
    });
  };

  const iSuscribed = () => {
    const db = getDatabase();
    set(ref(db, `users/${getAuth().currentUser.uid}/ suscribedTo/${"uid"}`), {
      uid: getAuth().currentUser.uid,
    }).then(() => {
      console.log("idone");
    });
  };
  // const timer = (e) => {
  //   setTimeout(() => {
  //     checkMyStories();
  //   }, 1000);
  // };

  const open = () => {
    setLoad(!load);
  };

  const close = () => {
    setLoad(!load);
  };
  const sclose = () => {
    setsLoad(!sload);
  };

  return (
    <Box className="flex items-center  gap-2">
      <Box>
        {data.length !== 0 ? (
          <div
            className="flex flex-col items-center"
            key={Math.random().toString(36).substring(2, 9)}
          >
            {" "}
            <StyledBadge
              badgeContent={data.length}
              color="primary"
              onClick={() => setsLoad(!sload)}
            >
              {" "}
              <img
                className="border-2 border-blue-400 p-1 rounded-full"
                style={{
                  objectFit: "cover ",
                  aspectRatio: "1:1",
                  objectPosition: "center",
                  height: 50,
                  width: 50,
                }}
                src={data[data.length - 1].uri}
              />
            </StyledBadge>
            <p className=" text-xs text-gray-500 ">You</p>
            <ShowStories
              key={Math.random().toString(36).substring(2, 9)}
              data={data}
              name={"You"}
              sopen={sload}
              sclose={sclose}
            />
          </div>
        ) : (
          <div></div>
        )}
      </Box>
      <Box>
        {story !== [{}] ? (
          <Box>
            {story.map((cases) => {
              return (
                <div className="flex flex-col items-center" key={cases.key}>
                  <StyledBadge
                    badgeContent={cases.data.length}
                    color="primary"
                    onClick={() => setLoad(!load)}
                  >
                    <img
                      className="border-2 border-blue-400 p-1 rounded-full"
                      style={{
                        objectFit: "cover ",
                        aspectRatio: "1:1",
                        objectPosition: "center",
                        height: 50,
                        width: 50,
                      }}
                      src={cases.data[0].uri}
                    />
                  </StyledBadge>

                  {users.map((use) => {
                    if (use.id === cases.data[0].id) {
                      return (
                        <p className=" text-xs text-gray-500 ">
                          {use.data.displayName.split(" ")[0]}
                          <ShowStories
                            data={cases.data}
                            key={cases.key}
                            name={use.data.displayName}
                            sopen={load}
                            sclose={close}
                          />
                        </p>
                      );
                    }
                  })}
                </div>
              );
            })}
          </Box>
        ) : (
          <Box>
            {" "}
            <CircularProgress
              className="text-white "
              color="primary"
              sx={{ color: "blue", fontSize: 10 }}
              size={20}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default GetStories;
