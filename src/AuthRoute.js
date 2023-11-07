import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { userDetails, userGetFullDetails } from "./store/slices/AuthSlice";
import DashboardComponent from "./layout/DashboardComponent";

const AuthRoute = ({ setModalShow,children }) => {
  const userData = useSelector(userDetails);
  const userAllDetails = useSelector(userGetFullDetails);
  const authed = userData.authToken;
    if(!authed || userAllDetails?.is_2FA_login_verified === false)
    {
      return <Navigate to={"/"} />;
    }
    if(authed && (userAllDetails &&  (userAllDetails?.is_2FA_login_verified === true || userAllDetails?.is_2FA_login_verified === undefined)))
    {
      return children;
    }
};

export default AuthRoute;
