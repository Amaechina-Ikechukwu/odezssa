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
import { app } from "../../firebase";
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
import GetStories from "../pages/Stories/GetStories";
import ShowStories from "../pages/Stories/ShowStories";
import ViewProducts from "./ViewProducts";

function VisitProfile() {
  const location = useLocation();
  const navigation = useNavigate();

  const uid = location.state.id;
  const x = location.state.uPhoto;
  const y = location.state.uName;
  const [product, setproduct] = React.useState({});
  const [products, setproducts] = React.useState([]);
  const [user, setuser] = React.useState({});
  const [suscribed, setsuscribed] = React.useState();
  const [customers, setcos] = React.useState();
  const [load, setload] = React.useState(false);
  const [stories, setStories] = React.useState([]);
  const [sload, setsLoad] = React.useState(false);
  const [mload, setmload] = React.useState(false);
  const getStore = () => {
    const db = getFirestore(app);
    const q = query(collection(db, "products"));
    let list = [];
    let catt = [];
    const unsubcribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let products = {};
        products = doc.data();

        if (products.id === uid) {
          list.push(products);
        }
      });

      setproducts(list);
    });
  };

  const getUser = () => {
    const db = getFirestore(app);
    const q = query(collection(db, "users"));
    let list = {};
    isSuscribed();
    const unsubcribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let users = {};
        users = doc.id;

        if (users === uid) {
          list = doc.data();
        }
      });
      console.log(list);
      setload(true);
      setuser(list);
      checkMyStories();
    });
  };

  function suscribe() {
    const db = getDatabase();
    set(ref(db, `users/${uid}/ suscribers/${getAuth().currentUser.uid}`), {
      uid: getAuth().currentUser.uid,
    }).then(() => {
      console.log("done");
      isSuscribed();
    });
  }
  const isSuscribed = () => {
    setsuscribed(undefined);
    var dbRef = ref(getDatabase());
    get(child(dbRef, `users/${uid}/ suscribers/${getAuth().currentUser.uid}`))
      .then((snapshot) => {
        iSuscribed();
        if (snapshot.exists()) {
          setsuscribed(true);
          setcos(snapshot.size);

          console.log(snapshot.size);
        } else {
          console.log("No data available");
          setsuscribed(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const checkMyStories = async () => {
    const db = getFirestore(app);
    const q = query(collection(db, "users", uid, "stories"));
    let list = [];
    let stories = [];
    let err = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let haveStories = {};
      haveStories = doc.data();
      stories.push(haveStories);
    });

    let irish = [...new Set(stories)];
    setStories(irish);
  };

  const iSuscribed = () => {
    const db = getDatabase();
    set(ref(db, `users/${getAuth().currentUser.uid}/ suscribedTo/${uid}`), {
      uid: getAuth().currentUser.uid,
    }).then(() => {
      console.log("idone");
    });
  };
  const open = (e) => {
    setproduct(e);
    setmload(!mload);
  };
  const sclose = () => {
    setsLoad(!sload);
  };

  React.useEffect(() => {
    getUser();
    getStore();
  }, []);
  return (
    <Box>
      {load == false ? (
        <Box className="h-full flex items-center justify-center">
          <CircularProgress size={100} />
        </Box>
      ) : (
        <Box>
          <Box>
            <Box
              height={"30vh"}
              className="flex  flex-col items-center justify-center bg-gradient-to-r from-red-light to-blue-light g-3 p-2"
            >
              <Box className="flex-col items-center justify-center ">
                <p className="text-6xl text-white font-bold">
                  {" "}
                  {user.displayName}
                </p>
              </Box>
              <Box className="flex gap-5 justify-center items-center">
                <p className="text-lg text-white font-medium">
                  Customers: {customers}
                </p>
                {!suscribed ? (
                  <div>
                    {suscribed === undefined ? (
                      <CircularProgress size={20} />
                    ) : (
                      <button
                        onClick={() => suscribe()}
                        className="text-lg text-white font-medium border-2 p-1 rounded-md shadow-sm"
                      >
                        Suscribe
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-lg text-slate-500 font-medium  p-1 ">
                    Suscribed
                  </p>
                )}
              </Box>
            </Box>
          </Box>
          <Box className="my-2 bg-slate-50">
            <Divider>
              <Avatar
                sx={{ width: "150px", height: "150px" }}
                className=" my-2"
                alt="AI"
                src={user.photoURL}
              />
            </Divider>
          </Box>
          <Box className="p-2">
            <p className="font-bold text-gray-500">
              Use Cases{" "}
              <p className="font-medium text-gray-400"> Products in use</p>
            </p>
            <Box
              style={{ overflow: "auto" }}
              className="flex flex-row p-1 items-center gap-2  "
            >
              {stories.map((c) => (
                <div
                  onClick={() => setsLoad(!sload)}
                  className="h-3/4 w-36  rounded-md"
                >
                  <img
                    className="rounded-md"
                    src={c.uri}
                    style={{ objectSize: "cover", objectPosition: "center" }}
                  />
                </div>
              ))}
            </Box>
            <ShowStories
              key={Math.random().toString(36).substring(2, 9)}
              data={stories}
              name={user.displayName}
              sopen={sload}
              sclose={sclose}
            />
          </Box>
          <Box className="p-2">
            <p className="font-bold text-gray-500">Categories</p>
            <Box className="flex flex-row p-1 flex-wrap gap-2 ">
              {products.map((c) => (
                <p className=" font-medium p-2 rounded-lg border-sm shadow-md text-gray-500 ">
                  {c.catergory}
                </p>
              ))}
            </Box>
          </Box>
          <Divider className="mt-2"></Divider>
          <Box className="bg-slate-50 h-full p-2 bg-white grid grid-cols-2  justify-center   md:grid-cols-2  lg:grid-cols-3  gap-2">
            {products.map((product, index) => (
              <Box className="">
                <Box
                  key={`${Math.random().toString(36).substring(2, 9)}odezssa`}
                  onClick={() => open(product)}
                  className="   lg:w-full   rounded-md p-2 bg-white shadow-md "
                >
                  <div className="  h-max ">
                    <div className="font-bold text-gray-500">
                      {product.pName}
                    </div>
                    <div>
                      {" "}
                      <p className="font-medium text-gray-500 text-md  ">
                        {product.descrip}
                      </p>
                    </div>
                  </div>
                  <div>
                    <img
                      className="rounded-md b-2 "
                      src={product.uri}
                      style={{
                        objectFit: "contain ",
                        height: "320px",
                        objectPosition: "center",
                        width: "320px",
                      }}
                    />
                  </div>
                  <div className="flex justify-between w-full mt-2">
                    <div className=" w-full ">
                      <div className="flex  w-full ">
                        <p className=" text-gray-500 text-md mr-1">Price: </p>
                        <p className=" text-gray-600 font-bold ">{` ${product.price}`}</p>
                      </div>
                      <div className="flex  w-full ">
                        <p className=" text-gray-500 text-md mr-1">
                          Discount:{" "}
                        </p>{" "}
                        <p className=" text-gray-500 font-bold ">
                          {` ${product.discount}`}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="rounded-lg text-white p-2 bg-gradient-to-r from-blue-300 to-blue-400">
                    GET
                  </button>
                </Box>
              </Box>
            ))}
          </Box>
          <ViewProducts
            products={product}
            isOpen={mload}
            isClose={() => {
              setmload(!mload);
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default VisitProfile;
