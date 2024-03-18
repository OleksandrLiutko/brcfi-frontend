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
  }, [tokenOne, tokenTwo, lPToken, lPAmount])

  const getResult = async () => {
    const body = {
      token1: tokenOne.tick,
      token2: tokenTwo.tick,
      lp_token: lPToken.tick,
      lp_token_amount: Number(lPAmount),
    }
    const data = await fetchData({ method: 'post', data: body });
    return data;

  }

  return [result, getResult]

}