import React, { useEffect, useState } from "react";
import { Card, Form, FormControl, Dropdown } from "react-bootstrap";
import StatisticsChart from "./StatisticsChart";
import ThisMonthSale from "./ThisMonthSale";
import Search from "../content/images/search.svg";

export const TokenSale = () => {
  const [totalToken, setTotalToken] = useState(0);
  const [filterValue, setFilterValue] = useState("thisWeekDate");
  const [filterLabel, setFilterLabel] = useState("This Week");
  const [lineToken, setLineToken] = useState({});
  const [transactions, setTransactions] = useState([]);
  const categories = [
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
  ];

  const [selectedOption, setSelectedOption] = useState({
    label: "This Week",
    value: "thisWeekDate",
  });
  const [searchText, setSearchText] = useState(`${selectedOption?.label}`);
  const [showOptions, setShowOptions] = useState(categories);
  const [category, setCategory] = useState("This Week");

  const [openDr, setOpenDr] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTextOrigin, setSearchTextOrigin] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobileMatch = window.matchMedia("(max-width: 767px)");
      setIsMobile(mobileMatch.matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDrawer = () => {
    setOpenDr(!openDr);
  };
  const handleDrawerOverlay = () => {
    setOpenDr(true);
  };

  const handleSearchChange = (event) => {
    if (searchTextOrigin === null) {
      setSearchText(event.target.value);
    } else {
      setSearchTextOrigin(null);
    }

    const searchValue = event.target.value.toLowerCase();
    const filteredData = categories.filter(
      (data) =>
        data.value.toLowerCase().includes(searchValue) ||
        data.label.toLowerCase().includes(searchValue)
    );
    setShowOptions(filteredData);

    if (searchValue === "") {
      setSearchText(null); // Set searchText to null if searchValue is empty
    }
  };
  const handleCheckboxChange = (option) => {
    setSelectedOption(option);
    setCategory(option.label);
    setSearchText(`${option.label}`);
    setSearchTextOrigin(option);
  };

  const handleCheckboxChangeOnMobile = (option) => {
    setSelectedOption(option);
    setSearchText(`${option.label}`);
    setSearchTextOrigin(option);
  };

  const handlePhoneNumberMobile = (option) => {
    setSelectedOption(option);
    setCategory(option.label);
    setOpenDr(true);
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
          <div
            className={`statisticBox d-flex items-center phone-number-dropdown justify-between relative token-sales-filter`}
          >
            {!isMobile && (
              <>
                <Form.Control name="phone" type="text" value={category} />
                <Dropdown className="account-setting-dropdown">
                <Dropdown.Toggle>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                  </svg>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdownMenu">
                  <div className="dropdown-menu-inner">
                    <FormControl
                      type="text"
                      placeholder="Search..."
                      className="mr-3 mb-2"
                      value={searchText}
                      onChange={handleSearchChange}
                    />
                    <img src={Search} alt="" className="search-icon" />
                  </div>
                  <div className="filter-option">
                    {showOptions.map((data, key) => (
                      <div
                        className="yourself-option"
                        onChange={() => handleCheckboxChange(data)}
                      >
                        <Form.Check
                          key={`${data.label}_${data.value}`}
                          type="checkbox"
                          id={`checkbox-${data.value}`}
                          label={data.label}
                          style={{
                            width: " 100%",
                            display: " flex",
                            alignItems: "center",
                          }}
                        />
                        <div
                          className={`form-check-input check-input ${
                            JSON.stringify(selectedOption) ===
                            JSON.stringify(data)
                              ? "selected"
                              : ""
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </Dropdown.Menu>
              </Dropdown>
                {/* <Dropdown className="account-setting-dropdown">
                  <Dropdown.Toggle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                    </svg>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdownMenu">
                    <div className="dropdown-menu-inner">
                      <FormControl
                        type="text"
                        placeholder="Search..."
                        className="mr-3 mb-2"
                        value={searchText}
                        onChange={handleSearchChange}
                      />
                      <img src={Search} alt="" className="search-icon" />
                    </div>
                    <div className="filter-option">
                      {showOptions.map((data, key) => (
                        <div
                          className="yourself-option"
                          onChange={() => handleCheckboxChange(data)}
                        >
                          <Form.Check
                            key={`${data.label}`}
                            type="checkbox"
                            id={`checkbox-${data.label}`}
                            label={data.label}
                            style={{
                              width: " 100%",
                              display: " flex",
                              alignItems: "center",
                            }}
                          />
                          <div
                            className={`form-check-input check-input ${
                              JSON.stringify(selectedOption) ===
                              JSON.stringify(data)
                                ? "selected"
                                : ""
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </Dropdown.Menu>
                </Dropdown> */}
              </>
            )}
            {isMobile && (
              <>
                <Form.Control name="phone" type="text" value={category} />
                <button
                  className="text-white font-medium rounded-lg text-sm"
                  type="button"
                  data-drawer-target="drawer-swipe"
                  data-drawer-show="drawer-swipe"
                  data-drawer-placement="bottom"
                  data-drawer-edge="true"
                  data-drawer-edge-offset="bottom-[60px]"
                  aria-controls="drawer-swipe"
                  onClick={handleDrawer}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                  </svg>
                </button>
                <div
                  className={!openDr ? "mobile-setting-dropdown-overlay" : ""}
                  onClick={handleDrawerOverlay}
                ></div>
                <div
                  id="drawer-swipe"
                  className={`fixed  z-40 w-full overflow-y-auto bg-white  rounded-t-lg dark:bg-gray-800 transition-transform bottom-0 left-0 right-0 ${
                    openDr ? "translate-y-full" : ""
                  } bottom-[60px]`}
                  tabindex="-1"
                  aria-labelledby="drawer-swipe-label"
                >
                  <div className="drawer-swipe-wrapper">
                    <div
                      className="drawer-swiper"
                      onClick={handleDrawerOverlay}
                    />
                    <div className="dropdown-menu-inner">
                      <FormControl
                        type="text"
                        placeholder="Search..."
                        className="mr-3 mb-2"
                        value={searchText}
                        onChange={handleSearchChange}
                      />
                      <img src={Search} alt="" className="search-icon" />
                    </div>
                    <div className="filter-option">
                      {showOptions.map((data, key) => (
                        <div
                          className="yourself-option"
                          onChange={() => handleCheckboxChangeOnMobile(data)}
                        >
                          <Form.Check
                            key={`${data.label}`}
                            type="checkbox"
                            id={`checkbox-${data.label}`}
                            label={data.label}
                            style={{
                              width: " 100%",
                              display: " flex",
                              alignItems: "center",
                            }}
                          />
                          <div
                            className={`form-check-input check-input ${
                              JSON.stringify(selectedOption) ===
                              JSON.stringify(data)
                                ? "selected"
                                : ""
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="edit-btn flex justify-center">
                      {selectedOption ? (
                        <>
                          <button
                            type="button"
                            class="btn btn-primary mx-1"
                            onClick={() =>
                              handlePhoneNumberMobile(selectedOption)
                            }
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          <button type="button" class="btn btn-primary mx-1">
                            Save
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        class="btn mx-1 bg-gray text-white"
                        onClick={handleDrawerOverlay}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* <div className="customSelectBox" >
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
          </div> */}
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
