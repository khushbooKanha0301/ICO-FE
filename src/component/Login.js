import { useWeb3React } from "@web3-react/core";
import Fortmatic from "fortmatic";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import { connectors } from "../connectors";
import apiConfigs from "../service/config";
import { checkAuth, logoutAuth, userDetails } from "../store/slices/AuthSlice";
import {
  notificationFail,
  notificationSuccess,
} from "../store/slices/notificationSlice";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";

export const LoginView = (props) => {
  const {handleaccountaddress,settwofamodal,...rest} = props;
  const [checkValue, setCheckValue] = useState(null);
  const [accountAddress, setAccountAddress] = useState("");
  const [userchainId, SetUserChainId] = useState(null);
  const [newChainId, setNewChainId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector(userDetails);
  const { library, chainId, account, activate, deactivate } = useWeb3React();
  const { ethereum } = window;

  const { signMessage, data, error } = useSignMessage();
  const { address, isConnected } = useAccount();
  const { connect, connectors: wagmiConnector } = useConnect();
  const { disconnect: disonnectWalletConnect } = useDisconnect();

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      let storageProvider = window.localStorage.getItem("provider");
      let provider = null;
      if (storageProvider == "injected") {
        provider = window.ethereum.providers.find(
          (provider) => provider.isMetaMask
        );
      }
      if (storageProvider == "coinbaseWallet") {
        await activateInjectedProvider("coinbaseWallet");
      }
      if (!provider) {
        return false;
      }
      let metaAccounts = await provider.request({ method: "eth_accounts" });
      if (
        !metaAccounts ||
        metaAccounts[0] != userData?.account?.toLowerCase()
      ) {
        return false;
      }

      if (localStorage?.getItem("token")) {
        try {
          if (storageProvider == "injected") {
            await activateInjectedProvider("injected");
            await activate(connectors.injected);
            setProvider("injected");
          }
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
  }, []);

  useEffect(() => {
    const listenEventOnProvider = async () => {
      var metamaskProvider = await window.ethereum.providers.find(
        (provider) => provider.isMetaMask
      );
      var handleAccountsChangedOnMetaMask = async (accounts) => {
        if (accounts.length) {
          await activateInjectedProvider("injected");
          await activate(connectors.injected);
          setProvider("injected");
        }
      };
      await metamaskProvider.on(
        "accountsChanged",
        handleAccountsChangedOnMetaMask
      );

      return async () => {
        if (
          metamaskProvider &&
          typeof metamaskProvider.removeListener === "function"
        ) {
          await metamaskProvider.removeListener(
            "accountsChanged",
            handleAccountsChangedOnMetaMask
          );
        }
      };
    };

    listenEventOnProvider();
  }, []);

  const setProvider = (type) => {
    window.localStorage.setItem("provider", type);
  };

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts !== 0) {
          let account = accounts[0]
            ? accounts[0]
            : userData.address
            ? userData.address
            : null;
          if (account) setAccountAddress(account);
        }
      } catch (error) {}
    };
    let authToken = userData.authToken ? userData.authToken : null;
    if (authToken) {
      checkIfWalletIsConnected();
    }
  }, [ethereum, userData.authToken, userData.address]);

  const setCoinbaseEvent = async () => {
    var coinbaseProvider = await window.ethereum.providers.find(
      (provider) => provider.isCoinbaseWallet
    );
    var handleAccountsChangedOnCoinbase = async (accounts) => {
      if (accounts.length) {
        await activateInjectedProvider("coinbaseWallet");
        await connect({ connector: wagmiConnector[1] });
        setProvider("coinbaseWallet");
      }
    };
    await coinbaseProvider.on(
      "accountsChanged",
      handleAccountsChangedOnCoinbase
    );
  };

  useEffect(() => {
    if (chainId) {
      SetUserChainId(chainId);
    }
  }, [chainId]);

  ethereum &&
    ethereum.on("chainChanged", (networkId) => {
      if (userchainId !== null && userchainId !== networkId) {
        setNewChainId(Web3.utils.hexToNumber(networkId));
      }
    });

    useEffect(() => {
      const checkChain = async () => {
        if(newChainId)
        {
          const isChainSupported = await isChainIdSupported(newChainId);
          if(!isChainSupported)
          {
            await disconnect();
            settwofamodal(false);
            dispatch(notificationFail("Network is unsupoorted, please switch to another network"));
          }
          else if(newChainId && userchainId !== null && userchainId !== newChainId) {
            dispatch(notificationSuccess("Network changed successfully !"));
          }
        }
      }
      checkChain();
    }, [newChainId]);

  useEffect(() => {
    handleaccountaddress(accountAddress);
  }, [accountAddress]);

  useEffect(() => {
    const checkMetaAcc = async () => {
      if (userData.account && userData.account != "Connect Wallet") {
        let storageProvider = window.localStorage.getItem("provider");
        let provider = null;
        if (storageProvider == "injected") {
          provider = window.ethereum.providers.find(
            (provider) => provider.isMetaMask
          );
        }
        if (!provider) {
          return false;
        }
        let metaAccounts = await provider.request({ method: "eth_accounts" });

        if (
          !metaAccounts ||
          metaAccounts[0] != userData.account.toLowerCase()
        ) {
          await disconnect();
          settwofamodal(false);
          dispatch(notificationSuccess("User logout successfully !"));
        }
      }

      if (userData.account && userData.account == "Connect Wallet" && account) {
        let checkAuthParams = {
          account: account,
          library: library,
          checkValue: checkValue,
          deactivate: deactivate,
          hideLoginModal: props.onHide,
        };
        settwofamodal(false);
        props.onHide();
        dispatch(checkAuth(checkAuthParams)).unwrap();
      }
    };
    checkMetaAcc();
  }, [account]);

  const refreshState = () => {
    window.localStorage.setItem("provider", undefined);
    window.localStorage.removeItem("userData");
  };
  useEffect(() => {
    if (props.issign === true) {
      settwofamodal(false);
      disconnect();
      dispatch(notificationSuccess("User logout successfully !"));
    }
  }, [props.issign]);

  useEffect(() => {
    let storageProvider = window.localStorage.getItem("provider");
    if (!isConnected && userData?.account !== "Connect Wallet" && storageProvider == "coinbaseWallet") {
      disonnectWalletConnect();
      disconnect();
      dispatch(notificationSuccess("User logout successfully !"));
    }
  }, [isConnected, userData?.account]);

  const disconnect = async () => {
    setAccountAddress("");
    if (isConnected) {
      disonnectWalletConnect();
    }
    dispatch(logoutAuth()).unwrap();
    deactivate();
    refreshState();
    navigate("/");
  };
  const fortmatic = async () => {
    const fm = await new Fortmatic(apiConfigs.FORTMATIC_KEY);
    window.web3 = await new Web3(fm.getProvider());
    await window.web3.eth.getAccounts((error, accounts) => {
      if (error) {
        throw error;
      }
      let checkAuthParams = {
        account: accounts[0],
        library: library,
        checkValue: checkValue,
      };
      dispatch(checkAuth(checkAuthParams)).unwrap();
      props.onHide();
      setAccountAddress(accounts[0]);
    });
  };
  const getWalletConnect = async () => {
    let checkAuthParams = {
      account: address,
      library: null,
      checkValue: checkValue,
      signMessage: signMessage,
    };
    dispatch(checkAuth(checkAuthParams)).unwrap();
    setAccountAddress(address);
  };
  useEffect(() => {
    if (data) {
      let checkAuthParams = {
        account: address,
        checkValue: checkValue,
        signature: data,
      };
      dispatch(checkAuth(checkAuthParams)).unwrap();
      props.onHide();
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      if (isConnected) {
        disonnectWalletConnect();
      }
      setAccountAddress("");
      navigate("/");
      refreshState();
      window.localStorage.clear();
    }
  }, [error]);

  useEffect(() => {
    if (address) {
      if (userData?.account === "Connect Wallet") {
        getWalletConnect();
      } else {
        if (userData?.account != address) {
          disconnect();
          settwofamodal(false);
          dispatch(notificationSuccess("User logout successfully !"));
        }
      }
    }
  }, [address, userData?.account]);

  const activateInjectedProvider = async (providerName) => {
    if (!ethereum?.providers) {
      return undefined;
    }

    let provider;
    switch (providerName) {
      case "coinbaseWallet":
        provider = ethereum.providers.find(
          ({ isCoinbaseWallet }) => isCoinbaseWallet
        );
        provider.disableReloadOnDisconnect();
        break;
      case "injected":
        provider = ethereum.providers.find(({ isMetaMask }) => isMetaMask);
        break;
    }

    if (provider) {
      ethereum.setSelectedProvider(provider);
    }
  };

  const isChainIdSupported = async (chainId) => {
    return connectors?.injected?.supportedChainIds?.includes(chainId)
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!!account) {
      disconnect();
    }
    if (!checkValue) {
      dispatch(notificationFail("Please select wallet"));
    }
    switch (checkValue) {
      case "wallet_connect":
        connect({ connector: wagmiConnector[0] });
        setProvider("walletConnect");
        break;

      case "meta_mask":
        let provider = window.ethereum.providers.find(
          (provider) => provider.isMetaMask
        );
        const currentChainId = Web3.utils.hexToNumber(provider.chainId);
        const isChainSupported = await isChainIdSupported(currentChainId);
        
        if(!isChainSupported)
        {
          dispatch(notificationFail("Network is unsupoorted, please switch to another network"));
          return false;
        }

        await activateInjectedProvider("injected");
        activate(connectors.injected);
        setProvider("injected");
        break;
      case "coinbase_wallet":
        await connect({ connector: wagmiConnector[1] });
        setProvider("coinbaseWallet");
        break;

      case "fortmatic":
        fortmatic();
        setProvider("fortmatic");
        break;
      default:
        break;
    }
    props.onHide();
  };
  const onChange = (event) => {
    const { value } = event.target;
    setCheckValue(value);
  };

  const cancleWallet = () => {
    props.onHide();
    setCheckValue(null);
  };
  return (
    <>
      {props.show && (
        <Modal
          {...rest}
          dialogClassName="login-modal"
          backdropClassName="login-modal-backdrop"
          aria-labelledby="contained-modal"
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Body>
            <h4>Connect Wallet</h4>
            <p>
              Connect with one of our available wallet providers or create a new
              one.
            </p>
            <Form onSubmit={submitHandler}>
              <Row>
                <Col md="6">
                  <Form.Check
                    className="login-option"
                    label={
                      <>
                        <img
                          src={require("../content/images/wallet-connect.png")}
                          alt="WalletConnect"
                        />{" "}
                        WalletConnect
                      </>
                    }
                    name="group1"
                    type="radio"
                    id="loginoption1"
                    value={"wallet_connect"}
                    onChange={onChange}
                  />
                </Col>
                <Col md="6">
                  <Form.Check
                    className="login-option"
                    label={
                      <span>
                        <img
                          src={require("../content/images/metamask.png")}
                          alt="Metamask"
                        />{" "}
                        Metamask
                      </span>
                    }
                    value={"meta_mask"}
                    name="group1"
                    type="radio"
                    id="loginoption2"
                    onChange={onChange}
                  />
                </Col>
                <Col md="6">
                  <Form.Check
                    className="login-option"
                    label={
                      <span>
                        <img
                          src={require("../content/images/coinbase-wallet.png")}
                          alt="Coinbase Wallet"
                        />{" "}
                        Coinbase Wallet
                      </span>
                    }
                    onChange={onChange}
                    value={"coinbase_wallet"}
                    name="group1"
                    type="radio"
                    id="loginoption3"
                  />
                </Col>
                <Col md="6">
                  <Form.Check
                    className="login-option"
                    label={
                      <span>
                        <img
                          src={require("../content/images/fortmatic.png")}
                          alt="Fortmatic"
                        />{" "}
                        Fortmatic
                      </span>
                    }
                    onChange={onChange}
                    value={"fortmatic"}
                    name="group1"
                    type="radio"
                    id="loginoption4"
                  />
                </Col>
              </Row>
              <div className="form-action-group">
                <Button variant="primary" type="submit" disabled={!checkValue}>
                  Connect Wallet
                </Button>
                <Button variant="secondary" onClick={cancleWallet}>
                  Cancel
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
export default LoginView;
