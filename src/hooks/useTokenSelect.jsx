import React, { useEffect, useReducer, useState, useRef } from "react";
import { getBalanceApi, getWhitelistApi, poolTokenListApi, tokenListApi } from "../utils/apiRoutes";
import useFetch from "./useFetch";
import { API_KEY, defaultToken, isStringEqual } from "../utils/constants";
import axios from 'axios';


export function useTokenSelect(address) {

  const [tokenOne, setTokenOne] = useState(null);
  const [tokenTwo, setTokenTwo] = useState(null);
  const [tokenList, setTokenList] = useState([]);//useFetch(address != undefined? tokenListApi + address : tokenListApi, { method: 'get' })
  const [poolTokenList, setPoolTokenList] = useState([]);//useFetch(address != undefined? poolTokenListApi + address : poolTokenListApi, { method: 'get' })
  const [poolTokenLists, setPoolTokenLists] = useState([])
  const [tokenSelectList, setTokenSelectList] = useState([[], [], []]);

  // Declare arrayAll and arrayPoolTokens as state variables
  const [arrayAll, setArrayAll] = useState([{ tick: "BTC", balance: 0 }, { tick: "BZFI", balance: 0 }, { tick: "ORDI", balance: 0 }, { tick: "SATS", balance: 0 }, { tick: "MUBI", balance: 0 }, { tick: "TRAC", balance: 0 }]);
  const [arrayPoolTokens, setArrayPoolTokens] = useState([{ tick: "BTC", balance: 0 }, { tick: "BZFI", balance: 0 }, { tick: "ORDI", balance: 0 }, { tick: "SATS", balance: 0 }, { tick: "MUBI", balance: 0 }, { tick: "TRAC", balance: 0 }]);
  const [isUpdate, setUpdate] = useState(false);

  useEffect(() => {
    setArrayAll(prev => [prev[0], prev[1], prev[2], prev[3], prev[4], prev[5], ...tokenList])
    setArrayPoolTokens(prev => [prev[0], prev[1], prev[2], prev[3], prev[4], prev[5], ...tokenList])
  }, [tokenList, poolTokenList])

  useEffect(() => {
    const getTokenList = async () => {
      const config = {
        method: 'get',
        url: 'https://open-api.unisat.io/v1/indexer/brc20/list',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${API_KEY}` // Replace YOUR_API_KEY with your actual API key
        }
      };
      let response = await axios(config);
      if (response && response.status == 200) {
        let ticks = response.data.data.detail;
        let tickList = [];
        for (let tick of ticks) {
          if (tick.toUpperCase() == 'BZFI' || tick.toUpperCase() === 'ORDI' || tick.toUpperCase() === 'SATS' ||
            tick.toUpperCase() === 'MUBI' || tick.toUpperCase() === 'TRAC') {
            continue;
          }
          let data = { tick: tick, balance: 0 }
          tickList.push(data);
        }
        console.log("tokenList", tickList);
        setTokenList(tickList);
        setUpdate(!isUpdate);
      }
    }
    setTokenOne(arrayAll[0])
    getTokenList();
  }, [])

  useEffect(() => {
    const getBalance = async () => {
      const bal = await window.unisat.getBalance()
      let prevArray = [...arrayAll];
      if (prevArray && prevArray.length > 0) {
        prevArray[0].balance = bal.confirmed / 1e8;
        for (let index = 1; index < prevArray.length; index++) {
          let tick = prevArray[index];
          const config_balance = {
            method: 'get',
            url: `https://open-api.unisat.io/v1/indexer/address/${address}/brc20/${tick.tick}/info`,
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${API_KEY}` // Replace YOUR_API_KEY with your actual API key
            }
          };
          let response_balance = await axios(config_balance);
          if (response_balance && response_balance.status == 200) {
            let overallBalance = response_balance.data.data.overallBalance;
            tick.balance = Number(overallBalance);
          }
        }
        setArrayAll(prevArray)
      };
      setArrayPoolTokens(prevArray => {
        prevArray[0].balance = bal.confirmed / 1e8;
        return [...prevArray];
      });
    }
    if (address != undefined && address) {
      getBalance()
      // setPoolTokenList()
      // setTokenList()  
    }
  }, [address, isUpdate])

  useEffect(() => {
    try {
      let array = [];
      let array2 = [];

      if (arrayAll && arrayAll.length > 0) {

        array.push(arrayAll.filter((token) => !isStringEqual(token, tokenTwo)))
        array.push(arrayAll.filter((token) => !isStringEqual(token, tokenOne)))

        array2.push(arrayPoolTokens.filter((token) => !isStringEqual(token, tokenTwo)))
        array2.push(arrayPoolTokens.filter((token) => !isStringEqual(token, tokenOne)))

        setTokenSelectList([...array]);
        setPoolTokenLists([...array2]);
      }
    } catch (error) {
      console.log("Type Error", error);
    }

  }, [tokenOne, tokenTwo, arrayAll, arrayPoolTokens])

  useEffect(() => {
    try {
      if (arrayAll && arrayAll.length > 0) {
        if (tokenOne) {
          const res = (arrayAll.filter((token) => isStringEqual(token, tokenOne)))
          setTokenOne(res[0])
        }
        if (tokenTwo) {
          const res = (arrayAll.filter((token) => isStringEqual(token, tokenTwo)))
          setTokenTwo(res[0])
        }
      }
    } catch (error) {
      console.log("Type Error2", error);
    }
  }, [arrayAll])

  return [tokenList, tokenSelectList, poolTokenLists, tokenOne, tokenTwo, setTokenOne, setTokenTwo]
}
