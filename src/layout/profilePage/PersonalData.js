import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  notificationFail,
  notificationSuccess,
} from "../../store/slices/notificationSlice";
import { userGetData, userGetFullDetails } from "../../store/slices/AuthSlice";
import jwtAxios from "../../service/jwtAxios";
import listData from "./../../component/countryData";
import {
  defineCountry,
  definePhoneCode,
} from "../../store/slices/countrySettingSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { CalenderIcon } from "../../component/SVGIcon";
import { forwardRef } from "react";

export const PersonalData = () => {
  const dispatch = useDispatch();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [dob, setDob] = useState("");
  const [location, setLocation] = useState("");
  const [countryCallingCode, setCountryCallingCode] = useState("");
  const userDetailsAll = useSelector(userGetFullDetails);
  const [showOptions, setShowOptions] = useState(false);
  const [showCountryOptions, setShowCountryOptions] = useState(false);

  useEffect(() => {
    let user = userDetailsAll;
    if (user) {
      setFname(user?.fname ? user?.fname : "");
      setLname(user?.lname ? user?.lname : "");
      setPhone(user?.phone ? user?.phone : "");
      setEmail(user?.email ? user?.email : "");
      setCity(user?.city ? user?.city : "");
      setDob(user?.dob ? moment(user?.dob, "DD/MM/YYYY").toDate() : "");
      setLocation(user?.location ? user?.location : "");
    }

    if (user?.location) {
      setLocation(user?.location);
    } else {
      setLocation("US");
    }

    if (user?.phoneCountry) {
      setCountryCallingCode(user?.phoneCountry);
    } else {
      setCountryCallingCode(" +1");
    }
  }, [userDetailsAll]);

  useEffect(() => {
    let user = userDetailsAll;
    if (user) {
      setFname(user?.fname ? user?.fname : "");
      setLname(user?.lname ? user?.lname : "");
      setPhone(user?.phone ? user?.phone : "");
      setEmail(user?.email ? user?.email : "");
      setCity(user?.city ? user?.city : "");
      setDob(user?.dob ? moment(user?.dob, "DD/MM/YYYY").toDate() : "");
      setLocation(user?.location ? user?.location : "");
    }

    if (user?.location) {
      setLocation(user?.location);
    } else {
      setLocation("US");
    }

    if (user?.phoneCountry) {
      setCountryCallingCode(user?.phoneCountry);
    } else {
      setCountryCallingCode(" +1");
    }
  }, []);

  const onChange = (e) => {
    if (e.target.name === "fname") {
      setFname(e.target.value);
    } else if (e.target.name === "lname") {
      setLname(e.target.value);
    } else if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "phone") {
      const value = e.target.value.replace(/\D/g, "");
      setPhone(value);
    } else if (e.target.name === "city") {
      setCity(e.target.value);
    } else if (e.target.name === "dob") {
      setDob(e.target.value);
    } else if (e.target.name === "location") {
      setLocation(e.target.value);
    }
  };

  const submitHandler = async () => {
    if (!fname) {
      dispatch(notificationFail("Please Enter First Name"));
    } else if (!lname) {
      dispatch(notificationFail("Please Enter Last Name"));
    } else if (!phone) {
      dispatch(notificationFail("Please Enter phone number"));
    } else if (!email) {
      dispatch(notificationFail("Please Enter email"));
    } else if (!dob) {
      dispatch(notificationFail("Please Enter Date of Birth"));
    } else if (!city) {
      dispatch(notificationFail("Please Enter city"));
    }

    if (phone && email && fname && lname && dob && city && location) {
      let formSubmit = {
        fname: fname,
        lname: lname,
        email: email,
        phone: phone,
        dob: dob.toLocaleDateString("en-GB"),
        location: location,
        city: city,
        phoneCountry: countryCallingCode,
      };
      let updateUser = await jwtAxios
        .put(`/users/updateAccountSettings`, formSubmit)
        .catch((error) => {
          if (typeof error == "string") {
            dispatch(notificationFail(error));
          }
          if (error?.response?.data?.message === "") {
            dispatch(notificationFail("Invalid "));
          }
          if (error?.response?.data?.message) {
            dispatch(notificationFail(error?.response?.data?.message));
          }
        });
      if (updateUser) {
        dispatch(userGetData(userGetData.userid)).unwrap();
        dispatch(notificationSuccess("User profile update successfully !"));
      }
    }
  };

  const DatepickerCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div style={{ display: "flex" }} onClick={onClick}>
      <Form.Control
        className="example-custom-input"
        ref={ref}
        value={value}
        readOnly
        placeholder="DD MMMM YYYY"
      />
      <CalenderIcon width={30} height={30} />
    </div>
  ));

  const phoneCountry = () => {
    const result = listData.find((item) => item?.code === countryCallingCode);
    return `https://flagcdn.com/h40/${result?.iso?.toLowerCase()}.png`;
  };

  const countryName = () => {
    return `https://flagcdn.com/h40/${location?.toLowerCase()}.png`;
  };

  const toggleOptions = () => {
    setShowOptions((prevShowOptions) => !prevShowOptions);
  };

  const toggleCountryOptions = () => {
    setShowCountryOptions((prevShowOptions) => !prevShowOptions);
  };

  return (
    <Card body className="cards-dark">
      <Card.Title as="h2">Personal Data</Card.Title>
      <Form>
        <Row>
          <Col md="6">
            <Form.Group className="form-group">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="John"
                name="fname"
                value={fname}
                onChange={(e) => onChange(e)}
                disabled={userDetailsAll?.fname ? true : false}
              />
            </Form.Group>
          </Col>
          <Col md="6">
            <Form.Group className="form-group">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Doe"
                name="lname"
                value={lname}
                onChange={(e) => onChange(e)}
                disabled={userDetailsAll?.lname ? true : false}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Form.Group className="form-group">
              <Form.Label>Email (required)</Form.Label>
              <Form.Control
                type="email"
                placeholder="your@email.com"
                name="email"
                value={email}
                onChange={(e) => onChange(e)}
              />
            </Form.Group>
          </Col>
          <Col md="6">
            <Form.Group className="form-group mb-4">
              <Form.Label>Phone number (required)</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  placeholder={countryCallingCode}
                  name="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    onChange(e);
                  }}
                  maxLength="10"
                />
                {countryCallingCode ? (
                  <img
                    src={phoneCountry()}
                    alt="Flag"
                    className="circle-data"
                  />
                ) : (
                  "No Flag"
                )}
                <div className="country-select">
                  {/* <Form.Select
                      size="sm"
                      onChange={(e) => {
                        setCountryCallingCode(e.target.value);
                        dispatch(definePhoneCode(e.target.value));
                      }}
                      value={countryCallingCode}
                    >
                      {listData.map((data, key) => (
                        <option value={`${data?.code}`} key={key}>
                          {data?.country} ({data?.code})
                        </option>
                      ))}
                    </Form.Select> */}
                  <div
                    className="dropdownPersonalData form-select form-select-sm"
                    onClick={toggleOptions}
                  >
                    {
                      listData.find((item) => item?.code === countryCallingCode)
                        ?.cca3
                    }
                  </div>
                  {showOptions && (
                    <ul className="options personalData">
                      {listData.map((data, key) => (
                        <li
                          key={key}
                          onClick={() => {
                            setCountryCallingCode(data?.code);
                            dispatch(definePhoneCode(data?.code));
                          }}
                        >
                          {data?.country} ({data?.code})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Form.Group className="form-group">
              <Form.Label>Date of Birth</Form.Label>
              <DatePicker
                selected={dob}
                onChange={(e) => setDob(e)}
                className="form-control"
                placeholderText="DD MMMM YYYY"
                dateFormat="dd MMMM yyyy"
                name="dob"
                maxDate={new Date()}
                customInput={<DatepickerCustomInput />}
                disabled={userDetailsAll?.dob ? true : false}
              />
            </Form.Group>
          </Col>
          <Col md="6">
            <Form.Group className="form-group">
              <Form.Label>Location</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  placeholder={"Newyork"}
                  name="city"
                  value={city}
                  onChange={(e) => {
                    onChange(e);
                  }}
                />
                {location ? (
                  <img src={countryName()} alt="Flag" className="circle-data" />
                ) : (
                  "No Flag"
                )}
                {/* <p className="text-white mb-0">
                  {listData.find((item) => item?.iso === location)?.cca3}
                </p> */}
                <div className="country-select">
                  {/* <Form.Select
                    size="sm"
                    onChange={(e) => {
                      setLocation(e.target.value);
                      dispatch(defineCountry(e.target.value));
                    }}
                    value={location}
                    disabled={userDetailsAll?.location ? true : false}
                  >
                    {listData.map((data, key) => (
                      <option value={`${data.iso}`} key={key}>
                        {data.country}
                      </option>
                    ))}
                  </Form.Select> */}
                  <div
                    className="dropdownPersonalData form-select form-select-sm"
                    onClick={toggleCountryOptions}
                  >
                    {listData.find((item) => item?.iso === location)?.cca3}
                  </div>
                  {showCountryOptions && (
                    <ul className="options personalData">
                      {listData.map((data, key) => (
                        <li
                          key={key}
                          onClick={() => {
                            setLocation(data?.iso);
                            dispatch(defineCountry(data?.iso));
                          }}
                        >
                          {data?.country}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" onClick={submitHandler}>
          Update Profile
        </Button>
      </Form>
    </Card>
  );
};

export default PersonalData;
