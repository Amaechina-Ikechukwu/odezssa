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
import { PRODUCTS_STATE_CHANGE } from "../constants/index";
import { app } from "../../firebase";

export function fetchProducts() {
  return (dispatch) => {
    const db = getFirestore(app);
    const q = query(collection(db, "products"));
    let list = [];
    const unsubcribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let products = [];
        products = doc.data();
        list.push(products);
        dispatch({
          type: PRODUCTS_STATE_CHANGE,
          currentProducts: list,
        });
      });
    });
  };
}
