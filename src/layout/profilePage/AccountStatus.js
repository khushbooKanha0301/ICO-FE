import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import KYCVerification from "../../component/KYCVerification";
import { SimpleCheckIcon, CloseIcon } from "../../component/SVGIcon";
import {
  userDetails,
  userGetData,
  userGetFullDetails,
} from "../../store/slices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { hideAddress } from "../../utils";
import jwtAxios from "../../service/jwtAxios";
import { notificationFail } from "../../store/slices/notificationSlice";

export const AccountStatus = () => {
  const acAddress = useSelector(userDetails);
  const dispatch = useDispatch();
  useEffect(() => {
    if (acAddress?.userid) {
      dispatch(userGetData(acAddress.userid)).unwrap();
    }
  }, [acAddress?.userid]);
  const [modalShow, setModalShow] = useState(false);
  const [kycSubmitted,setKYCSubmitted]= useState(false);
  // const modalToggle = () => setModalShow(!modalShow);
  const modalToggle = async () => {
    await jwtAxios
      .get(`/users/getuser`)
      .then((response) => {
        if (
          (response.data?.User?.kyc_completed === true &&
            response.data?.User?.is_verified === 2) ||
          response.data?.User?.kyc_completed === false
        ) {
          setModalShow(!modalShow);
        } else {
          dispatch(notificationFail("KYC already Submitted"));
        }
      })
      .catch((error) => {
        dispatch(notificationFail("Something went wrong with get user"));
      });
  };
  const userDetailsAll = useSelector(userGetFullDetails);
  return (
    <Row>
      <Col xl="12" lg="6">
        <Card body className="cards-dark your-account-status">
          <Card.Title as="h2">Your Account Status</Card.Title>
          <div className="btns-Verified">
            <Badge bg="success">
              Email Verified{" "}
              <span className="verify-status">
                <SimpleCheckIcon width="10" height="8" />
              </span>
            </Badge>
            {(userDetailsAll?.is_verified === 0 || kycSubmitted === true) && (
              <Badge bg="info" className="kyc-status">
                Submit KYC{" "}
              </Badge>
            )}
            {(userDetailsAll?.is_verified === 1 && kycSubmitted === false) && (
              <Badge bg="info" className="kyc-status">
                KYC Verified{" "}
                <span className="verify-status">
                  <SimpleCheckIcon width="10" height="8" />
                </span>
              </Badge>
            )}
            {(userDetailsAll?.is_verified === 2 && kycSubmitted === false ) && (
              <>
                <Badge bg="danger" className="kyc-status">
                  KYC Rejected{" "}
                  <span className="verify-status">
                    <CloseIcon width="30" height="30" />
                  </span>
                </Badge>
              </>
            )}
          </div>
          <h4 className="mb-3">Receiving Wallet</h4>
          <h4>
            {acAddress && <span>{hideAddress(acAddress?.account, 5)}</span>}{" "}
            <Link to="#/">EDIT</Link>
          </h4>
        </Card>
      </Col>
      <Col xl="12" lg="6">
        <Card body className="cards-dark kyc-verification">
          <Card.Title as="h2">Identity Verification - KYC</Card.Title>
          <Card.Text>
            To comply with regulation, participant will have to go through
            identity verification.
            <br />
            <br />
            You have not submitted your documents to verify your identity (KYC).
          </Card.Text>

          {(userDetailsAll?.kyc_completed === true || kycSubmitted === true) &&
            ((userDetailsAll?.is_verified === 1 && kycSubmitted === false) ? (
              <Button variant="success" disabled>
                Your KYC Details has been approved
              </Button>
            ) : (userDetailsAll?.is_verified === 2 && kycSubmitted === false) ? (
              <Button variant="primary" onClick={modalToggle}>
                Click to Proceed
              </Button>
            ) : (userDetailsAll?.is_verified === 0 || kycSubmitted === true) ? (
              <Button variant="warning" disabled>
                Your KYC Details is Under Review
              </Button>
            ) : null)}
          {(userDetailsAll?.kyc_completed === false && kycSubmitted === false) && (
            <Button variant="primary" onClick={modalToggle}>
              Click to Proceed
            </Button>
          )}
        </Card>
      </Col>
      <KYCVerification
        show={
          ((userDetailsAll?.kyc_completed === true &&
            userDetailsAll?.is_verified === 2) ||
            userDetailsAll?.kyc_completed === false) &&
          modalShow
        }
        onHide={() => setModalShow(false)}
        setkycsubmitted={setKYCSubmitted}
      />
    </Row>
  );
};

export default AccountStatus;
