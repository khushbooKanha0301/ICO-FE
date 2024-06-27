import React, { useEffect, useMemo, useState } from "react";
import PaginationComponent from "../../component/Pagination";
import * as flatted from "flatted";
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
  const [typeFilter, setTypeFilter] = useState(
    flatted.parse(flatted.stringify([]))
  );
  const [statusFilter, setStatusFilter] = useState(
    flatted.parse(flatted.stringify([]))
  );
  // const [statusFilter, setStatusFilter] = useState([]);
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
      let bodyData = {
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

  const handleFilterTypeChange = (filterType) => {
    setTypeFilter((prevValues) => {
      if (prevValues.includes(filterType)) {
        return prevValues.filter((f) => f !== filterType);
      } else {
        return [...prevValues, filterType];
      }
    });
    setCurrentPage(1);
  };

  const handleFilterStatusChange = (event) => {
    setStatusFilter((prevValues) => {
      if (prevValues.includes(event)) {
        return prevValues.filter((f) => f !== event);
      } else {
        return [...prevValues, event];
      }
    });
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
          <div
            className="form-check"
            onClick={() => handleFilterTypeChange("referral")}
          >
            <div
              className={`form-check-input ${
                typeFilter.includes("referral") ? "checked" : ""
              }`}
            />
            <label class="form-check-label">Referral</label>
          </div>
          <div
            className="form-check"
            onClick={() => {
              handleFilterTypeChange("purchase");
            }}
          >
            <div
              className={`form-check-input ${
                typeFilter.includes("purchase") ? "checked" : ""
              }`}
            />
            <label class="form-check-label">Purchase</label>
          </div>

          <Dropdown.Divider />
          <div className="dropdown-title">STATUS</div>
          <div
            className="form-check"
            onClick={() => handleFilterStatusChange("pending")}
          >
            <div
              className={`form-check-input ${
                statusFilter.includes("pending") ? "checked" : ""
              }`}
            />
            <label class="form-check-label">Pending</label>
          </div>
          <div
            className="form-check"
            onClick={() => handleFilterStatusChange("paid")}
          >
            <div
              className={`form-check-input ${
                statusFilter.includes("paid") ? "checked" : ""
              }`}
            />
            <label class="form-check-label">Paid</label>
          </div>

           <div
            className="form-check"
            onClick={() => handleFilterStatusChange("failed")}
          >
            <div
              className={`form-check-input ${
                statusFilter.includes("failed") ? "checked" : ""
              }`}
            />
            <label class="form-check-label">Failed</label>
          </div>

        </DropdownButton>
      </div>
      <div className="table-responsive">
        <div className="flex-table">
          <div className="flex-table-header">
            <div className="transaction-tranx-no">Tranx No</div>
            <div className="transaction-usd-amount">USDT Amount</div>
            <div className="transaction-token">Token</div>
            <div className="transaction-amount">Network</div>
            <div className="transaction-from">From</div>
            <div className="transaction-type">Type</div>
            <div className="transaction-status">Status</div>
          </div>
          {transactions?.map((transaction) => (
            <div className="flex-table-body" key={transaction._id}>
              <div className="transaction-tranx-no">
                <div className="tranx-icon">
                  {transaction?.status == "paid" && (
                    <CheckCircleIcon width="32" height="33" />
                  )}
                  {transaction?.status == "failed" && (
                    <CloseIcon width="32" height="33" />
                  )}
                  {transaction?.status == "pending" && (
                    <ExclamationIcon width="30" height="29" />
                  )}
                </div>
                <div>
                  <p className="text-white mb-1">{transaction?._id}</p>
                  <p>
                    {getDateFormate(
                      transaction?.created_at,
                      "MMM DD, YYYY HH:mm:ss"
                    )}
                  </p>
                </div>
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
              <div className="transaction-token">
                <p className="text-white mb-1">
                   {transaction?.is_sale ? transaction?.token_cryptoAmount <= 200
                    ? formattedNumber(transaction?.token_cryptoAmount)
                    : "+200" : "0.00" }
                </p>
              </div>
              <div className="transaction-amount">
                <p className="text-white mb-1">
                  {transaction?.network}
                </p>
              </div>
              <div className="transaction-from">
                <p className="text-white mb-1">
                  {hideAddress(transaction?.user_wallet_address, 5)}
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
                  {transaction?.sale_type == "website" ? "Website": "Outside-Web"}
                </div>
              </div>
              <div className="transaction-status">
                <div className="d-flex justify-content-between align-items-center">
                  {transaction?.status == "paid" && (
                    <Button variant="outline-success">
                      Confirmed 
                    </Button>
                  )}
                  {transaction?.status == "failed" && (
                    <Button variant="outline-danger">
                      Failed 
                    </Button>                  
                  )}
                  {transaction?.status == "pending" && (
                    <Button variant="outline-pending">
                      UnConfirmed 
                    </Button>
                  )}

                  <ButtonGroup aria-label="Transaction Action">
                    <Button
                      variant="secondary"
                      onClick={() => modalToggle(transaction)}
                    >
                      <EyeIcon width="24" height="24" />
                    </Button>
                  </ButtonGroup>
                    
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
