import { useNavigate, useLocation } from "react-router-dom";
import VisitProfile from "../products/VisitProfile";
import Menu from "./Menu";

export default function Hook(props) {
  const location = useLocation();

  return <VisitProfile {...props} location={location} />;
}
