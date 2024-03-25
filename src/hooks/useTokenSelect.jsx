import React, { useEffect, useReducer, useState, useRef } from "react";
import { getBalanceApi, getWhitelistApi, getPoolTokenListApi, getTokenListApi, getTokenBalanceListApi } from "../utils/apiRoutes";
import useFetch from "./useFetch";
import { API_KEY, defaultToken, isStringEqual } from "../utils/constants";
import axios from 'axios';


export function useTokenSelect(address) {

  const [tokenOne, setTokenOne] = useState(null);
  const [tokenTwo, setTokenTwo] = useState(null);
  
  const [tokenList, fetchTokenList] = useFetch(getTokenListApi, { method: 'get' })
  const [poolTokenList, fetchPoolTokenList] = useFetch(getPoolTokenListApi, { method: 'get' })
  const [tokenBalanceList, fetchTokenBalanceList] = useFetch(`${getTokenBalanceListApi}?address=${address}`, { method: "get" })

  const [poolTokenLists, setPoolTokenLists] = useState([])
  const [tokenSelectList, setTokenSelectList] = useState([]);

  // Declare arrayAll and arrayPoolTokens as state variables
  const [arrayAll, setArrayAll] = useState([{ ticker: "BTC", balance: 0 }, { ticker: "BZFI", balance: 0 }, { ticker: "ORDI", balance: 0 }, { ticker: "SATS", balance: 0 }, { ticker: "MUBI", balance: 0 }, { ticker: "TRAC", balance: 0 }]);
  const [arrayPoolTokens, setArrayPoolTokens] = useState([{ ticker: "BTC", balance: 0 }, { ticker: "BZFI", balance: 0 }, { ticker: "ORDI", balance: 0 }, { ticker: "SATS", balance: 0 }, { ticker: "MUBI", balance: 0 }, { ticker: "TRAC", balance: 0 }]);

  useEffect(() => {
    if (tokenList) {
      const tmpArray = tokenList.filter(item => item !== 'BTC').map(token => {
        // const balance = tokenBalances.filter(item => item.ticker === token.ticker)
        return {ticker: token.ticker, balance: 0}
      })
      setArrayAll((prev) => [prev[0], ...tmpArray]);
    }
    if (poolTokenList && poolTokenList.length > 0) {
      const tmpArray = poolTokenList.filter(item => item !== 'BTC').map(item => {
        return {ticker: item, balance: 0}
      })
      setArrayPoolTokens((prev) => [prev[0], ...tmpArray]);
    }
  }, [tokenList, poolTokenList]);

  useEffect(() => {
    setTokenOne(arrayAll[0]);
  }, []);

  useEffect(() => {
    const getBalance = async () => {
      const bal = await window.unisat.getBalance();
      setArrayAll((prevArray) => {
        prevArray[0].balance = bal.confirmed / 1e8;
        return [...prevArray];
      });
      setArrayPoolTokens((prevArray) => {
        prevArray[0].balance = bal.confirmed / 1e8;
        return [...prevArray];
      });
    };

    if (address) {
      getBalance();
      fetchTokenList();
      fetchPoolTokenList();
      fetchTokenBalanceList();
    }
  }, [address]);

  useEffect(() => {
    let array = [];
    let array2 = [];

    array.push(arrayAll/* .filter((token) => !isStringEqual(token, tokenTwo)) */);
    array.push(arrayAll/* .filter((token) => !isStringEqual(token, tokenOne)) */);
    setTokenSelectList([...array]);

    array2.push(
      arrayPoolTokens/* .filter((token) => !isStringEqual(token, tokenTwo)) */
    );
    array2.push(
      arrayPoolTokens/* .filter((token) => !isStringEqual(token, tokenOne)) */
    );
    setPoolTokenLists([...array2]);
  }, [tokenOne, tokenTwo, arrayAll, arrayPoolTokens]);

  useEffect(() => {
    if (tokenOne) {
      const res = arrayAll.filter((token) => isStringEqual(token, tokenOne));
      setTokenOne(res[0]);
    }
    if (tokenTwo) {
      const res = arrayAll.filter((token) => isStringEqual(token, tokenTwo));
      setTokenTwo(res[0]);
    }
  }, [arrayAll]);

  useEffect(() => {
    if (tokenOne && tokenOne?.ticker === tokenTwo?.ticker) setTokenTwo(null)
  }, [tokenOne])

  useEffect(() => {
    if (tokenTwo && tokenOne?.ticker === tokenTwo?.ticker) setTokenOne(null)
  }, [tokenTwo])

  return [
    tokenList,
    tokenSelectList,
    poolTokenLists,
    tokenBalanceList,
    tokenOne,
    tokenTwo,
    setTokenOne,
    setTokenTwo,
  ];
}
