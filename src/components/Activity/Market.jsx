import { PlusIcon, SearchIcon } from "@heroicons/react/outline";
import {
  Avatar,
  Box,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import React, { Component } from "react";
import MarketPlace from "../pages/Homepages/MarketPlace";
import OpenMarket from "./OpenMarket";

import {
  collection,
  query,
  where,
  onSnapshot,
  getFirestore,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { app } from "../../firebase";
import Popover from "@mui/material/Popover";
import ViewProducts from "../products/ViewProducts";
import CircularProgress from "@mui/material/CircularProgress";

export class Market extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      user: {},
      curs: {},
      results: [],
      search: "",
      anchorEl: null,
      productModal: false,
      modalOpen: {},
      err: "",
      filter: "description",
      load: true,
      products: [],
    };
  }
  componentDidMount() {
    this.getCur();
    this.getStore();
    // this.props.fetchProducts();
  }

  getStore = async () => {
    const db = getFirestore(app);
    const q = query(collection(db, "products"));
    let list = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let products = {};
      products = doc.data();
      if (this.state.products.length > 0) {
        this.setState({ products: [] });
      }
      list.push(products);
    });
    this.setState({ products: list, open: false });
  };
  id = "";
  getCur = () => {
    fetch(
      "https://currencyapi.net/api/v1/currencies?key=LGMmKRJO3YLoA7snfkD6O41jBuaTvf8wjHHl&output=JSON"
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        var recy = data.currencies;
        this.setState({ curs: data.currencies });
      })
      .catch((err) => {
        console.log(`currency error : ${err}`);
      });
  };

  check = (e) => {
    this.setState({ results: [], load: true });
    this.search(e);
  };

  search = async (e) => {
    this.setState({ load: true });
    const db = getFirestore(app);
    const q = query(collection(db, "products"));
    let list = [];
    let results = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let products = {};
      products = doc.data();

      list.push(products);
    });
    switch (e) {
      case undefined:
        list.map((x) => {
          if (x.descrip.includes(this.state.search)) {
            this.state.results.push(x);
            this.setState({ load: false });
          } else {
            this.setState({ err: "Not found", load: false });
          }
        });
        break;
      case "description":
        list.map((x) => {
          if (x.descrip.includes(this.state.search)) {
            this.state.results.push(x);
            this.setState({ load: false });
          } else {
            this.setState({ err: "Not found", load: false });
          }
        });
        break;
      case "name":
        list.map((x) => {
          if (x.pName.includes(this.state.search)) {
            this.state.results.push(x);
            this.setState({ load: false });
          } else {
            this.setState({ err: "Not found", load: false });
          }
        });
        break;
      case "seller":
        list.map((x) => {
          if (x.uName.includes(this.state.search)) {
            this.state.results.push(x);
            this.setState({ load: false });
          } else {
            this.setState({ err: "Not found", load: false });
          }
        });
        break;
      case "category":
        list.map((x) => {
          if (x.catergory.includes(this.state.search)) {
            this.state.results.push(x);
            this.setState({ load: false });
          } else {
            this.setState({ err: "Not found", load: false });
          }
        });
        break;
    }
    // list.map((x) => {
    //   if (x.descrip.includes(this.state.search)) {
    //     this.state.results.push(x);
    //   } else {
    //     this.setState({ err: "Not found" });
    //   }
    // });
    console.log(this.state.results);
    this.handleClick();
  };

  handleClick = () => {
    this.setState({ anchorEl: true });
  };

  handleClose = () => {
    this.setState({ anchorEl: null, results: [], load: true });
  };
  productModal = (e) => {
    this.setState({ productModal: true, modalOpen: e });
  };

  render() {
    const open = Boolean(this.state.anchorEl);
    const id = open ? "simple-popover" : undefined;
    return (
      <div className="w-full h-full">
        <Box>
          <Box className=" w-full flex justify-between items-center p-3 ">
            <div className=" w-full    ">
              <TextField
                sx={{
                  borderRadius: "100px",
                  width: { xs: "60vw", sm: "65vw", md: "70vw", lg: "65vw" },
                }}
                variant="outlined"
                size="small"
                label="Search for stores, products ..."
                onChange={(e) => this.setState({ search: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {
                        <button onClick={() => this.search()}>
                          <SearchIcon style={{ width: 20, height: 20 }} />
                        </button>
                      }
                    </InputAdornment>
                  ),
                }}
              />

              <div className="w-full">
                <Popover
                  id={id}
                  open={open}
                  anchorEl={this.state.anchorEl}
                  onClose={this.handleClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  className="w-full p-2"
                >
                  {this.state.load === true ? (
                    <CircularProgress />
                  ) : (
                    <div className="flex justify-between items-center">
                      {this.state.results.length === 0 ? (
                        <p className="w-full p-2">Not Found</p>
                      ) : (
                        <p className=" p-2">
                          Search results {this.state.results.length}
                        </p>
                      )}

                      <div className="p-2 flex gap-2 items-center">
                        <Box>Filter</Box>
                        <TextField
                          id="standard-select-currency"
                          select
                          value={this.state.excur}
                          onChange={(e) => this.check(e.target.value)}
                          className="w-4/5 lg:2/5"
                        >
                          <MenuItem value={"description"}>Description</MenuItem>
                          <MenuItem value={"name"}>Name</MenuItem>
                          <MenuItem value={"category"}>Category</MenuItem>
                          <MenuItem value={"seller"}>Seller</MenuItem>
                        </TextField>
                      </div>
                    </div>
                  )}

                  {this.state.results.map((x) => (
                    <div
                      onClick={() => this.productModal(x)}
                      className="flex w-full items-center justify-between p-2 bg-slate-100 mb-2 "
                    >
                      <div className="flex items-center">
                        <img
                          src={x.uri}
                          style={{
                            height: "100px",
                            width: "100px",
                            objectFit: "cover",
                          }}
                          className="rounded-md"
                        />
                        <div className="ml-2">
                          <p>Name: {x.pName}</p>
                          <p>Category: {x.catergory} </p>
                        </div>
                      </div>

                      <div className="flex flex-col ">
                        <div className="flex justify-end">
                          <Avatar src={x.uPhoto} size="small" />
                        </div>
                        <p>{x.uName} </p>
                      </div>
                    </div>
                  ))}
                </Popover>
              </div>
            </div>
            <div>
              <button
                className="flex flex-col justify-center "
                onClick={() => {
                  this.setState({ open: true });
                }}
              >
                <PlusIcon
                  style={{ width: 30, height: 30 }}
                  className="text-gray-500 hover:text-blue-400"
                />
                <p className="text-gray-400 ">Sell</p>
              </button>
            </div>
          </Box>
          <MarketPlace products={this.state.products} />
        </Box>
        <OpenMarket
          sopen={this.state.open}
          sclose={() => {
            this.setState({ open: false });
          }}
          cury={this.state.curs}
          call={this.getStore}
        />
        <ViewProducts
          products={this.state.modalOpen}
          isOpen={this.state.productModal}
          isClose={() => {
            this.setState({ productModal: false });
          }}
        />
      </div>
    );
  }
}

export default Market;
