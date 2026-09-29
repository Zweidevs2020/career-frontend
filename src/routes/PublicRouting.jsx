import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../utils/LocalStorage";
import { ACCOUNT_VIEWS, getActiveAccountView } from "../utils/accountView";
const PublicRoute = ({ children, restricted }) => {
  return getToken() && restricted ? (
    <Navigate
      to={
        getActiveAccountView() === ACCOUNT_VIEWS.COUNSELLOR
          ? "/counsellor-Dashboard"
          : "/dashboard"
      }
    />
  ) : (
    children
  );
};

export default PublicRoute;
