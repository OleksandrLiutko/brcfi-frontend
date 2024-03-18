import React, { useEffect, useReducer, useState, useRef } from "react";
import { getVaultAddressApi, getWeightApi, poolListApi, tokenListApi } from "../utils/apiRoutes";
import useFetch from "./useFetch";


export function useLoadData(address) {

  const [factoryWallet] = useFetch(getVaultAddressApi)
  const [poolList, fetchPoolList] = useFetch(address? poolListApi + address : poolListApi);

  useEffect(() => {
    if(address != undefined && address) {
      fetchPoolList()
    }
  }, [address])

  return [factoryWallet, poolList]
}