import React, { useEffect, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import googleAuth from "../../content/images/google-authenticator.png";
import TwoFactorSetup from "../../component/TwoFactorSetup";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2/src/sweetalert2.js";
import {
  userDetails,
  userGetData,
  userGetFullDetails,
} from "../../store/slices/AuthSlice";
import jwtAxios from "../../service/jwtAxios";
import { notificationFail, notificationSuccess } from "../../store/slices/notificationSlice";

export const GoogleAuth = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userData = useSelector(userGetFullDetails);
  const [is2FAEnabled, setIs2FAEnabled] = useState(null);
  const [secret, setSecret] = useState("");
  const [qrCodeUrl, setQRCodeUrl] = useState("");
  const dispatch = useDispatch();
  const acAddress = useSelector(userDetails);
  useEffect(() => {
    if (userData) {
      if (userData?.is_2FA_enabled === undefined) {
        setIs2FAEnabled(false);
      } else {
        setIs2FAEnabled(userData?.is_2FA_enabled);
      }
    }
  }, [userData?.is_2FA_enabled]);

  const openModal = async () => {
      await jwtAxios
      .get("users/generate2FASecret")
      .then((res) => {
        setSecret(res.data.secret);
        setQRCodeUrl(`otpauth://totp/ICO-APP?secret=${res.data.secret}`);
        setIsModalOpen(true);
      })
      .catch((err) => {
        if(typeof err == "string")
        {
          dispatch(notificationFail(err));
        }else{
          dispatch(notificationFail(err?.response?.data?.message));
        }
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const disable2FA = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to disable Google 2FA?",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "#808080",
      confirmButtonText: "Disable",
      customClass:{
        popup:"suspend"
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
         await jwtAxios
           .get("/users/disable2FA")
           .then((res) => {
             dispatch(notificationSuccess(res?.data?.message));
             setIs2FAEnabled(false);
             dispatch(userGetData(userGetData.userid)).unwrap();
           })
           .catch((err) => {
             if(typeof err == "string")
             {
               dispatch(notificationFail(err));
             }else{
               dispatch(notificationFail(err?.response?.data?.message));
             }
           });
      }
    });
  };
  return (
    <Card body className="cards-dark two-fa">
      <Card.Title as="h2">2FA</Card.Title>
      <div
        className="ul-button-row"
      >
        <ul className="mb-3">
          <li>
            <div className="two-fa-step">
              <img src={googleAuth} alt="Google Authentication" />
              <h4>Google Authentication</h4>
              {is2FAEnabled === false ? (
                <p>Click to enable Google 2FA Authentication</p>
              ) : (
                <p>You've successfully enabled Google 2FA</p>
              )}
            </div>

            <TwoFactorSetup
              isOpen={isModalOpen}
              onClose={closeModal}
              setIs2FAEnabled={setIs2FAEnabled}
              secret={secret}
              qrCodeUrl={qrCodeUrl}
            />
          </li>
        </ul>
        <div className="button-row">
          {is2FAEnabled === null ? (
            ""
          ) : is2FAEnabled === false ? (
            <Button variant="primary" onClick={openModal}>
              Enable
            </Button>
          ) : (
            <Button variant="danger" onClick={disable2FA}>
              Disable
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default GoogleAuth;
