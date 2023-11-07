import React, { useEffect, useMemo, useState } from "react";
import PaginationComponent from "../../component/Pagination";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  Form,
} from "react-bootstrap";
import {
  CheckCircleIcon,
  CloseIcon,
  ExclamationIcon,
  EyeIcon,
  SettingIcon,
  TrashIcon,
} from "../../component/SVGIcon";
import TransactionDetails from "../../component/TransactionDetails";
import jwtAxios from "../../service/jwtAxios";
import { useSelector } from "react-redux";
import { formattedNumber, getDateFormate, hideAddress } from "../../utils";
import { useLocation } from "react-router-dom";
import { userDetails } from "../../store/slices/AuthSlice";
let PageSize = 5;

export const TransactionPage = () => {
  const [modalShow, setModalShow] = useState(false);
  const [transactions, setTransactions] = useState(null);
  const [totalTransactionsCount, setTotalTransactionsCount] = useState(0);
  const [stateTransactions, setStateTransactions] = useState(null);
  const [typeFilter, setTypeFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const acAddress = useSelector(userDetails);
  const location = useLocation();
  const [transactionLoading, setTransactionLoading] = useState(true);

  const modalToggle = (transaction) => {
    setModalShow(!modalShow);
    setStateTransactions(transaction);
  };
  const [currentPage, setCurrentPage] = useState(1);

  const gettransaction = async () => {
    if (currentPage) {
      var bodyData = {
        typeFilter: typeFilter,
        statusFilter: statusFilter,
      };
      await jwtAxios
        .post(
          `/transactions/getTransactions?page=${currentPage}&pageSize=${PageSize}`,
          bodyData
        )
        .then((res) => {
          setTransactionLoading(false);
          setTransactions(res.data?.transactions);
          setTotalTransactionsCount(res.data?.totalTransactionsCount);
        })
        .catch((err) => {
          setTransactionLoading(false);
          console.log(err);
        });
    }
  };
  useEffect(() => {
    gettransaction();
  }, [currentPage, typeFilter, statusFilter, acAddress.authToken]);

  function handleChildMessage(event) {
    if (event.data === "updateURL" || event.data === "cancleURL") {
      gettransaction();
      window.removeEventListener("message", handleChildMessage, false);
    }
  }

  const payOrder = (payment_url) => {
    window.addEventListener("message", handleChildMessage, false);
    const width = 500;
    const height = 500;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      payment_url,
      "Payment",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  const handleFilterTypeChange = (event) => {
    if (event.target.checked) {
      setTypeFilter((prevValues) => [...prevValues, event.target.value]);
    } else {
      setTypeFilter((prevValues) =>
        prevValues.filter((v) => v !== event.target.value)
      );
    }
    setCurrentPage(1);
  };

  const handleFilterStatusChange = (event) => {
    if (event.target.checked) {
      setStatusFilter((prevValues) => [...prevValues, event.target.value]);
    } else {
      setStatusFilter((prevValues) =>
        prevValues.filter((v) => v !== event.target.value)
      );
    }
    setCurrentPage(1);
  };

  return (
    <div className="transaction-view">
      <div className="d-flex justify-content-between align-items-center">
        <h2>User Transactions</h2>
        <DropdownButton
          id="setting-dropdown"
          variant="secondary"
          drop="start"
          autoClose="outside"
          title={<SettingIcon width="24" height="24" />}
        >
          <div className="dropdown-title">TYPES</div>
          <Form.Check
            label="Referral"
            name="setting-type"
            type="checkbox"
            id="setting-type"
            onChange={handleFilterTypeChange}
            value="referral"
          />
          <Form.Check
            label="Purchase"
            name="setting-type"
            type="checkbox"
            id="setting-type1"
            onChange={handleFilterTypeChange}
            value="purchase"
          />
          <Dropdown.Divider />
          <div className="dropdown-title">STATUS</div>
          <Form.Check
            label="New"
            name="setting-status"
            type="checkbox"
            id="setting-status"
            value="new"
            onChange={handleFilterStatusChange}
          />
          <Form.Check
            label="Pending"
            name="setting-status"
            type="checkbox"
            id="setting-status1"
            value="pending"
            onChange={handleFilterStatusChange}
          />
          <Form.Check
            label="Paid"
            name="setting-status"
            type="checkbox"
            id="setting-status2"
            value="paid"
            onChange={handleFilterStatusChange}
          />
          <Form.Check
            label="Expired"
            name="setting-status"
            type="checkbox"
            id="setting-status3"
            value="expired"
            onChange={handleFilterStatusChange}
          />
        </DropdownButton>
      </div>
      <div className="table-responsive">
        <div className="flex-table">
          <div className="flex-table-header">
            <div className="transaction-tranx-no">Tranx No</div>
            <div className="transaction-token">Token</div>
            <div className="transaction-amount">Amount</div>
            <div className="transaction-usd-amount">USD Amount</div>
            <div className="transaction-from">From</div>
            <div className="transaction-type">Type</div>
          </div>
          {transactions?.map((transaction) => (
            <div className="flex-table-body" key={transaction._id}>
              <div className="transaction-tranx-no">
                <div className="tranx-icon">
                  {transaction?.status == "paid" && (
                    <CheckCircleIcon width="32" height="33" />
                  )}
                  {(transaction?.status == "canceled" ||
                    transaction?.status == "expired" ||
                    transaction?.status == "invalid") && (
                    <CloseIcon width="32" height="33" />
                  )}
                  {(transaction?.status == "new" ||
                    transaction?.status == "pending") && (
                    <ExclamationIcon width="30" height="29" />
                  )}
                </div>
                <div>
                  <p className="text-white mb-1">{transaction?.tran_id}</p>
                  <p>
                    {getDateFormate(
                      transaction?.created_at,
                      "MMM DD, YYYY HH:mm:ss"
                    )}
                  </p>
                </div>
              </div>
              <div className="transaction-token">
                <p className="text-white mb-1">
                  {transaction?.token_cryptoAmount <= 200
                    ? formattedNumber(transaction?.token_cryptoAmount)
                    : "+200"}
                </p>
                <p>Token</p>
              </div>
              <div className="transaction-amount">
                <p className="text-white mb-1">
                  {formattedNumber(transaction?.price_amount)}
                </p>
                <p>{transaction?.price_currency}</p>
              </div>
              <div className="transaction-usd-amount">
                <p className="text-white mb-1">
                  {formattedNumber(
                    transaction?.usd_amount
                      ? transaction?.usd_amount
                      : transaction?.price_amount
                  )}
                </p>
                <p>{transaction?.receive_currency}</p>
              </div>
              <div className="transaction-from">
                <p className="text-white mb-1">
                  {hideAddress(transaction?.wallet_address, 5)}
                </p>
                <p>
                  {getDateFormate(
                    transaction?.created_at,
                    "MMM DD, YYYY HH:mm:ss"
                  )}
                </p>
              </div>
              <div className="transaction-type">
                <div className="d-flex justify-content-between align-items-center">
                  <Button variant="outline-success">
                    {transaction.source
                      ? transaction.source.charAt(0).toUpperCase() +
                        transaction.source.slice(1)
                      : "Purchase"}
                  </Button>
                  {transaction?.status == "paid" && (
                    <>
                      <ButtonGroup aria-label="Transaction Action">
                        <Button
                          variant="secondary"
                          onClick={() => modalToggle(transaction)}
                        >
                          <EyeIcon width="24" height="24" />
                        </Button>
                      </ButtonGroup>
                    </>
                  )}
                  {(transaction?.status == "new" ||
                    transaction?.status == "pending") && (
                    <>
                      <Button
                        variant="outline-info"
                        onClick={() => payOrder(transaction?.payment_url)}
                      >
                        Pay
                      </Button>
                    </>
                  )}
                  {(transaction?.status == "canceled" ||
                    transaction?.status == "invalid" ||
                    transaction?.status == "expired") && (
                    <ButtonGroup aria-label="Transaction Action">
                      <Button
                        variant="secondary"
                        onClick={() => modalToggle(transaction)}
                      >
                        <EyeIcon width="24" height="24" />
                      </Button>
                    </ButtonGroup>
                  )}
                </div>
              </div>
            </div>
          ))}
          {totalTransactionsCount === 0 && transactionLoading === false && (
            <div className="flex-table-body no-records justify-content-between">
              <div className="no-records-text">
                <div className="no-record-label">No Records</div>
                <p>You haven't made any transaction</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {totalTransactionsCount !== 0 && transactionLoading === false && (
        <div className="d-flex justify-content-between align-items-center table-pagination">
          <PaginationComponent
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={totalTransactionsCount}
            pageSize={PageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
          <div className="table-info">
            {currentPage === 1
              ? `${totalTransactionsCount > 0 ? 1 : 0}`
              : `${(currentPage - 1) * PageSize + 1}`}{" "}
            - {`${Math.min(currentPage * PageSize, totalTransactionsCount)}`} of{" "}
            {totalTransactionsCount}
          </div>
        </div>
      )}
      <TransactionDetails
        show={modalShow}
        stateTransactions={stateTransactions}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
};

export default TransactionPage;
