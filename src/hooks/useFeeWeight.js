import React, { useEffect, useReducer, useState, useRef } from "react";
import { getVaultAddressApi, getWeightApi, poolListApi, tokenListApi } from "../utils/apiRoutes";
import useFetch from "./useFetch";


export function useFeeWeight() {

  const [feeWeightList, fetchData] = useFetch(getWeightApi);

  const calculateFee = (feeRate, _feeWeightList = feeWeightList) => {
    if (_feeWeightList) {
      const {
        create_pool_static_fee, create_pool_dynamic_fee,
        add_liquidity_static_fee, add_liquidity_dynamic_fee,
        remove_liquidity_static_fee, remove_liquidity_dynamic_fee,
        swap_static_fee, swap_dynamic_fee, withdraw_btc_dynamic_fee, withdraw_btc_static_fee
      } = _feeWeightList;

      return {
        create_pool_fee: Number(create_pool_static_fee) + Number(feeRate * create_pool_dynamic_fee),
        add_liquidity_fee: Number(add_liquidity_static_fee) + Number(feeRate * add_liquidity_dynamic_fee),
        remove_liquidity_fee: Number(remove_liquidity_static_fee) + Number(feeRate * remove_liquidity_dynamic_fee),
        swap_fee: Number(swap_static_fee) + Number(feeRate * swap_dynamic_fee),
        withdraw_fee: Number(withdraw_btc_static_fee) + Number(feeRate * withdraw_btc_dynamic_fee)
      }
    }
    else return null;
  }

  return [feeWeightList, fetchData, calculateFee];
}