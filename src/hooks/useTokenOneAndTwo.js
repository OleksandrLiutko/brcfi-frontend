import { useEffect, useState } from "react";
import { removeLiquidityAmountApi, swapAmountApi } from "../utils/apiRoutes";
import useFetch from "./useFetch";

export default function useTokenOneAndTwo(lPAmount, tokenOne, tokenTwo, lPToken) {
  const [response, fetchData, error, loading] = useFetch(removeLiquidityAmountApi, {}, false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const func = async () => {
      if (tokenOne && tokenTwo && lPToken && lPAmount) {
        const res = await getResult();
        if (res.status == 'ok') {
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
  }, [tokenOne, tokenTwo, lPToken, lPAmount])

  const getResult = async () => {
    const body = {
      token1: tokenOne.ticker,
      token2: tokenTwo.ticker,
      lp_token: lPToken.ticker,
      lp_token_amount: Number(lPAmount),
    }
    const data = await fetchData({ method: 'post', data: body });
    return data;

  }

  return [result, getResult]

}
