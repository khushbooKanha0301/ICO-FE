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
  userGetFullDetails,
} from "./store/slices/AuthSlice";
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
  const userData = useSelector(userGetFullDetails);
  const [twoFAModal, setTwoFAModal] = useState(true);
  const [isResponsive, setIsResponsive] = useState(false);

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
    if (acAddress?.userid) {
      dispatch(userGetData(acAddress.userid)).unwrap();
      dispatch(getCountryDetails());
      var childKey = firebaseMessages.ICO_USERS + "/" + acAddress?.userid;
      const setReciverReadCountNode = ref(database, childKey);
      onValue(setReciverReadCountNode, (snapshot) => {
        if (snapshot && snapshot.val() && localStorage.getItem("token")) {
          let findUser = snapshot.val();
          if (findUser.is_active === false || findUser.is_delete === true) {
            signOut();
          }
        }
      });
    }
  }, [acAddress?.userid]);

  useEffect(() => {
    if (userData?.is_2FA_login_verified === false) {
      setTwoFAModal(true);
    }
  }, [userData]);
  
  return (
    <>
      <Container fluid="xxl" className={`${isOpen ? "open-sidebar" : ""} p-0`}>
        <ToastContainer />
        <SnackBar />
        <Sidebar
          clickHandler={sidebarToggle}
          setIsOpen={setIsOpen}
          setModalShow={setModalShow}
          isResponsive={isResponsive}
        />
        <div className="wrapper">
          <Header
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
                    <DashboardComponent />
                    {twoFAModal === true &&
                      userData?.is_2FA_login_verified === false && (
                        <TwoFAvalidate setTwoFAModal={setTwoFAModal} />
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
                      userData?.is_2FA_login_verified === false && (
                        <TwoFAvalidate setTwoFAModal={setTwoFAModal} />
                      )}
                  </>
                  // <AuthRoute setModalShow={setModalShow}>
                  // </AuthRoute>
                }
              />
              <Route
                path="/ico-distribution"
                element={
                  // <AuthRoute>

                  // </AuthRoute>
                  <>
                    <IcoDistributionComponent />
                    {twoFAModal === true &&
                      userData?.is_2FA_login_verified === false && (
                        <TwoFAvalidate setTwoFAModal={setTwoFAModal} />
                      )}
                  </>
                }
              />
              <Route
                path="/staking"
                element={
                  // <AuthRoute>
                  // </AuthRoute>
                  <>
                    <StakeScallopComponent />
                    {twoFAModal === true &&
                      userData?.is_2FA_login_verified === false && (
                        <TwoFAvalidate setTwoFAModal={setTwoFAModal} />
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
