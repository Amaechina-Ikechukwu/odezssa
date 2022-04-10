import React, { Component } from "react";
import {
  Avatar,
  Button,
  Modal,
  Box,
  Divider,
  Popover,
  Typography,
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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60vw",
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
  };
  handlePopoverOpen = () => {
    this.setState({ anchorEl: true });
    this.getStore();
  };

  handlePopoverClose = () => {
    this.setState({ anchorEl: null });
  };

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

  render() {
    const { products } = this.props;
    const showopen = Boolean(this.state.anchorEl);
    const id = products.id;
    var n = products.price;
    var t = "";

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
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-light to-blue-light ">
                  You've selected
                </p>
                <Box
                  onMouseEnter={() => this.handlePopoverOpen()}
                  onClick={() => this.handlePopoverClose()}
                >
                  {" "}
                  <div className="flex justify-end">
                    {" "}
                    <Avatar src={products.uPhoto} />
                  </div>
                  <p>from {` ${products.uName}`}</p>
                  <Link
                    state={{ id: products.id }}
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
              </div>

              <Box>
                <div className="flex justify-evenly items-center">
                  <div>
                    <img
                      className="rounded-md b-2 "
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
                <div className="flex justify-evenly items-center mt-3">
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
                  <div className="bg-blue-200 p-3 rounded-md w-24 flex items-center justify-center">
                    <p className="text-lg font-bold ">
                      {parseInt(products.price) -
                        parseInt(products.price) *
                          (parseInt(+products.discount) / 100)}
                    </p>
                    <p className="text-lg ml-1 ">{t}</p>
                  </div>
                </div>
                <div className="w-full flex flex-col justify-center my-3">
                  <button className="bg-gradient-to-r from-blue-300 to-blue-400 text-white font-bold p-3 my-3 rounded-md  flex items-center justify-center">
                    Confirm Purchase
                  </button>
                  <div className="flex justify-center">
                    <p className="text-sm text-gray-400">have a large order?</p>
                    <p className="text-sm font-bold text-blue-500">
                      fill form here
                    </p>
                  </div>
                </div>
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
