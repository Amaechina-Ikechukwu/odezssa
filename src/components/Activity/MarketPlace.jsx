import { Avatar, Box, ImageListItemBar } from "@mui/material";
import React, { Component } from "react";
import {
  doc,
  getDoc,
  getFirestore,
  collection,
  onSnapshot,
  getDocs,
  query,
} from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { app } from "../../firebase";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { StarIcon } from "@heroicons/react/outline";
import CircularProgress from "@mui/material/CircularProgress";
import ViewProducts from "../products/ViewProducts";

export class MarketPlace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      name: "",
      id: "",
      open: true,
      productModal: false,
      modalOpen: {},
    };
  }

  componentDidMount() {
    var tv = [];
    tv = getAuth().currentUser.displayName.substring(0, 10);
    console.log(tv);
    this.getStore();
  }

  //   getProducts = () => {
  //     const db = getFirestore(app);
  //     onSnapshot(doc(collection(db, "products")), (doc) => {
  //       this.setState({ products: doc.data() });
  //       console.log("Current products: ", doc.data());
  //     });
  //   };

  productModal = (e) => {
    this.setState({ productModal: true, modalOpen: e });
  };

  srcset = (image, width, height, rows = 1, cols = 1) => {
    return {
      src: `${image}?auto=format`,
      srcSet: `${image}?&auto=format&dpr=2 2x`,
    };
  };
  getStore = () => {
    const db = getFirestore(app);
    const q = query(collection(db, "products"));
    let list = [];
    const unsubcribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let products = {};
        products = doc.data();
        console.log(products);
        list.push(products);
      });
      this.setState({ products: list.sort(), open: false });
    });

    console.log(list);
  };
  id = "";

  render() {
    return this.state.open === true ? (
      <div className="w-full h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    ) : (
      <Box className="p-2 w-full grid grid-rows-auto   lg:grid-cols-3  gap-2">
        {this.state.products.map((product) => {
          var name = product.uName;
          var cat = product.catergory;

          return (
            <Box
              key={`${Math.random().toString(36).substring(2, 9)}odezssa`}
              className="max-h-max min-h-min h-min w-3/5 lg:w-full   rounded-md p-2 bg-white shadow-md bg-slate-50"
            >
              <div className="  h-max ">
                <div className="font-bold text-gray-500">{product.pName}</div>
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
                    <p className=" text-gray-500 text-md mr-1">Discount: </p>{" "}
                    <p className=" text-gray-500 font-bold ">
                      {` ${product.discount}`}%
                    </p>
                  </div>
                </div>
                <div className="">
                  <div className="flex justify-end">
                    <Avatar src={product.uPhoto} size="small" />
                  </div>
                  <div className="flex flex-col justify-end">
                    {" "}
                    <p
                      className="truncate text-ellipsis text-right  "
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: " nowrap",
                      }}
                    >
                      {name}...
                    </p>
                    <p className="truncate text-ellipsis text-right text-sm">
                      {cat}
                    </p>
                  </div>
                </div>
              </div>
              <button
                className="rounded-lg text-white p-2 bg-gradient-to-r from-blue-300 to-blue-400"
                onClick={() => this.productModal(product)}
              >
                GET
              </button>
            </Box>
          );
        })}{" "}
        <ViewProducts
          products={this.state.modalOpen}
          isOpen={this.state.productModal}
          isClose={() => {
            this.setState({ productModal: false });
          }}
        />
      </Box>
    );
    // <ImageList row={3} gap={1}>
    //   {this.state.products.map((item) => (
    //     <ImageListItem
    //       className="rounded-md shadow-lg mb-2"
    //       key={item.descrip}
    //       style={{ aspectRatio: 3 / 4, objectFit: "contain" }}
    //     >
    //       <img
    //         src={`${item.uri}`}
    //         srcSet={`${item.uri}`}
    //         alt={item.pName}
    //         style={{ aspectRatio: 3 / 4, objectFit: "contain" }}
    //       />
    //     </ImageListItem>
    //   ))}
    // </ImageList>
  }
}

export default MarketPlace;
