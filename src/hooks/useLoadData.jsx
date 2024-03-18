import React, { useEffect, useReducer, useState, useRef } from "react";
import { getPoolBalanceListApi, getVaultAddressApi, poolListApi } from "../utils/apiRoutes";
import useFetch from "./useFetch";


export function useLoadData(address) {

  const [factoryWallet] = useFetch(getVaultAddressApi)
  const [poolList, fetchPoolList] = useFetch(address ? `${getPoolBalanceListApi}?address=${address}` : poolListApi);

  useEffect(() => {
    if (address != undefined && address) {
      fetchPoolList()
    }
  }, [address])

  return [factoryWallet, poolList]
}
