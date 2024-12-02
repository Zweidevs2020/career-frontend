import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../utils/LocalStorage";
const PrivateRoute = ({ children, restricted = false }) => {
  if (getToken() && restricted) {
    console.log("getToken() && restricted", getToken(), restricted);
    return <Navigate to="/checkout" />;
  }
  return getToken() ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
