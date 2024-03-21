import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

import BitcoinIcon from "../assets/images/rocket.png";

import ratioIcon from "../assets/icons/ratio.svg";
import oridnals from "../assets/icons/ordinals.svg";
import ExchangeIcon from "../assets/icons/ExchangeIcon";
import LinkIcon from "../assets/icons/LinkIcon";
import ExcahngeIcon from "../assets/icons/swap-icon.svg";
import LiquidityIcon from "../assets/icons/liquidity-icon.svg";
import PoolIcon from "../assets/icons/pool-icon.svg";
import OrdiIcon from "../assets/icons/ordi-icon.svg";

// import PoolIcon from "../assets/icons/PoolIcon";
import NFTIcon from "../assets/icons/NFTIcon";
import { Link } from "react-router-dom";
import { dayilyData } from "../utils/chartdata";
import { formatTime } from "../utils/constants";
import useGetURL from "../hooks/useGetChartData";
import useGetChartData from "../hooks/useGetChartData";
import Modal from "../components/Modal";
import LPIcon from "../assets/icons/LPIcon";
import RightArrow from "../assets/icons/RightArrow";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);
const options = {
    responsive: true,
    scales: {
        x: {
            display: false,
        },
        y: {
            display: false,
        },
    },
};
// const periods = ['DAY', 'WEEK', 'MONTH', 'YEAR'];
const periods = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

const labels = ["January", "February", "March", "April", "May", "June", "July"];
const defaultData = {
    labels,
    datasets: [
        {
            data: [0, 0, 0, 0, 0, 0, 0],
            borderColor: "#448AFF",
            // backgroundColor: "rgb(105, 0, 255,0.3)",
            // fill: true,

            fill: "start",
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                gradient.addColorStop(0, "#448AFF");
                gradient.addColorStop(1, "#448AFF10");
                return gradient;
            },
            lineTension: 1,
        },
    ],
};

function Dashboard() {
    const [period, setPeriod] = useState(0);
    const [chartData] = useGetChartData();

    const [reactChartData, setReactChartData] = useState(defaultData);

    const [currentPrice, setCurrentPrice] = useState('$0.00');
    const [percent, setPercent] = useState('0.00%');
    const [negativePercent, setNegativePercent] = useState(false)
    useEffect(() => {
        if (!chartData) return
        const labels = chartData[period].map((row) => formatTime(row[0]))
        const data = {
            labels,
            datasets: [
                {
                    data: chartData[period].map((row) => row[1]),
                    borderColor: "#F7931A", //"#448AFF",
                    fill: "start",
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                        gradient.addColorStop(0, "#448AFF");
                        gradient.addColorStop(1, "#448AFF10");
                        // gradient.addColorStop(0, "rgba(168, 85, 247, 0.32)")
                        // gradient.addColorStop(1, "rgba(168, 85, 247, 0.16)")
                        // gradient.addColorStop(2, "rgba(0, 0, 0, 0)")

                        // background: linear-gradient(180deg, rgba(168, 85, 247, 0.32) 0%, rgba(168, 85, 247, 0.16) 0.01%, rgba(0, 0, 0, 0) 100.07%);

                        return gradient;
                    },
                    lineTension: 0.4,
                },
            ],
        };
        setReactChartData(data)
        const current = chartData[0].slice(-1)[0][1].toFixed(2);
        const start = chartData[period][0][1].toFixed(2);
        const pro = 100 * (current - start) / start;
        setCurrentPrice('$' + current);
        const negative = pro >= 0 ? '+': '';
        setNegativePercent(pro < 0)
        setPercent(negative + pro.toFixed(2) + '%')
    }, [chartData, period]);
    return (
        <section className="dashboard__container flex flex-col gap-y-10">
            <h1>Dashboard</h1>
            {/* <p>Buy, Trade, Hold, Lend, Borrow, Explore and Launch on BrcFi</p> */}

            <section className="cards__container">
                <Link to="/swap" className="card glass-effect">
                    <div className="flex items-center exchange-icon">
                        {/* <ExchangeIcon /> */}
                        <img src={ExcahngeIcon} />
                        <h3>Swap</h3>
                    </div>
                    <RightArrow />
                    {/* <div className="text-[24px] leading-[24px] text-[#6F767E]">{'->'}</div> */}
                </Link>

                <Link to="/Liquidity" className="card glass-effect">
                    <div className="flex items-center swap-icon">
                        {/* <img src={BitcoinIcon} width={40} height={40}/> */}
                        <img src={LiquidityIcon} />
                        <h3>Liquidity</h3>
                    </div>
                    <RightArrow />
                    {/* <div className="text-[24px] text-[#6F767E]">{'->'}</div> */}
                </Link>
                <Link to={"/pool"} className="card glass-effect">
                    <div className="flex items-center pool-icon">
                        {/* <LPIcon /> */}
                        <img src={PoolIcon} />
                        <h3>Pool</h3>
                        
                    </div>
                    <RightArrow />
                    {/* <div className="text-[31px] text-[#6F767E]">{'->'}</div> */}
                </Link>
            </section>

            <section className="content">
                <article className="content__detail glass-effect">
                    <header>
                        <div className="left">
                            <img className="w-[56px] h-[56px]" src={OrdiIcon} />
                            <div className="flex flex-col justify-center">
                                <h3 className="p-[2px]">ORDI</h3>
                                <p className="p-[2px]">Market Capped at 60.00 USD</p>
                            </div>
                        </div>

                        <div className="items-center btn-group btn-group-vertical lg:btn-group-horizontal lg:round-[32px]">
                            {periods.map((item, index) => (
                                <button
                                    className={`time-btn bg-[#F7931A] round-[32px] ${index == period && 'btn-active'}`}
                                    key={item}
                                    onClick={() => { setPeriod(index) }}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </header>

                    {/* <div className="absolute top-[25px] md:ml-[45%] ml-[30px] text-center">
                        <div className="md:text-[24px] text-[14px]">ORDI</div>
                        <div className="md:text-[32px] text-[20px] font-medium">{currentPrice}</div>
                        {negativePercent && <div className="md:text-[18px] text-[12px] text-[#D74136]">{percent}</div>}
                        {!negativePercent && <div className="md:text-[18px] text-[12px] text-[#3BDC68]">{percent}</div>}
                    </div> */}

                    <Line className="chart" options={options} data={reactChartData} />
                </article>
            </section>
        </section>
    );
}

export default Dashboard;
