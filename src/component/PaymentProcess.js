import React, { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import jwtAxios from "../service/jwtAxios";
import { notificationFail } from "../store/slices/notificationSlice";
import { userGetFullDetails } from "../store/slices/AuthSlice";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getTransactionByOrderId,
  setOrderId,
} from "../store/slices/currencySlice";
export const PaymentProcess = (props) => {
  const selectedCrypto = props?.selectedCrypto;
  const amount = props?.amount;
  let navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const { cryptoAmount, orderId, orderData } = useSelector(
    (state) => state?.currenyReducer
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isTermsSelected, setIsTermsSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentOption, setPaymentOption] = useState("");
  const dispatch = useDispatch();
  const userDetailsAll = useSelector(userGetFullDetails);
  const viewTransaction = () => {
    navigate("/transaction");
  };

  useEffect(() => {
    if (props.show) {
      setIsLoading(true);
      setPaymentOption("");
      setIsTermsSelected(false);
    }
  }, [props.show]);

  const openModal = async () => {
    if (paymentOption === "cryptoCurrency") {
      if (!isTermsSelected) {
        setIsLoading(true);
        dispatch(notificationFail("Please Check Token Sale Term."));
        return false;
      }
      props.onHide();
      setIsTermsSelected(false);
      setPaymentOption("");
      setIsOpen(true);
      try {
        const data = {
          amount: amount,
          crypto_currency: selectedCrypto,
          wallet_address: userDetailsAll?.wallet_address,
          cryptoAmount: props.cryptoAmount,
        };
        await jwtAxios
          .post(`/transactions/createOrder`, data)
          .then((res) => {
            dispatch(setOrderId(res.data?.transaction?.tran_id));

            if (res.data?.transaction?.payment_url) {
              const width = 500;
              const height = 500;
              const left = window.screen.width / 2 - width / 2;
              const top = window.screen.height / 2 - height / 2;
              window.open(
                res.data?.transaction?.payment_url,
                "Payment",
                `width=${width},height=${height},left=${left},top=${top}`
              );
            } else {
              let message = "Something went wrong";
              if (res.data.message) {
                message = res.data.message;
              }
              dispatch(notificationFail(message));
            }
          })
          .catch((err) => {
            if(typeof err == "string")
            {
              dispatch(notificationFail(err));
            }else{
              dispatch(notificationFail(err?.response?.data?.message));
            }
          });
      } catch (error) {
        console.error(error);
      }
    } else {
      dispatch(notificationFail("Please Select Pay with crypto currency."));
    }
  };
  const handlePaymentOption = (e) => {
    setPaymentOption(e?.target?.value);
  };

  const handleTermsChange = (event) => {
    setIsTermsSelected(event.target.checked);
    if (event.target.checked === true && paymentOption === "cryptoCurrency") {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  };
  useEffect(() => {
    if (orderId && (props?.successModal || props?.cancelModal)) {
      dispatch(getTransactionByOrderId(orderId));
    }
  }, [orderId, props?.successModal, props?.cancelModal]);
  const checkOptions = (option) => {
    if (option !== "cryptoCurrency") {
      setIsLoading(true);
      dispatch(notificationFail("Please Select Pay with crypto currency."));
    } else if (option === "cryptoCurrency" && isTermsSelected === true) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  };
  return (
    <>
      <Modal
        {...props}
        dialogClassName="login-modal"
        backdropClassName="login-modal-backdrop"
        aria-labelledby="contained-modal"
        backdrop="static"
        keyboard={false}
        centered
      >
        <Form>
          {step === 1 && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>Payment Process</Modal.Title>
              </Modal.Header>
              <Modal.Body className="payment-process">
                <p>
                  Please make payment of {amount} {selectedCrypto} to receive{" "}
                  {cryptoAmount?.amount ? cryptoAmount?.amount : ""}{" "}
                  Token.
                </p>
                <p className="mb-0">
                  You can choose any of following payment method to make your
                  payment. The tokens balance will appear in your account after
                  successful payment.
                </p>
                <Row>
                  <Form.Group
                    controlId="paymentOption"
                    onChange={(e) => handlePaymentOption(e)}
                  >
                    <Row>
                      <Col md="6">
                        <Form.Check
                          className="payment-option"
                          value={"bankTransfer"}
                          onClick={() => checkOptions("bankTransfer")}
                          label={
                            <>
                              <div className="radio-option">Option 1</div>
                              <div className="radio-label">Bank Transfer</div>
                            </>
                          }
                          name="radiooption"
                          type="radio"
                          id="radiooption1"
                        />
                      </Col>
                      <Col md="6">
                        <Form.Check
                          className="payment-option"
                          value={"payPal"}
                          label={
                            <>
                              <div className="radio-option">Option 2</div>
                              <div className="radio-label">Pay with PayPal</div>
                            </>
                          }
                          name="radiooption"
                          type="radio"
                          id="radiooption2"
                          onClick={() => checkOptions("payPal")}
                        />
                      </Col>
                      <Col md="12">
                        <Form.Check
                          className="payment-option"
                          value={"cryptoCurrency"}
                          label={
                            <>
                              <div className="radio-option">Option 3</div>
                              <div className="radio-label">
                                Pay with Crypto Currency
                              </div>
                            </>
                          }
                          name="radiooption"
                          type="radio"
                          id="radiooption3"
                          onClick={() => checkOptions("cryptoCurrency")}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </Row>
                <p className="mt-2 mb-4">
                  * Payment gateway may charge you a processing fees.
                </p>
                <Form.Check
                  className="agree-checkbox"
                  label="I hereby agree to the token purchase agreement and token sale term."
                  name="agree"
                  type="checkbox"
                  id="agree"
                  onChange={handleTermsChange}
                />
                <div className="form-action-group">
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={openModal}
                    disabled={isLoading}
                  >
                    Buy Token
                  </Button>
                </div>

                <p className="mt-2 mb-0">
                  Our payment address will appear or redirect you for payment
                  after the order is placed.
                </p>
              </Modal.Body>
            </>
          )}
        </Form>
      </Modal>

      <Modal
        {...props}
        dialogClassName="login-modal"
        backdropClassName="login-modal-backdrop"
        aria-labelledby="contained-modal"
        backdrop="static"
        keyboard={false}
        centered
        show={props?.successModal}
      >
        <Modal.Header closeButton onClick={props?.closeModal}>
          <Modal.Title>Confirmation Your Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="payment-confirmation">
          <p className="text-white">
            Your Order no. {orderData?.tran_id} has been placed successfully.
          </p>
          <p>
            Please make your payment of 4.29 USD through bank to the below bank
            address. The token balance will appear in your account only after
            your transaction gets approved by our team.
          </p>
          <h5 className="mt-4">Bank Details for Payment</h5>
          <div className="bank-details">
            <div className="d-flex justify-content-between align-items-center">
              <div className="bank-label">Account Name</div>
              <div className="bank-info">Rogertim100</div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="bank-label">Account Number</div>
              <div className="bank-info">128007635</div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="bank-label">Accound Holder Address</div>
              <div className="bank-info">2580272365</div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="bank-label">Bank Name</div>
              <div className="bank-info">Rogert Im</div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="bank-label">Bank Address</div>
              <div className="bank-info">22300872927</div>
            </div>
          </div>
          <div className="form-action-group mb-2">
            <Button variant="primary" onClick={viewTransaction}>
              View Transaction
            </Button>
            <Button variant="secondary" onClick={props?.closeModal}>
              Cancel Order
            </Button>
          </div>
          <p>
            Use this transaction id (# {orderData?.tran_id}) as reference. Make
            your payment within 24 hours, If we will not received your payment
            within 24 hours, then we will cancel the transaction.
          </p>
        </Modal.Body>
      </Modal>
      <Modal
        {...props}
        dialogClassName="login-modal"
        backdropClassName="login-modal-backdrop"
        aria-labelledby="contained-modal"
        backdrop="static"
        keyboard={false}
        centered
        show={props?.cancelModal}
      >
        <Modal.Header closeButton onClick={props?.closeModal}>
          <Modal.Title>Oops! Payment Canceled!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="payment-confirmation">
          <p className="mb-0">
            You have canceled your payment. If you continue to have issues,
            please contact us with order no. {orderData?.tran_id}.
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PaymentProcess;
