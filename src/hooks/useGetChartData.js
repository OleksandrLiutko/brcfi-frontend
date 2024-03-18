import React, { useRef, useEffect, useState } from 'react'
import axios from 'axios';
import { dayilyURL, monthlyURL, weeklyURL, yearlyURL } from '../utils/apiRoutes';

export default function useGetChartData() {

  const [chartData, setChartData] = useState(null);

  const loadData = async () => {
    const array = [];
    const dayData = await axios.get(dayilyURL);
    const weekData = await axios.get(weeklyURL);
    const monthData = await axios.get(monthlyURL);
    const yearData = await axios.get(yearlyURL);
    array.push(dayData.data.prices)
    array.push(weekData.data.prices)
    array.push(monthData.data.prices)
    array.push(yearData.data.prices)

    setChartData(array)
  }

  useEffect(() => {
    loadData();
  }, [])

  return [chartData];
}