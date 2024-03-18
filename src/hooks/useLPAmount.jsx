import { useEffect, useState } from "react";
import { addLiquidityAmountApi } from "../utils/apiRoutes";
import useFetch from "./useFetch";

export default function useLPAmount(tokenOne, tokenTwo, tokenOneAmount, tokenTwoAmount, currentPool) {

  const [response, fetchData, error, loading] = useFetch(addLiquidityAmountApi, {}, false);
  const [result, setResult] = useState(null);

  useEffect(() => {

    const func = async () => {
      if (tokenOne && tokenTwo && tokenOneAmount && tokenTwoAmount && currentPool) {
        const res = await getResult();
        if (res.status == 'success') {
          setResult(res.data);
          return;
        }
      }
      setResult(null)
    }

    const timer = setTimeout(() => {
      func();
    }, 1000);

    return () => {
      clearTimeout(timer);
    }

  }, [tokenOne, tokenTwo, tokenOneAmount, tokenTwoAmount, currentPool])

  const getResult = async () => {
    const body = {
      token1: tokenOne.tick,
      token2: tokenTwo.tick,
      lp_token: currentPool.lp_token,
      token_amount1: tokenOne.tick === "BTC"? Number(tokenOneAmount * 1e8): Number(tokenOneAmount),
      token_amount2: tokenTwo.tick === "BTC"? Number(tokenTwoAmount * 1e8): Number(tokenTwoAmount),
    }
    const data = await fetchData({ method: 'post', data: body });
    // console.log('useLPAmount :>> ', data);
    return data;

  }

  return [result, getResult]

}