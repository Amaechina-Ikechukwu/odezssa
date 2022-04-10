import React from "react";
import { useLocation } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";
import { app } from "../../firebase";

function VisitProfile() {
  const location = useLocation();
  console.log(location.state.id);
  const uid = location.state.id;

  const [products, setproducts] = React.useState([]);

  const getStore = () => {
    const db = getFirestore(app);
    const q = query(collection(db, "products"));
    let list = [];
    const unsubcribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let products = {};
        products = doc.data();
        if (products.id === uid) {
          list.push(products);
        }
      });
      console.log(list);
      setproducts(list);
    });
  };

  React.useEffect(() => {
    getStore();
  }, [getStore]);
  return <div>hey</div>;
}

export default VisitProfile;
