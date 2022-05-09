import React, { Component } from "react";
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
} from "@mui/material";
import {
  doc,
  getDoc,
  getFirestore,
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";
import { app } from "../../firebase";
import { connect } from "../logics/checkConnect";
import { getAuth } from "firebase/auth";
import { Link, NavLink } from "react-router-dom";
import { getAutoHeightDuration } from "@mui/material/styles/createTransitions";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90vw", sm: "90vw", md: "80vw", lg: "60vw" },
  height: "90vh",
  bgcolor: "white",
  borderRaduis: "200",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
};
export class ViewProducts extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    anchorEl: null,
    user: null,
    products: [],
    mount: false,
    excurs: [],
    excur: "",
    base: "",
    excur: "",
    amount: "",
    price: "",
    suser: {},
  };
  handlePopoverOpen = () => {
    this.setState({ anchorEl: true });
    this.getStore();
  };

  handlePopoverClose = () => {
    this.setState({ anchorEl: null });
  };

  // getUser = () => {
  //   const db = getFirestore(app);
  //   const q = query(collection(db, "users"));
  //   let list = {};

  //   const unsubcribe = onSnapshot(q, (querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       let users = {};
  //       users = doc.id;

  //       if (users.id === uid) {
  //         list = doc.data();
  //       }
  //     });
  //     console.log(list);
  //     this.setState({ suser: list });
  //   });

  //   // let list = {};
  //   // const q = query(collection(db, "users"));

  //   // const querySnapshot = getDocs(q);
  //   // querySnapshot.forEach((doc) => {
  //   //   if (doc.id === uid) {
  //   //     list = doc.data();
  //   //   }
  //   // });
  //   // users.push(list);
  //   // setuser(users);
  // };

  getStore = () => {
    const db = getFirestore(app);
    const q = query(collection(db, "products"));
    let list = [];
    const unsubcribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let products = {};
        products = doc.data();
        if (products.id === this.props.products.id) {
          list.push(products);
        }
      });
      console.log(list);
      this.setState({ products: list.sort(), open: false });
    });
  };

  getExCur = () => {
    fetch(
      "https://v6.exchangerate-api.com/v6/42fc7ba16da8c48a8cddde62/latest/USD"
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        var recy = data.conversion_rates;
        this.setState({ excurs: Object.entries(recy) });
        console.log(recy);
      })
      .catch((err) => {
        // console.log(`currency error : ${err}`);
      });
  };
  test = (e) => {
    var t = this.props.products.price;
    var n = t.split(" ");
    var f = n[n.length - 1];
    var h = n[0];
    var g = Math.round(
      parseInt(h) -
        parseInt(h) * (parseInt(+this.props.products.discount) / 100)
    );

    this.setState({ base: n[n.length - 1], amount: n[0], excur: e });
    // this.getCov(e);
    // if (this.state.base !== "") {
    //   this.getCov(e);
    // }

    fetch(
      ` https://v6.exchangerate-api.com/v6/42fc7ba16da8c48a8cddde62/pair/${f}/${e}/${g}`
      // `http://data.fixer.io/api/convert?access_key=5f26df97ca29b2a807e2d3255adfd682&from=${f}&to=${e}&amount=${g}`
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        var recy = data.conversion_result;
        // this.setState({ excurs: recy });

        this.setState({ base: "", amount: "", price: recy });
      })
      .catch((err) => {
        // console.log(`currency error : ${err}`);
        this.setState({ price: "failed" });
      });
  };

  getvalue = (e) => {
    this.setState({ excur: e.target.value });
  };

  componentDidMount() {
    this.getExCur();
  }

  render() {
    const { products } = this.props;
    const showopen = Boolean(this.state.anchorEl);

    const { excurs } = this.state;
    if (products === undefined) {
      return <div>no content</div>;
    } else {
      return (
        <Modal
          open={this.props.isOpen}
          onClose={this.props.isClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="rounded-md">
            {" "}
            <Box>
              <div className="flex  items-center justify-between">
                <p className="text-3xl font-bold text-transparent hidden lg:block bg-clip-text bg-gradient-to-r from-red-light to-blue-light ">
                  You've selected
                </p>
                <Box
                  onMouseEnter={() => this.handlePopoverOpen()}
                  onClick={() => this.handlePopoverClose()}
                >
                  {" "}
                  <div className="flex lg:justify-end ">
                    {" "}
                    {products.id === getAuth().currentUser.uid ? (
                      <p className="text-3xl font-bold text-gray-500 ">You</p>
                    ) : (
                      <Box>
                        <Avatar src={products.uPhoto} />

                        <p>from {` ${products.uName}`}</p>
                        <Link
                          state={{
                            id: products.id,
                            uName: products.uName,
                            uPhoto: products.uPhoto,
                          }}
                          to={{
                            pathname: `/vprofile`,
                            search: `${products.uName}`,
                          }}
                        >
                          <Button
                            sx={{ color: "white" }}
                            className=" bg-gradient-to-r from-red-light to-blue-light text-white font-bold w-full"
                          >
                            View Profile{" "}
                          </Button>
                        </Link>
                      </Box>
                    )}
                  </div>
                </Box>
              </div>

              <Box>
                <div className="flex flex-col lg:flex-row justify-evenly items-center">
                  <div>
                    <img
                      className="rounded-md mt-2 lg:mt-0 "
                      src={products.uri}
                      style={{
                        objectFit: "contain ",
                        height: "320px",
                        objectPosition: "center",
                        width: "320px",
                      }}
                    />
                  </div>
                  <div className="divide-y divide-double">
                    <div className="flex p-2">
                      <p className="text-lg  text-gray-400 mx-1 ">
                        Product Name:{" "}
                      </p>{" "}
                      <p className="text-lg font-bold text-gray-600">
                        {` ${products.pName}`}
                      </p>
                    </div>

                    <div className="flex p-2">
                      <p className="text-lg  text-gray-400 mr-1">
                        Description:{" "}
                      </p>{" "}
                      <p className="text-lg font-bold text-gray-600">
                        {products.descrip}
                      </p>
                    </div>
                    <div className="flex p-2">
                      <p className="text-lg  text-gray-400 mr-1">Catergory:</p>
                      <p className="text-lg font-bold text-gray-600">
                        {" "}
                        {products.catergory}
                      </p>
                    </div>
                    <div className="flex p-2">
                      <p className="text-lg  text-gray-400 mx-1">
                        Stock Remaining:
                      </p>
                      <p className="text-lg font-bold text-gray-600">
                        {" "}
                        {products.stock}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Divider sx={{ height: 20 }} />
                  <p className="mt-2">Purchase</p>
                </div>
                <div className="flex flex-col lg:flex-row justify-evenly  mt-3">
                  <div>
                    <p className="text-lg  text-gray-400">Price</p>
                    <p className="text-lg font-bold text-gray-600">
                      {products.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg text-gray-400">Discount</p>
                    <p className="text-lg font-bold text-gray-600">
                      {products.discount}%
                    </p>
                  </div>
                  <div className="bg-blue-200 p-3 rounded-md w-full lg:w-64 h-max flex flex-col items-center justify-center">
                    <div className="bg-blue-200 p-3 rounded-md w-full flex flex-row items-center justify-between">
                      <p className="text-lg font-bold ">
                        {parseInt(products.price) -
                          parseInt(products.price) *
                            (parseInt(+products.discount) / 100)}{" "}
                        {products.price !== undefined
                          ? products.price.split(" ")[1]
                          : null}
                      </p>
                      <TextField
                        id="standard-select-currency"
                        select
                        label="Select"
                        value={this.state.excur}
                        style={{
                          height: "fit-content",
                          width: "fit-content",
                        }}
                        onChange={(e) => this.test(e.target.value)}
                        helperText="switch currency"
                      >
                        {excurs.map((x) => (
                          <MenuItem
                            key={`${Math.random()
                              .toString(36)
                              .substring(2, 9)}`}
                            value={x[0]}
                          >
                            {x[0]} : {x[1]}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                    <Divider />
                    <div>
                      <p className="text-lg font-bold mt-2">
                        {this.state.price} {this.state.excur}
                      </p>
                    </div>
                  </div>
                </div>
                {products.id === getAuth().currentUser.uid ? null : (
                  <div className="w-full flex flex-col justify-center my-3">
                    <button className="bg-gradient-to-r from-blue-300 to-blue-400 text-white font-bold p-3 my-3 rounded-md  flex items-center justify-center">
                      Confirm Purchase
                    </button>
                    <div className="flex lg:justify-center w-max">
                      <p className="text-xs lg:text-sm       text-gray-400">
                        have a large order?
                      </p>
                      <p className="text-xs lg:text-sm font-bold text-blue-500">
                        fill form here
                      </p>
                    </div>
                  </div>
                )}
              </Box>
            </Box>{" "}
            <Popover
              id="mouse-over-popover"
              sx={{
                pointerEvents: "none",
              }}
              open={showopen}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              onClose={() => this.handlePopoverClose()}
              disableRestoreFocus
            >
              <Box className="p-2">
                {" "}
                <div className="flex ">
                  {" "}
                  <Avatar src={products.uPhoto} />
                </div>
                <p>from {` ${products.uName}`}</p>
                <div>
                  <div>
                    Visit profile to see {this.state.products.length} other
                    products
                  </div>
                </div>
              </Box>
            </Popover>
          </Box>
        </Modal>
      );
    }
  }
}

export default ViewProducts;
