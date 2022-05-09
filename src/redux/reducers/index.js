import { combineReducers } from "redux";
import { products } from "./products";

const Reducers = combineReducers({
  productsState: products,
});

export default Reducers;
