import React, { useEffect, useState } from "react";
import { Form, Dropdown, FormControl } from "react-bootstrap";
import Search from "../content/images/search.svg";
import listData from "../component/countryData";
import Sheet from "react-modal-sheet";

//This component is used for kyc country dropdown for desktop and mobile view
const SelectLocationKYCDropdown = (props) => {
  const {
    setSelectedLocationOption,
    selectedLocationOption,
    setImageLocationUrl,
    setImageLocationSearchUrl,
    imageLocationSearchUrlSet,
    setSearchLocationText,
    searchLocationText,
    setCountry,
    setNationality,
    country,
  } = props;
  const [isMobile, setIsMobile] = useState(false);
  const [openDr, setOpenDr] = useState(false);
  const [searchLocationTextOrigin, setSearchLocationTextOrigin] =
    useState(null);
  const [showCountryOptions, setFilteredLocationOptions] = useState(listData);

  useEffect(() => {
    const checkMobile = () => {
      const mobileMatch = window.matchMedia("(max-width: 767px)");
      setIsMobile(mobileMatch.matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSearchLocationChange = (event) => {
    if (searchLocationTextOrigin === null) {
      setSearchLocationText(event.target.value);
    } else {
      setSearchLocationTextOrigin(null);
    }

    const searchValue = event.target.value.toLowerCase();
    const filteredData = listData.filter(
      (data) =>
        data.country.toLowerCase().includes(searchValue) ||
        data.code.toLowerCase().includes(searchValue)
    );
    setFilteredLocationOptions(filteredData);

    if (searchValue === "") {
      setSearchLocationText(null);
      setImageLocationSearchUrl(null);
    }
  };

  const handleCheckboxLocationChange = (option) => {
    setFilteredLocationOptions(listData)
    setSelectedLocationOption(option);
    setCountry(option.iso);
    setNationality(option?.country);
    const imageUrl = phoneCountryData(option.code);
    setImageLocationUrl(imageUrl);
    setImageLocationSearchUrl(imageUrl);
    setSearchLocationText(`${option.country}`);
    setSearchLocationTextOrigin(option);
    setOpenDr(false);
  };

  const handleCheckboxLocationChangeOnMobile = (option) => {
    setSelectedLocationOption(option);
    const imageUrl = phoneCountryData(option.code);
    setImageLocationSearchUrl(imageUrl);
    setSearchLocationText(`${option.country}`);
    setSearchLocationTextOrigin(option);
  };

  const handlePhoneNumberLocationMobile = (option) => {
    setSelectedLocationOption(option);
    setCountry(option.iso);
    setNationality(option?.country);
    const imageUrl = phoneCountryData(option.code);
    setImageLocationUrl(imageUrl);
    setOpenDr(false);
  };

  const phoneCountryData = (code) => {
    const result = listData.find((item) => item?.code === code);
    return `https://flagcdn.com/h40/${result?.iso?.toLowerCase()}.png`;
  };

  const handleDrawerOverlay = () => {
    setOpenDr(false);
  };

  return (
    <>
      {!isMobile && (
        <>
          <Dropdown className="account-setting-dropdown" 
            show={openDr}
            onToggle={(isOpen) => setOpenDr(isOpen)}>
            <Dropdown.Toggle>
              {listData.find((item) => item?.iso === country)?.cca3}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
              </svg>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdownMenu" show={openDr}>
              <div className="dropdown-menu-inner">
                {searchLocationText && imageLocationSearchUrlSet ? (
                  <img
                    src={imageLocationSearchUrlSet}
                    alt="Flag"
                    className="rectangle-data"
                  />
                ) : null}
                <FormControl
                  type="text"
                  placeholder="Search..."
                  className="mr-3 mb-2"
                  value={searchLocationText}
                  onChange={handleSearchLocationChange}
                />
                <img src={Search} alt="" className="search-icon" />
              </div>
              <div className="filter-option">
                {showCountryOptions.map((data, key) => (
                  <div
                    key={`${data.country}`}
                    className={`yourself-option form-check`}
                    onClick={() => handleCheckboxLocationChange(data)}
                  >
                    <label className="form-check-label">
                      <img
                        src={phoneCountryData(data.code)}
                        alt="Flag"
                        className="rectangle-data"
                      />
                      {data.country}
                    </label>
                    <div
                      className={`form-check-input check-input ${
                        JSON.stringify(selectedLocationOption) ===
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
        </>
      )}

      {isMobile && (
        <>
          <button
            className="text-white font-medium rounded-lg text-sm"
            type="button"
            data-drawer-target="drawer-swipe"
            data-drawer-show="drawer-swipe"
            data-drawer-placement="bottom"
            data-drawer-edge="true"
            data-drawer-edge-offset="bottom-[60px]"
            aria-controls="drawer-swipe"
            onClick={() => setOpenDr(true)}
          >
            <p className="text-white mb-0 personalDataLocation">
              {listData.find((item) => item?.iso === country)?.cca3}
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
            </svg>
          </button>
          <div
            className={openDr ? "mobile-setting-dropdown-overlay" : ""}
            onClick={handleDrawerOverlay}
          ></div>
          <Sheet isOpen={openDr} onClose={() => setOpenDr(false)}>
            <Sheet.Container className="phone-number-dropdown">
              <Sheet.Header />
              <Sheet.Content>
                <div tabindex="-1" aria-labelledby="drawer-swipe-label">
                  <div className="drawer-swipe-wrapper">
                    <div
                      className="drawer-swiper"
                      onClick={handleDrawerOverlay}
                    />
                    <div className="dropdown-menu-inner">
                      {searchLocationText && imageLocationSearchUrlSet ? (
                        <img
                          src={imageLocationSearchUrlSet}
                          alt="Flag"
                          className="rectangle-data"
                        />
                      ) : null}
                      <FormControl
                        type="text"
                        placeholder="Search..."
                        className="mr-3 mb-2"
                        value={searchLocationText}
                        onChange={handleSearchLocationChange}
                      />
                      <img src={Search} alt="" className="search-icon" />
                    </div>
                    <div className="filter-option">
                      {showCountryOptions.map((data, key) => (
                        <div
                          key={`${data.country}`}
                          className={`yourself-option form-check`}
                          onClick={() =>
                            handleCheckboxLocationChangeOnMobile(data)
                          }
                        >
                          <label className="form-check-label">
                            <img
                              src={phoneCountryData(data.code)}
                              alt="Flag"
                              className="rectangle-data"
                            />
                            {data.country}
                          </label>
                          <div
                            className={`form-check-input check-input ${
                              JSON.stringify(selectedLocationOption) ===
                              JSON.stringify(data)
                                ? "selected"
                                : ""
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="edit-btn flex justify-center">
                      {selectedLocationOption ? (
                        <>
                          <button
                            type="button"
                            class="btn btn-primary mx-1"
                            onClick={() =>
                              handlePhoneNumberLocationMobile(
                                selectedLocationOption
                              )
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
              </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop />
          </Sheet>
        </>
      )}
    </>
  );
};

export default SelectLocationKYCDropdown;
