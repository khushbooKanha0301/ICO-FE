import React, { useEffect, useState } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { userDetails, userGetFullDetails } from "../store/slices/AuthSlice";
import { hideAddress } from "../utils";
import { LoginIcon, LogoutIcon, SettingIcon, UserIcon } from "./SVGIcon";

export const Header = (props) => {
  const { signOut, clickHandler, clickModalHandler } = props;
  const [position, setPosition] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);
  const acAddress = useSelector(userDetails);
  const userDetailsAll = useSelector(userGetFullDetails);

  useEffect(() => {
    const handleScroll = () => {
      let moving = window.pageYOffset;

      setVisible(position > moving);
      setPosition(moving);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

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

  const cls = visible ? "visible" : "hidden";

  return (
    <div className={`header d-flex ${cls}`}>
      <Navbar.Toggle
        onClick={clickHandler}
        className="d-block d-md-none"
        aria-controls="basic-navbar-nav"
      />
      <Nav className="ms-auto" as="ul">
        <Nav.Item
          as="li"
          onClick={acAddress.authToken ? null : props.clickModalHandler}
          className="login-menu"
        >
          {acAddress && addressLine != "" && (
            <span className="user-name d-none d-md-block">
              {addressLine}
            </span>
          )}
          {acAddress && addressLine != "" && (
          <span className="login-btn d-flex d-md-none text-white">
              {addressLine}
          </span>
          )}
        </Nav.Item>
        {acAddress &&
          acAddress?.authToken &&
          userDetailsAll?.is_2FA_login_verified === true && (
            <NavDropdown
              as="li"
              title={
                <img
                  className="rounded-circle"
                  style={{ width: "48px", height: "48px" }}
                  src={
                    acAddress?.imageUrl
                      ? acAddress?.imageUrl
                      : require("../content/images/avatar.png")
                  }
                  alt="No Profile"
                />
              }
              id="nav-dropdown"
            >
              <NavDropdown.Item as={Link} to={`/profile`}>
                <UserIcon width="18" height="18" />
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/profile">
                <SettingIcon width="18" height="18" />
                Account settings
              </NavDropdown.Item>
              <NavDropdown.Item onClick={signOut}>
                <LogoutIcon width="18" height="18" />
                Sign out
              </NavDropdown.Item>
            </NavDropdown>
          )}
      </Nav>
    </div>
  );
};

export default Header;
