import { useEffect, useState } from "react";
import { swapAmountApi } from "../utils/apiRoutes";
import useFetch from "./useFetch";

export default function useTokenTwoAmount(tokenOne, tokenTwo, tokenOneAmount, currentPool) {
  const [response, fetchData, error, loading] = useFetch(swapAmountApi, {}, false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const func = async () => {
      if (tokenOne && tokenTwo && tokenOneAmount && currentPool) {
        const res = await getResult();
        if (res.status == 'ok') {
          setResult(res.data);
          // console.log('useTokenTwoAmount :>> ', res.data);
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
  }, [tokenOne, tokenTwo, tokenOneAmount, currentPool])
  const getResult = async () => {
    const body = {
      in_token: tokenOne.ticker,
      out_token: tokenTwo.ticker,
      lp_token: currentPool.lp_token,
      in_token_amount: tokenOne.ticker === "BTC"? Number(tokenOneAmount * 1e8): Number(tokenOneAmount),
    }
    const data = await fetchData({ method: 'post', data: body });
    return data;

  }

  return [result, getResult]

}
