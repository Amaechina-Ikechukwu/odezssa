import { Avatar, Box } from "@mui/material";
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
import { motion } from "framer-motion";
import { app } from "../../../firebase";

import CircularProgress from "@mui/material/CircularProgress";
import ViewProducts from "../../products/ViewProducts";

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

  productModal = (e) => {
    this.setState({ productModal: true, modalOpen: e });
  };

  srcset = (image, width, height, rows = 1, cols = 1) => {
    return {
      src: `${image}?auto=format`,
      srcSet: `${image}?&auto=format&dpr=2 2x`,
    };
  };

  render() {
    const setSize = [1, 2];
    function get_random(list) {
      return list[Math.floor(Math.random() * list.length)];
    }

    const products = this.props.products;

    if (products === undefined || products === []) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          Loading...
        </div>
      );
    } else {
      return (
        <Box sx={{ width: 1 }}>
          <Box>Explore</Box>
          <Box
            display="grid"
            className="p-1"
            gridTemplateColumns="repeat(3, 1fr)"
            gap={1}
          >
            {products.map((item, index) => (
              <Box
                key={`${Math.random().toString(36).substring(2, 9)}odezssa`}
                onClick={() => this.productModal(item)}
                className=" max-h-max min-h-min  rounded-md p-2 bg-white shadow-md "
                sx={{
                  backgroundImage: `url(${item.uri})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  height: { xs: "30vh", sm: "40vh", md: "45vh", lg: "50vh" },
                }}
                gridColumn={`span ${get_random(setSize)}`}
              ></Box>
            ))}
          </Box>
          <ViewProducts
            products={this.state.modalOpen}
            isOpen={this.state.productModal}
            isClose={() => {
              this.setState({ productModal: false });
            }}
          />
        </Box>
      );
    }
  }
}

export default MarketPlace;
