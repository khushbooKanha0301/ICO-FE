import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthRoute from "./AuthRoute";
import Header from "./component/Header";
import LoginView from "./component/Login";
import Sidebar from "./component/Sidebar";
import TwoFAvalidate from "./component/TwoFAvalidate";
import BuyTokenComponent from "./layout/BuyTokenComponent";
import DashboardComponent from "./layout/DashboardComponent";
import IcoDistributionComponent from "./layout/IcoDistributionComponent";
import ProfileComponent from "./layout/ProfileComponent";
import StakeScallopComponent from "./layout/StakeScallopComponent";
import TransactionComponent from "./layout/TransactionComponent";
import SnackBar from "./snackBar";
import {
  getCountryDetails,
  userDetails,
  userGetData,
} from "./store/slices/AuthSlice";
import { checkCurrentSale} from "./store/slices/currencySlice";
import { database, firebaseMessages } from "./config";
import { onValue, ref } from "firebase/database";

export const App = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const sidebarToggle = () => setIsOpen(!isOpen);
  const [modalShow, setModalShow] = useState(false);
  const modalToggle = () => setModalShow(!modalShow);
  const [isSign, setIsSign] = useState(null);
  const acAddress = useSelector(userDetails);
  const [twoFAModal, setTwoFAModal] = useState(true);
  const [isResponsive, setIsResponsive] = useState(false);
  const [getUser, setGetUser] = useState(null);
  const handleAccountAddress = (address) => {
    setIsSign(false);
  };
  
  useEffect(() => {
    const handleResize = () => {
      // Check if the window width is below a specific breakpoint (e.g., 768px)
      setIsResponsive(window.innerWidth < 768);
    };

    handleResize();
    // Add an event listener to track window size changes
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const signOut = () => {
    setIsSign(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (acAddress?.userid) {
        try {
          const user = await dispatch(userGetData(acAddress.userid)).unwrap();
          setGetUser(user);
          dispatch(getCountryDetails());
          dispatch(checkCurrentSale());
          var childKey = firebaseMessages.ICO_USERS + "/" + acAddress?.userid;
          const setReciverReadCountNode = ref(database, childKey);
          const unsubscribe = onValue(setReciverReadCountNode, (snapshot) => {
            if (snapshot && snapshot.val() && localStorage.getItem("token")) {
              let findUser = snapshot.val();
              if (findUser.is_active === false || findUser.is_delete === true) {
                signOut();
              }
            }
          });

          // Cleanup function to unsubscribe from Firebase listener
          return () => unsubscribe();
        } catch (error) {
          console.error('Failed to fetch user data', error);
        }
      }
    };

    fetchData();
  }, [acAddress?.userid, dispatch]);

  useEffect(() => {
    if (getUser && getUser?.is_2FA_verified === false) {
      setTwoFAModal(true);
    }
  }, [getUser]);
  
  return (
    <>
      <Container fluid="xxl" className={`${isOpen ? "open-sidebar" : ""} p-0`}>
        <ToastContainer />
        <SnackBar />
        <Sidebar
          getUser={getUser}
          clickHandler={sidebarToggle}
          setIsOpen={setIsOpen}
          setModalShow={setModalShow}
          isResponsive={isResponsive}
        />
        <div className="wrapper">
          <Header
            getUser={getUser}
            clickHandler={sidebarToggle}
            clickModalHandler={modalToggle}
            signOut={signOut}
          />
          <div className="contain">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <DashboardComponent getUser={getUser}/>
                    {twoFAModal === true &&
                      getUser && getUser?.is_2FA_verified === false && (
                        <TwoFAvalidate setTwoFAModal={setTwoFAModal} getUser={getUser} setGetUser={setGetUser}/>
                      )}
                  </>
                }
              />
              <Route
                path="/buy-token"
                element={
                  <>
                    <BuyTokenComponent />
                    {twoFAModal === true &&
                      getUser && getUser?.is_2FA_verified === false && (
                        <TwoFAvalidate setTwoFAModal={setTwoFAModal} getUser={getUser} setGetUser={setGetUser}/>
                      )}
                  </>
                }
              />
              <Route
                path="/ico-distribution"
                element={
                  <>
                    <IcoDistributionComponent />
                    {twoFAModal === true &&
                      getUser && getUser?.is_2FA_verified === false && (
                        <TwoFAvalidate setTwoFAModal={setTwoFAModal} getUser={getUser} setGetUser={setGetUser}/>
                      )}
                  </>
                }
              />
              <Route
                path="/staking"
                element={
                  <>
                    <StakeScallopComponent />
                    {twoFAModal === true &&
                      getUser && getUser?.is_2FA_verified === false && (
                        <TwoFAvalidate setTwoFAModal={setTwoFAModal} getUser={getUser} setGetUser={setGetUser}/>
                      )}
                  </>
                }
              />
              <Route
                path="/transaction"
                element={
                  <>
                    <AuthRoute>
                      <TransactionComponent />
                    </AuthRoute>
                  </>
                }
              />
              <Route
                path="/profile"
                element={
                  <>
                    <AuthRoute>
                      <ProfileComponent />
                    </AuthRoute>
                  </>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Container>
      <LoginView
        setGetUser={setGetUser}
        show={modalShow}
        onHide={() => setModalShow(false)}
        handleaccountaddress={handleAccountAddress}
        issign={isSign}
        settwofamodal={setTwoFAModal}
      />
    </>
  );
};

export default App;
