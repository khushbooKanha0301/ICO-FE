import { useDispatch, useSelector } from "react-redux";
import { userDetails, userGetFullDetails } from "../store/slices/AuthSlice";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import {
  getTokenCount,
  getTotalMid,
  resetRaisedMid,
  resetTokenData,
} from "../store/slices/currencySlice";
import { formattedNumber } from "../utils";

export const TokenBalanceProgress = () => {
  const dispatch = useDispatch();
  const MAX = 14000000;
  const { raisedMid, tokenData } = useSelector(
    (state) => state?.currenyReducer
  );
  const userData = useSelector(userDetails);
  const userDetailsAll = useSelector(userGetFullDetails);
  let authToken = userData.authToken ? userData.authToken : null;

  return (
    <>
      <div className="token-balance">
        <div className="token-avatar"></div>
        <div>
          <div className="token-text">Token Balance</div>
          <div className="token-amount">
            {authToken &&
            userDetailsAll?.is_2FA_login_verified === true &&
            raisedMid !== null
              ? parseFloat(formattedNumber(MAX - raisedMid)).toLocaleString()
              : 0}
             
            <span>MID</span>
          </div>
        </div>
      </div>
      <h5>Your Contribution</h5>
      <Row>
        <Col>
          <div className="contribution-amount">{tokenData?.gbpCount}</div>
          <div className="contribution-label">
            <img
              className="currency-flag"
              src={require("../content/images/gbp-icon-resized.png")}
              alt="Bitcoin"
              style={{ width: "16px", height: "16px" }}
            />
            GBP
          </div>
        </Col>
        <Col>
          <div className="contribution-amount">{tokenData?.eurCount}</div>
          <div className="contribution-label">
            <img
              className="currency-flag"
              src={require("../content/images/eur-icon.png")}
              alt="Bitcoin"
              style={{ width: "16px", height: "16px" }}
            />
            EUR
          </div>
        </Col>
        <Col>
          <div className="contribution-amount">{tokenData?.audCount}</div>
          <div className="contribution-label">
            <img
              className="currency-flag"
              src={require("../content/images/aud-icon.png")}
              alt="Bitcoin"
              style={{ width: "16px", height: "16px" }}
            />
            AUD
          </div>
        </Col>
      </Row>
    </>
  );
};

export default TokenBalanceProgress;
