import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import PaymentProcess from "../../component/PaymentProcess";
import TokenSaleProgress from "../../component/TokenSaleProgress";
import {
  convertToCrypto,
  getGBPCurrency,
  getAUDCurrency,
  getUSDCurrency,
  getEURCurrency,
  resetCryptoAmount,
  getTotalMid,
  getTokenCount,
  resetRaisedMid,
  resetTokenData,
} from "../../store/slices/currencySlice";
import { notificationFail } from "../../store/slices/notificationSlice";
import TokenBalanceProgress from "../../component/TokenBalanceProgress";
import { formattedNumber } from "../../utils";
import { useLocation } from "react-router-dom";
import { userDetails } from "../../store/slices/AuthSlice";
import LoginView from "../../component/Login";

export const BuyTokenPage = () => {
  const location = useLocation();
  const [modalShow, setModalShow] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const acAddress = useSelector(userDetails);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(0);
  const {
    eurCurrency,
    audCurrency,
    gbpCurrency,
    usdCurrency,
    cryptoAmount,
    raisedMid,
    balanceMid,
  } = useSelector((state) => state?.currenyReducer);
  const [readyForPayment, setReadyForPayment] = useState(true);
  const [modalLoginShow, setLoginModalShow] = useState(false);
  const modalLoginToggle = () => setLoginModalShow(!modalLoginShow);
  const [isSign, setIsSign] = useState(null);
  const MAX_MID = 14000000;
  const remainingBalance =
    balanceMid !== null ? formattedNumber(MAX_MID - balanceMid) : 0;

  const handleAccountAddress = () => {
    setIsSign(false);
  };

  useEffect(() => {
    let authToken = acAddress.authToken ? acAddress.authToken : null;
    if (authToken) {
      dispatch(getTotalMid()).unwrap();
      dispatch(getTokenCount()).unwrap();
    } else {
      dispatch(resetRaisedMid());
      dispatch(resetTokenData());
    }
  }, [dispatch, acAddress.authToken]);

  useEffect(() => {
    const authToken = acAddress.authToken ? acAddress.authToken : null;
    if (authToken) {
      if (cryptoAmount && cryptoAmount?.amount > remainingBalance) {
        setReadyForPayment(true);
        dispatch(notificationFail("Please Enter Correct Amount"));
      }
    }
  }, [cryptoAmount, remainingBalance, acAddress.authToken]);

  const modalToggle = () => {
    const authToken = acAddress.authToken ? acAddress.authToken : null;
    if (authToken) {
      if (selectedCrypto && Number(amount)) {
        if (cryptoAmount && cryptoAmount?.amount > remainingBalance) {
          setReadyForPayment(true);
          dispatch(notificationFail("Please Enter Correct Amount"));
          return false;
        } else {
          setReadyForPayment(false);
          setModalShow(!modalShow);
        }
      } else {
        if (selectedCrypto && !Number(amount)) {
          setReadyForPayment(true);
          dispatch(notificationFail("Please Select Crypto Amount"));
        } else if (!selectedCrypto && Number(amount)) {
          dispatch(notificationFail("Please Select Crypto Currency"));
        } else {
          setReadyForPayment(true);
          dispatch(
            notificationFail("Please Select Crypto Currency and Crypto Amount")
          );
        }
      }
    } else {
      setReadyForPayment(false);
      setLoginModalShow(true);
    }
  };

  useEffect(() => {
    dispatch(getEURCurrency());
    dispatch(getAUDCurrency());
    dispatch(getGBPCurrency());
    dispatch(getUSDCurrency());
    dispatch(resetCryptoAmount());
  }, []);

  const handleChangeAmount = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (selectedCrypto) {
      setAmount(value);

      const usdAmount = value;
      const data = {
        usdAmount: usdAmount,
        cryptoSymbol: selectedCrypto,
      };
      onChangeAmount(data);

      if (value) {
        if (value > 0) {
          setReadyForPayment(false);
        } else {
          setReadyForPayment(true);
          dispatch(notificationFail("Please Enter Correct Amount"));
        }
      } else {
        setReadyForPayment(true);
      }
    }
  };

  const onChangeAmount = useCallback(
    debounce((data) => {
      dispatch(convertToCrypto(data));
    }, 500),
    []
  );

  const handledAmountFocus = () => {
    if (!selectedCrypto) {
      setReadyForPayment(true);
      dispatch(notificationFail("Please Select Crypto Currency"));
    }
  };

  const handleSelectedCrypto = (e) => {
    setSelectedCrypto(e);
    const data = {
      usdAmount: amount,
      cryptoSymbol: e,
    };
    dispatch(convertToCrypto(data));
  };

  function handleChildMessage(event) {
    if (event.data === "updateURL") {
      setSuccessModal(true);
      dispatch(resetCryptoAmount());
      setAmount(0);
      setSelectedCrypto("");
      dispatch(getTotalMid()).unwrap();
      dispatch(getTokenCount()).unwrap();
    }
    if (event.data === "cancleURL") {
      setCancelModal(true);
      dispatch(resetCryptoAmount());
      setAmount(0);
      setSelectedCrypto("");
    }
  }

  useEffect(() => {
    window.addEventListener("message", handleChildMessage, false);
    if (location.search?.includes("success=true")) {
      window.close();
      if (window.opener) {
        window.opener.postMessage("updateURL", "*");
      }
    }
    if (location.search?.includes("success=false")) {
      window.close();
      if (window.opener) {
        window.opener.postMessage("cancleURL", "*");
      }
    }
  }, [location]);

  const closeModal = () => {
    setSuccessModal(false);
    setCancelModal(false);
  };

  const handleOptionClick = (crypto) => {
    setSelectedCrypto(crypto === selectedCrypto ? null : crypto);
  };

  return (
    <div className="buy-token-view">
      <Row>
        <Col xl="8">
          <Card body className="cards-dark choose-currency">
            <Card.Title as="h4">
              Choose currency and calculate token price
            </Card.Title>
            <Card.Text>
              You can buy our token using the below currency choices to become
              part of our project.
            </Card.Text>
            <Row>
              <>
                <Form.Group controlId="selectedCrypto">
                  <Row>
                    <Col md="6">
                      <div
                        className="form-check"
                        onClick={() => handleSelectedCrypto("USD")}
                      >
                        <div
                          className={`form-check-input ${
                            selectedCrypto === "USD" ? "checked" : ""
                          }`}
                        />
                        <label class="form-check-label">
                          <>
                            <div className="radio-label">USD</div>
                            <div className="currency-info">
                              <div className="currency-type">
                                <span className="currency-flag">
                                  <img
                                    className="currency-flag"
                                    src={require("../../content/images/usd-icon-resized.png")}
                                    alt="Bitcoin"
                                  />
                                </span>
                                USD
                              </div>
                              <div className="currency-amount">
                                {usdCurrency} USD
                              </div>
                            </div>
                          </>
                        </label>
                      </div>
                    </Col>
                    <Col md="6">
                      <div
                        className="form-check"
                        onClick={() => handleSelectedCrypto("GBP")}
                      >
                        <div
                          className={`form-check-input ${
                            selectedCrypto === "GBP" ? "checked" : ""
                          }`}
                        />
                        <label class="form-check-label">
                          <>
                            <div className="radio-label">GBP</div>
                            <div className="currency-info">
                              <div className="currency-type">
                                <span className="currency-flag">
                                  <img
                                    className="currency-flag"
                                    src={require("../../content/images/gbp-icon-resized.png")}
                                    alt="Bitcoin"
                                  />
                                </span>
                                GBP
                              </div>
                              <div className="currency-amount">
                                {gbpCurrency} USD
                              </div>
                            </div>
                          </>
                        </label>
                      </div>
                    </Col>
                    <Col md="6">
                      <div
                        className="form-check"
                        onClick={() => handleSelectedCrypto("EUR")}
                      >
                        <div
                          className={`form-check-input ${
                            selectedCrypto === "EUR" ? "checked" : ""
                          }`}
                        />
                        <label class="form-check-label">
                          <>
                            <div className="radio-label">EUR</div>
                            <div className="currency-info">
                              <div className="currency-type">
                                <span className="currency-flag">
                                  <img
                                    className="currency-flag"
                                    src={require("../../content/images/eur-icon.png")}
                                    alt="Bitcoin"
                                  />
                                </span>
                                EUR
                              </div>
                              <div className="currency-amount">
                                {eurCurrency} USD
                              </div>
                            </div>
                          </>
                        </label>
                      </div>
                    </Col>
                    <Col md="6">
                      <div
                        className="form-check"
                        onClick={() => handleSelectedCrypto("AUD")}
                      >
                        <div
                          className={`form-check-input ${
                            selectedCrypto === "AUD" ? "checked" : ""
                          }`}
                        />
                        <label class="form-check-label">
                          <>
                            <div className="radio-label">AUD</div>
                            <div className="currency-info">
                              <div className="currency-type">
                                <span className="currency-flag">
                                  <img
                                    className="currency-flag"
                                    src={require("../../content/images/aud-icon.png")}
                                    alt="Bitcoin"
                                  />
                                </span>
                                AUD
                              </div>
                              <div className="currency-amount">
                                {audCurrency} USD
                              </div>
                            </div>
                          </>
                        </label>
                      </div>
                    </Col>
                  </Row>
                </Form.Group>
              </>
            </Row>
            <Card.Title as="h4" className="card-subtitle">
              Amount of contribute
            </Card.Title>
            <Card.Text>
              Enter the amount you would like to contribute in order to
              calculate the amount of tokens you will receive. The calculator
              below helps to convert the required quantity of tokens into the
              amount of your selected currency.
            </Card.Text>
            <Row>
              <Col md="6">
                <div className="form-check">
                  <label class="form-check-label">
                    <>
                      <div className="radio-label">Input Amount</div>
                      <div className="currency-info">
                        <div className="currency-type">
                          <Form.Control
                            type="text"
                            placeholder="Enter Amount"
                            onChange={(e) => handleChangeAmount(e)}
                            onFocus={handledAmountFocus}
                            value={amount}
                            // disabled={!selectedCrypto}
                          />
                        </div>
                        <div className="currency-amount">{selectedCrypto}</div>
                      </div>
                    </>
                  </label>
                </div>
              </Col>
              <Col md="6">
                <div className="form-check">
                  <label class="form-check-label">
                    <>
                      <div className="radio-label">Rate</div>
                      {!cryptoAmount?.amount ? (
                        <>
                          <div className="currency-info">
                            <div className="currency-type">0</div>
                            <div className="currency-amount">MID</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="currency-info">
                            <div className="currency-type">
                              {cryptoAmount?.amount
                                ? cryptoAmount?.amount
                                : "0"}
                            </div>
                            <div className="currency-amount">MID</div>
                          </div>
                        </>
                      )}
                    </>
                  </label>
                </div>
              </Col>
            </Row>
            <Card.Text>
              1.952 USD (10 Ico ) Minimum contribution amount is required.
            </Card.Text>
            <Card.Title as="h4" className="mt-4">
              Payment Information
            </Card.Title>
            <div className="payment-info">
              <div className="d-flex justify-content-between align-items-center">
                <div className="payment-label">+ Sale bonus 0 %</div>
                <div className="payment-amount">0</div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="payment-label">+ Amount Bonus</div>
                <div className="payment-amount">0</div>
              </div>
              <div className="d-flex justify-content-between align-items-center border-top">
                <div className="payment-label fw-bold">
                  Total {selectedCrypto}
                </div>
                <div className="payment-amount">{amount}</div>
              </div>
            </div>
            <Card.Text className="text-danger">
              Your contribution will be calculated based on exchange rate at the
              moment when your transaction is confirmed.
            </Card.Text>
            <Button
              variant="primary"
              onClick={modalToggle}
              disabled={readyForPayment}
            >
              Make Payment
            </Button>
            <Card.Text className="mb-0">
              Tokens will appear in your account after payment successfully made
              and approved by our team. Please note that, SSS token will be
              distributed after the token sales end-date.
            </Card.Text>
          </Card>
        </Col>
        <Col xl="4">
          <Row>
            <Col xl="12" lg="6">
              <div className="top-green-card">
                <Card body className="green-card">
                  <TokenBalanceProgress />
                </Card>
              </div>
            </Col>
            <Col xl="12" lg="6">
              <Card
                body
                className="cards-dark token-sale-card by-token-salesCard"
              >
                <Card.Title as="h4">Token Sale Progress</Card.Title>
                <TokenSaleProgress />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <PaymentProcess
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedCrypto={selectedCrypto}
        amount={amount}
        cryptoAmount={cryptoAmount?.amount}
        successModal={successModal}
        cancelModal={cancelModal}
        closeModal={closeModal}
      />
      {modalLoginShow && (
        <LoginView
          show={modalLoginShow}
          onHide={() => setLoginModalShow(false)}
          handleaccountaddress={handleAccountAddress}
          issign={isSign}
        />
      )}
    </div>
  );
};

export default BuyTokenPage;
