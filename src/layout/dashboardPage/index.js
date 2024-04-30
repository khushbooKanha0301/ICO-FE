import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircleIcon,
  CloseIcon,
  ExclamationIcon,
  SimpleCheckIcon,
} from "../../component/SVGIcon";
import TokenSale from "../../component/TokenSale";
import TokenSaleProgress from "../../component/TokenSaleProgress";
import { userGetData, userGetFullDetails } from "../../store/slices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  getTokenCount,
  getTotalMid,
  resetRaisedMid,
  resetTokenData,
} from "../../store/slices/currencySlice";
import { userDetails } from "../../store/slices/AuthSlice";
import { formattedNumber, getDateFormate, hideAddress } from "../../utils";
import jwtAxios from "../../service/jwtAxios";
import TokenBalanceProgress from "../../component/TokenBalanceProgress";

export const DashboardPage = () => {
  const [transactions, setTransactions] = useState(null);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const dispatch = useDispatch();
  const acAddress = useSelector(userDetails);
  const userDetailsAll = useSelector(userGetFullDetails);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const referrance = queryParams.get("ref");
  
  useEffect(() => {
    const getDashboardData = async () => {
      await dispatch(getTotalMid()).unwrap();
      let authToken = acAddress.authToken ? acAddress.authToken : null;
      if (
        authToken &&
        userDetailsAll &&
        userDetailsAll?.is_2FA_login_verified === true && (acAddress.account == userDetailsAll.wallet_address)
      ) {
        dispatch(getTokenCount()).unwrap();
        dispatch(userGetData(acAddress.userid)).unwrap();
      } else {
        dispatch(resetRaisedMid());
        dispatch(resetTokenData());
      }
    };
    getDashboardData();
  }, [dispatch, acAddress.authToken, userDetailsAll?.is_2FA_login_verified]);

  const buytokenLink = () => {
    navigate("/buy-token");
  };

  useEffect(() => {
    setTransactions([]);
    setTransactionLoading(true);
    const gettransaction = async () => {
      if (
        acAddress &&
        acAddress?.authToken &&
        userDetailsAll &&
        userDetailsAll?.is_2FA_login_verified === true && (acAddress.account == userDetailsAll.wallet_address)
        ) {
        await jwtAxios
          .post(`/transactions/getTransactions?page=1&pageSize=3`, {})
          .then((res) => {
            setTransactions(res.data?.transactions);
            setTransactionLoading(false);
          })
          .catch((err) => {
            setTransactionLoading(false);
          });
      }
      if(!acAddress?.authToken || (userDetailsAll && userDetailsAll.is_2FA_login_verified === false)){
        setTransactionLoading(false);
      }
    };
    gettransaction();

    // const queryParams = new URLSearchParams(location.search);
    // const referrance = queryParams.get("ref");
    // if (referrance) {
    //   if (!acAddress.authToken) {
    //     window.localStorage.setItem("referred_by", referrance);
    //   }
    //   navigate("/");
    // }
  }, [acAddress?.authToken, userDetailsAll?.is_2FA_login_verified]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = process.env.PUBLIC_URL + "/whitepaper.pdf";
    link.download = "whitepaper.pdf";
    link.click();
  };

  let addressLine = "";
  if(acAddress.account === "Connect Wallet" && userDetailsAll === undefined)
  {
    addressLine = "Connect Wallet";
  }else if(acAddress.account !== "Connect Wallet" && userDetailsAll === undefined)
  {
    addressLine = "";
  }else if(acAddress.account !== "Connect Wallet" && userDetailsAll?.is_2FA_login_verified !== false && (acAddress.account == userDetailsAll?.wallet_address))
  {
    addressLine = hideAddress(acAddress?.account,5);
  }else{
    addressLine = "Connect Wallet";
  }

  useEffect(() => {
    if (acAddress?.account === referrance) {
      navigate("/")
    }
  }, [acAddress]);

  return (
    <>
      <div className="account-status">
        <Row>
          <Col lg="4">
            <div className="top-green-card">
              <Card body className="green-card">
                <TokenBalanceProgress />
              </Card>
            </div>
          </Col>
          <Col lg="8">
            <Card body className="cards-dark">
              <Row>
                <Col lg="3">
                  <h4>Ico Coin</h4>
                  <div className="icoin">1 Usd= 0.49 Mid</div>
                  <p>1 IDR = 0,0067 USD</p>
                  <Button variant="primary" onClick={buytokenLink}>
                    Buy Token Now
                  </Button>
                </Col>
                <Col lg="9">
                  <h4>Your Account Status</h4>
                  <div className="btns-Verified">
                    <Badge bg="success">
                      Email Verified{" "}
                      <span className="verify-status">
                        <SimpleCheckIcon width="10" height="8" />
                      </span>
                    </Badge>
                    {userDetailsAll?.is_verified === 0 &&
                      userDetailsAll?.is_2FA_login_verified === true && (
                        <Badge bg="info" className="kyc-status">
                          Submit KYC{" "}
                        </Badge>
                      )}
                    {userDetailsAll?.is_verified === 1 &&
                      userDetailsAll?.is_2FA_login_verified === true && (
                        <Badge bg="info" className="kyc-status">
                          KYC Verified{" "}
                          <span className="verify-status">
                            <SimpleCheckIcon width="10" height="8" />
                          </span>
                        </Badge>
                      )}
                    {userDetailsAll?.is_verified === 2 &&
                      userDetailsAll?.is_2FA_login_verified === true && (
                        <Badge bg="danger" className="kyc-status">
                          KYC Rejected{" "}
                          <span className="verify-status">
                            <CloseIcon width="30" height="30" />
                          </span>
                        </Badge>
                      )}
                  </div>
                  <h4 className="mb-3">Receiving Wallet</h4>
                  <h4>
                    {acAddress && addressLine != "" && (
                      <span>
                        {addressLine}
                      </span>
                    )}{" "}
                    <Link to="#/">EDIT</Link>
                  </h4>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
      <div className="token-sale">
        <Row>
          <Col lg="8">
            <Card body className="cards-dark token-sale-graph-card">
              <Card.Title as="h4">
                Token Sale Graph <Link to="/transaction">View all</Link>
              </Card.Title>
              <Table responsive>
                <thead>
                  <tr>
                    <th width="110">Token</th>
                    <th width="110">Amount</th>
                    <th width="154">Date</th>
                    <th width="97"></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions?.map((transaction) => (
                      <tr key={transaction._id}>
                        <td>
                          <div style={{display: "flex" , alignItems: "center"}}>
                          {transaction?.status == "paid" && (
                            <CheckCircleIcon width="16" height="16" />
                          )}
                          {(transaction?.status == "canceled" ||
                            transaction?.status == "expired" ||
                            transaction?.status == "invalid") && (
                            <CloseIcon width="16" height="16" />
                          )}
                          {(transaction?.status == "new" ||
                            transaction?.status == "pending") && (
                            <ExclamationIcon width="16" height="16" />
                          )}
                          {formattedNumber(transaction?.token_cryptoAmount)}
                          </div>
                        </td>
                        <td>
                          <p className="text-white mb-1">
                            {formattedNumber(transaction?.price_amount)}{" "}
                            {transaction?.price_currency}
                          </p>
                        </td>
                        <td>{getDateFormate(transaction?.created_at)}</td>
                        <td style={{ textAlign: "right" }}>
                          <Button variant="success">
                            {transaction.source
                              ? transaction.source.charAt(0).toUpperCase() +
                                transaction.source.slice(1)
                              : "Purchase"}
                          </Button>
                        </td>
                      </tr>
                  ))}
                  {(transactions?.length === 0 && transactionLoading === false) && (
                    <tr>
                      <td colSpan={4} style={{ paddingTop: "30px" }}>
                        <p
                          className="text-center"
                          style={{ color: "rgba(255,255,255,0.2)" }}
                        >
                          No History Records
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
          <Col lg="4">
            <Card body className="cards-dark h-100 token-sale-progress-card">
              <Card.Title as="h4">Token Sale Progress</Card.Title>
              <TokenSaleProgress />
            </Card>
          </Col>
        </Row>
      </div>
      <div className="token-sale-graph">
        <Row>
          <Col lg="8">
            <TokenSale />
          </Col>
          <Col lg="4">
            <Card body className="cards-dark ico-coin">
              <Card.Title as="h3">Ico coin</Card.Title>
              <p>You can buy token, go through Buy Token page.</p>
              <Button variant="primary" onClick={handleDownload}>
                Download Whitepaper
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default DashboardPage;
