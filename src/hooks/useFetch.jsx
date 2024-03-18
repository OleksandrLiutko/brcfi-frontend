import { useEffect, useState } from 'react'
import axios from 'axios';

/**
 * @function useFetch
 * @description React Hook to call apis on load with Fetch .
 *       componentMounted flag to avaoid memory leak
 * @param {string} url
 * @param {Object} firstConfig
 * @returns {Object} { response, error, loading }
 * @author Sarat Chandra Ejjapureddi
 * @example data = useFetch('<url>')
 */
export default function useFetch(url, firstConfig = { method: 'GET' }, firstLoad = true) {
  const [response, setResponse] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!firstLoad) return;

    fetchData(firstConfig)
  }, [])

  const fetchData = async (config) => {
    try {
      setLoading(true);
      const res = await axios(url, config);
      setResponse(res.data.data)
      return res.data
    } catch (err) {
      setLoading(false)
      setError(err)
    }
    finally {
      setLoading(false)
    }
    return { status: 'failed' }
  }

  return [response, fetchData, error, loading]
}