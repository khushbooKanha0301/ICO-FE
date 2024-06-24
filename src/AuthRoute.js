import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { userDetails , userGetData} from "./store/slices/AuthSlice";

const AuthRoute = ({ children }) => {
  const dispatch = useDispatch();
  const userData = useSelector(userDetails);
  const [getUser, setGetUser] = useState(null);
  const authed = userData.authToken;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await dispatch(userGetData()).unwrap();
        setGetUser(user);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setGetUser(null); // Handle error case
      }
    };
    fetchUserDetails();
  }, []);

  if (!authed || (getUser && getUser.is_2FA_verified === false)) {
    return <Navigate to={"/"} />;
  }

  if (authed && (!getUser || getUser.is_2FA_verified === true || getUser.is_2FA_verified === undefined)) {
    return children;
  }

  return null;
};

export default AuthRoute;
