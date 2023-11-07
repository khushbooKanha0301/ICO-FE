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
  const selectedValue = async (e) => {
    const value = e.target.value;
    const selectedIndex = e.target.selectedIndex;
    const label = graphOptions[selectedIndex].label;
    setFilterValue(value);
    setFilterLabel(label);
  };

  const setTotalTokenValue = (value) => {
    setTotalToken(value);
  };
  const setLineGraphData = (value) => {
    setLineToken(value);
  };
  const setTransactionData = (value) => {
    setTransactions(value);
  };

  return (
    <Card className="cards-dark statistics" style={{ minHeight: "281px" }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <Card.Title as="h3">Token Sale Graph</Card.Title>
          <Form.Select
            aria-label="This Week"
            onChange={(e) => selectedValue(e)}
          >
            {graphOptions?.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Form.Select>
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
