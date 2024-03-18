import React, { useRef, useEffect, useState } from 'react'
import axios from 'axios';

import { getPoolByTokenPairApi } from '../utils/apiRoutes';


export default function useGetPool(tokenOne, tokenTwo) {
  const [tokenPairs, setTokenPair] = useState([])
  const [currentPool, setCurrentPool] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const tokenPair = [tokenOne, tokenTwo];
    if (tokenPair.length < 2) return;
    let componentMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`${getPoolByTokenPairApi}?token1=${tokenPair[0].ticker}&token2=${tokenPair[1].ticker}`)
        if (componentMounted && data.status == 'ok') {
          setCurrentPool(data.data)
          return;
        }
        setCurrentPool(null);
        setError(data.description);
      } catch (err) {
        setLoading(false);
        setError(err);
        setCurrentPool(null);
      }
      finally {
        setLoading(false)
      }
    }
    fetchData()
    return () => {
      componentMounted = false;
    }
  }, [tokenOne, tokenTwo])

  useEffect(() => {
    setTokenPair([tokenOne, tokenTwo]);
    // console.log('tokenpair changed!!!!');
  }, [tokenOne, tokenTwo])

  return [setTokenPair, currentPool, loading, error,]
}