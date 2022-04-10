import { PlusIcon, SearchIcon } from "@heroicons/react/outline";
import { Box, InputAdornment, TextField } from "@mui/material";
import React, { Component } from "react";
import MarketPlace from "./MarketPlace";
import OpenMarket from "./OpenMarket";

export class Market extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      user: {},
      curs: {},
    };
  }
  componentDidMount() {
    this.getCur();
  }
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

  render() {
    return (
      <div className="w-full h-full">
        <Box>
          <Box className=" w-full flex justify-between items-center p-3 ">
            <TextField
              style={{ width: "60%", borderRadius: "100" }}
              variant="outlined"
              size="small"
              label="Search for stores, products ..."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon style={{ width: 20, height: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <button
              onClick={() => {
                this.setState({ open: true });
              }}
            >
              <PlusIcon
                style={{ width: 30, height: 30 }}
                className="text-gray-500"
              />
            </button>
          </Box>
          <MarketPlace />
        </Box>
        <OpenMarket
          sopen={this.state.open}
          sclose={() => {
            this.setState({ open: false });
          }}
          cury={this.state.curs}
        />
      </div>
    );
  }
}

export default Market;
