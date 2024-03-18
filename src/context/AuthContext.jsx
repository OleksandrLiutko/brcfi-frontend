import React, { createContext, useContext, useEffect, useReducer, useState, useRef } from "react";

import { getAddress, signTransaction } from "sats-connect";
import * as btc from "micro-btc-signer";
import { hex, base64 } from "@scure/base";

import { useToast } from "../hooks/useToast";
import useFetch from "../hooks/useFetch";
import { getMyOrderListApi, tokenDataListApi } from "../utils/apiRoutes";
import { defaultToken } from "../utils/constants";
import { useTokenSelect } from "../hooks/useTokenSelect";
import { useLoadData } from "../hooks/useLoadData";
import useGetPool from "../hooks/useGetPool";
import xverse from "../assets/images/xverse.png"
import unisat from "../assets/images/unisat.png"
import axios from "axios";

const authActions = {
  SET_THEME: "SET_THEME",
  UPDATE_THEME: "UPDATE_THEME",
  SET_USER: "SET_USER",
  DELETE_USER: "DELETE_USER",
};

const initialState = {
  preferDark: true,//window.matchMedia("(prefers-color-scheme: dark)").matches,
  token: "",
  user: null,
  wallet: 1,
  network: 1,
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case authActions.SET_THEME: {
      // console.log('AAAAAAAAAAAAAAAAA');
      return {
        ...state,
        preferDark: payload.preferDark,
      };
    }
    case authActions.UPDATE_THEME: {
      localStorage.setItem('theme', !state.preferDark);
      // console.log('AAAAAAAAAAAAAAAAA');
      return {
        ...state,
        preferDark: !state.preferDark,
      };
    }

    case authActions.SET_USER: {
      return {
        ...state,
        user: { ...payload },
      };
    }

    case authActions.DELETE_USER: {
      return {
        token: "",
        user: null,
      };
    }

    default:
      return state;
  }
};

export const AuthContext = createContext({
  authState: initialState,
  authDispatch: () => { },
  updateToken: () => { },
  updateTheme: () => { },
  updateUser: () => { },
  deleteUser: () => { },
});

export const WalletType = {
  Unisat: 'unisat',
  XVerse: 'xverse'
}

let currentNetwork;

export function AuthStateProvider({ children }) {

  const { messageApi } = useToast();
  const [authState, authDispatch] = useReducer(reducer, initialState);
  const [unisatWallet, setUnisatWallet] = useState(null);
  const [unisatInstalled, setUnisatInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [publicKey, setPublicKey] = useState("");
  const [address, setAddress] = useState("");
  const [paymentAddress, setPaymentAddress] = useState("");
  const [ordinalsAddress, setOrdinalsAddress] = useState("");
  const [walletType, setWalletType] = useState("");
  const [tokenDataList, setTokenDataList] = useState(null);
  const [balance, setBalance] = useState({
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  });
  const [network, setNetwork] = useState("testnet");

  const [tokenList, tokenSelectList, poolTokenLists, tokenBalances, tokenOne, tokenTwo, setTokenOne, setTokenTwo] = useTokenSelect(address);
  const [factoryWallet, poolList] = useLoadData(address);
  const [orderList, fetchOrderList] = useFetch(`${getMyOrderListApi}?address=${address}`)
  // const [rewardsData, fetchRewardsData] = useFetch(getRewardsApi(address));
  const [setTokenPair, currentPool, currentPoolLoading, error,] = useGetPool(tokenOne, tokenTwo);

  const checkConnect = async () => {
    return new Promise(async (res, rej) => {

      currentNetwork = '';
      setTimeout(async () => {
        if (currentNetwork === '') {
          // setConnected(false);
          messageApi.notifyWarning(
            'Wallet is disconnected! Please reload the page.',
            5
          )
          setConnected(false)
          await window.unisat.requestAccounts();
          setConnected(true)

          res(false);
        }
      }, 1000);
      if (!connected)
          currentNetwork = await window.unisat.getNetwork();
      else
          currentNetwork = await window.unisat.requestAccounts();
      // console.log('Wallet is connected!');
      res(true)
    })
  }

  const connectWallet = async() => {
    if (!window.unisat) {
      messageApi.notifyWarning('Please install Unisat wallet!', 3)
      return;
    }
    const connect = await checkConnect();
    if (!connect) return;
    try {
        const result = await window.unisat.requestAccounts();
        await window.unisat.switchNetwork('testnet')
        handleAccountsChanged(result);
        setConnected(true);
        messageApi.notifySuccess('Wallet is connected!', 3)
    } catch (error) {

    }
  }

  const connectXverseWallet = async () => {
    const getAddressOptions = {
      payload: {
        purposes: ["ordinals", "payment"],
        message: "Address for receiving Ordinals and payments",
        network: {
          type: "Testnet",
        },
      },
      onFinish: (response) => {
        // handleAccountsChanged([response["addresses"][0]["address"]]);
        // setConnected(true);
        setWalletType(WalletType.XVerse)
        setPaymentAddress(response.addresses[1])
        setOrdinalsAddress(response.addresses[0])
        setConnected(true)

        messageApi.notifySuccess("Wallet is connected!", 3);

      },
      onCancel: () => {
      },
    };

    await getAddress(getAddressOptions);
    setShowModal(false)
  }

  const connectUnisatWallet = async () => {
    if (!window.unisat) {
      messageApi.notifyWarning('Please install Unisat wallet!', 3)
      return;
    }
    const connect = await checkConnect();
    setShowModal(false)
    if (!connect) return;
    try {
      const result = await window.unisat.requestAccounts();
      await window.unisat.switchNetwork('testnet')
      handleAccountsChanged(result);
      setConnected(true);
      messageApi.notifySuccess('Wallet is connected!', 3)
    } catch (error) {

    }
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!connected) return;
      // loadOrderList();
      await checkConnect();
    }, 3000);

    return () => {
      clearInterval(interval);
    }
  }, [connected])

  useEffect(() => {
    (async () => {
      const tokenIconList = await axios.get(tokenDataListApi, {
        header: {
          "x-access-token": "coinranking999e7dfea873fd6e36dbec0b290d1d80a23eba1cadf68654"
        }
      })
      setTokenDataList(tokenIconList.data.data.coins);
    })();
  }, [])

  useEffect(() => {
    const isdark = true;//localStorage.getItem('theme');
    authDispatch({ type: authActions.SET_THEME, payload: { preferDark: isdark } })

    if (window.unisat) setUnisatWallet(window.unisat);
    if (window.unisat) {
      setUnisatInstalled(true);
    } else {
      return;
    }
    window.unisat.getAccounts().then((accounts) => {
      handleAccountsChanged(accounts);
    });

    window.unisat.on("accountsChanged", handleAccountsChanged);
    window.unisat.on("networkChanged", handleNetworkChanged);
    getBasicInfo();

    return () => {
      window.unisat.removeListener("accountsChanged", handleAccountsChanged);
      window.unisat.removeListener("networkChanged", handleNetworkChanged);
    };
  }, [])

  const getBasicInfo = async () => {
    const unisat = (window).unisat;
    const [address] = await unisat.getAccounts();
    // console.log('address=========>', address);
    setAddress(address);

    const publicKey = await unisat.getPublicKey();
    setPublicKey(publicKey);

    const balance = await unisat.getBalance();
    setBalance(balance);

    const network = await unisat.getNetwork();
    setNetwork(network);
  };

  const selfRef = useRef({
    accounts: [],
  });

  const self = selfRef.current;
  const handleAccountsChanged = (_accounts) => {
    if (self.accounts[0] === _accounts[0]) {
      // prevent from triggering twice
      return;
    }
    self.accounts = _accounts;
    if (_accounts.length > 0) {
      setAccounts(_accounts);
      setConnected(true);

      setAddress(_accounts[0]);

      getBasicInfo();
    } else {
      setConnected(false);
    }
  };

  const handleNetworkChanged = (network) => {
    setNetwork(network);
    getBasicInfo();
  };

  function updateToken(payload = "") {
    authDispatch({ type: authActions.SET_TOKEN, payload });
  }

  function updateUser(payload = {}) {
    authDispatch({ type: authActions.SET_USER, payload });
  }

  function updateTheme() {
    authDispatch({ type: authActions.UPDATE_THEME });
  }

  function deleteUser() {
    authDispatch({ type: authActions.DELETE_USER });
  }

  const loadOrderList = () => {
    fetchOrderList();
  }

  useEffect(() => {
    if (address && address.length > 4 && connected) {
      const interval = setInterval(() => {
        loadOrderList()
      }, 10000);
      loadOrderList()
      return () => {
        clearInterval(interval);
      }
    }
  }, [address, connected]);

  // useEffect(() => {
    // console.log('orderList :>> ', orderList);
  // }, [orderList])

  const [showModal, setShowModal] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        unisatContext: {
          unisatWallet,
          connected,
          setUnisatInstalled,
          address,
          network,
          balance,
          connectWallet,
          checkConnect,
        },
        appContext: {
          factoryWallet,
          poolList, //static data for app
          tokenList,
          tokenSelectList,
          poolTokenLists,
          tokenOne,
          tokenTwo,
          setTokenOne,
          setTokenTwo,
          orderList,
          loadOrderList,
          currentPool,
          currentPoolLoading,
          tokenDataList
        },
        authState,
        authDispatch,
        updateToken,
        updateTheme,
        updateUser,
        deleteUser,
      }}
    >
      {children}
      {showModal && (
        <div
          className="wallet-modal-mask absolute top-0 left-0 w-[100vw] h-[100vh] bg-[#00000050] z-20"
          onClick={() => setShowModal(false)}
        ></div>
      )}
      {showModal && (
        <div className="wallet-modal m-auto absolute w-full max-w-[460px] h-[480px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="px-[2rem]">
            <div className="mx-auto w-[56px] h-[56px] flex items-center justify-center p-[16px] rounded-full border-2">
              <svg
                width="24"
                height="22"
                viewBox="0 0 24 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M22.8 4.8H19.2V1.2C19.2 0.537258 18.6627 0 18 0H1.2C0.537258 0 0 0.537258 0 1.2V20.4C0 21.0627 0.537258 21.6 1.2 21.6H22.8C23.4627 21.6 24 21.0627 24 20.4V6C24 5.33726 23.4627 4.8 22.8 4.8ZM2.4 19.2V7.2H21.6V19.2H2.4ZM2.4 2.4V4.8H16.8V2.4H2.4ZM19.1998 13.2C19.1998 12.5373 18.6627 12.0001 18 12H15.6C14.9373 12.0001 14.4002 12.5373 14.4002 13.2C14.4002 13.8627 14.9373 14.3999 15.6 14.4H18C18.6627 14.3999 19.1998 13.8627 19.1998 13.2Z"
                />
              </svg>
            </div>
            <h3 className="!text-[26px] font-normal mt-[24px] mb-[10px]">
              Connect Wallet
            </h3>
            <p className="text-[14px] font-normal leading-[20px] mb-[40px]">
              Choose how you want to connect. If you don't have a wallet, you
              can select a provider and create one.
            </p>
            <div className="button-group flex gap-8">
              <div className="w-full p-[32px]" onClick={connectXverseWallet}>
                <img className="mb-[14px]" src={xverse} alt="" />
                <div className="mb-[18px] text-[24px] text-left">Xverse</div>
                <div className="w-[28px] h-[20px] text-[14px] border rounded-[1.5rem] flex items-center justify-center">
                  {">"}
                </div>
              </div>
              <div className="w-full p-[32px]" onClick={connectUnisatWallet}>
                <img className="mb-[14px]" src={unisat} alt="" />
                <div className="mb-[18px] text-[24px] text-left">Unisat</div>
                <div className="w-[28px] h-[20px] text-[14px] border rounded-[1.5rem] flex items-center justify-center">
                  {">"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuthState() {
  const authContext = useContext(AuthContext);

  return authContext;
}
