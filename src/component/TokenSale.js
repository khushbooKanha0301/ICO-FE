import React, { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import StatisticsChart from "./StatisticsChart";
import ThisMonthSale from "./ThisMonthSale";

export const TokenSale = () => {
  const [graphOptions, setGraphOptions] = useState([]);
  const [totalToken, setTotalToken] = useState(0);
  const [filterValue, setFilterValue] = useState("thisWeekDate");
  const [filterLabel, setFilterLabel] = useState("This Week");
  const [lineToken, setLineToken] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setGraphOptions([
      {
        label: "This Week",
        value: "thisWeekDate",
      },
      {
        label: "Last Week",
        value: "lastWeek",
      },
      {
        label: "Last Month",
        value: "lastMonth",
      },
      {
        label: "Last 3 Month",
        value: "last3Months",
      },
      {
        label: "Last 6 Month",
        value: "last6Months",
      },
      {
        label: "Last Year",
        value: "lastYear",
      },
    ]);
  }, []);
  // const selectedValue = async (e) => {
  //   const value = e.target.value;
  //   console.log("value ", value);
  //   const selectedIndex = e.target.selectedIndex;
  //   console.log("selectedIndex ", selectedIndex);
  //   const label = graphOptions[selectedIndex].label;
  //   console.log("label ", label);
  //   setFilterValue(value);
  //   setFilterLabel(label);
  // };

  const setTotalTokenValue = (value) => {
    setTotalToken(value);
  };
  const setLineGraphData = (value) => {
    setLineToken(value);
  };
  const setTransactionData = (value) => {
    setTransactions(value);
  };

  const toggleOptions = () => {
    setShowOptions((prevShowOptions) => !prevShowOptions);
  };

  const handleSelectedClick = (value) => {
    setFilterValue(value);
    setShowOptions(false);
  };

  return (
    <Card className="cards-dark statistics" style={{ minHeight: "281px" }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <Card.Title as="h3">Token Sale Graph</Card.Title>
          {/* <Form.Select
            aria-label="This Week"
            onChange={(e) => selectedValue(e)}
          >
            {graphOptions?.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Form.Select> */}
          <div className="customSelectBox">
            <div
              className="form-select"
              onClick={toggleOptions}
              aria-label="This Week"
            >
              {graphOptions.find((cat) => cat.value === filterValue)?.label ||
                "Select category"}
            </div>
            {showOptions && (
              <ul className="options">
                {graphOptions.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => {handleSelectedClick(option.value);
                      setFilterLabel(option.label)}
                    }
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="transaction-view">
          <div className="transaction">
            <div className="transaction-wrapper">
              <div className="transaction-number">{totalToken}</div>
              <div className="transaction-label">Token</div>
            </div>
            <div className="divider"></div>
            <div className="transaction-wrapper">
              <ThisMonthSale
                filterValue={filterValue}
                lineToken={lineToken}
                transactions={transactions}
                filterLabel={filterLabel}
              />
            </div>
          </div>
          <div className="transaction-chart">
            <StatisticsChart
              filterValue={filterValue}
              setTransactionData={setTransactionData}
              setTotalTokenValue={setTotalTokenValue}
              setLineGraphData={setLineGraphData}
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TokenSale;
