import React, { useState } from "react";
import Pagination from "../components/Pagination";
import NFTItem from "../components/NFTItem";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { useResponsiveView } from "../utils/customHooks";

import { NFT_DATA } from "../assets/data";

import tableImage1 from "../assets/images/table-image1.png";
import tableImage2 from "../assets/images/table-image2.png";
import tableImage3 from "../assets/images/table-image3.png";
import tableImage4 from "../assets/images/table-image4.png";

import coverImage from "../assets/images/cover.png";
import nftImage from "../assets/images/nft-image.png";
import searchIcon from "../assets/icons/search.svg";
import bitcoin from "../assets/icons/bitcoin.svg";
import cartIcon from "../assets/icons/cart.svg";
import listingsIcon from "../assets/icons/listings.svg";
import offerIcon from "../assets/icons/offer.svg";
import transferIcon from "../assets/icons/transfer.svg";

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Filler);
const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top",
        },
    },
};

const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const data = {
    labels,
    datasets: [
        {
            data: [
                177, 171, 160, 147, 130, 177, 171, 160, 147, 277, 271, 260, 247, 230, 277, 271, 260,
                247, 230, 250, 265, 250, 265, 277, 271, 260, 247, 230, 250, 265, 130, 150, 165, 150,
                165, 177, 171, 160, 147, 130, 150, 165,
            ],
            backgroundColor: "#FFAA1B",
            // fill: true,

            type: "bar",
            lineTension: 1,
        },
        {
            type: "line",
            data: [
                277, 271, 260, 247, 230, 277, 271, 260, 177, 171, 160, 147, 130, 177, 171, 160, 147,
                130, 150, 165, 150, 165, 177, 171, 160, 147, 130, 150, 165, 247, 230, 250, 265, 250,
                265, 277, 271, 260, 247, 230, 250, 265,
            ],
            borderColor: "#6900ff",

            lineTension: 1,
        },
    ],
};

const tableData = [
    {
        id: 1,
        collected: "Phasellus",
        no: "12345678",
        quantity: 1,
        from: "yatseen.eth",
        to: "steddy.eth",
        time: "21 Hours Ago",
        img: tableImage1,
    },
    {
        id: 2,
        collected: "Aenean sodales",
        no: "12345678",
        quantity: 1,
        from: "yatseen.eth",
        to: "steddy.eth",
        time: "21 Hours Ago",
        img: tableImage2,
    },
    {
        id: 3,
        collected: "Duis et purus",
        no: "12345678",
        quantity: 1,
        from: "yatseen.eth",
        to: "steddy.eth",
        time: "21 Hours Ago",
        img: tableImage3,
    },
    {
        id: 4,
        collected: "Nullam non",
        no: "12345678",
        quantity: 1,
        from: "yatseen.eth",
        to: "steddy.eth",
        time: "21 Hours Ago",
        img: tableImage4,
    },
    {
        id: 5,
        collected: "Aenean sodales",
        no: "12345678",
        quantity: 1,
        from: "yatseen.eth",
        to: "steddy.eth",
        time: "21 Hours Ago",
        img: tableImage1,
    },
    {
        id: 6,
        collected: "Duis et purus",
        no: "12345678",
        quantity: 1,
        from: "yatseen.eth",
        to: "steddy.eth",
        time: "21 Hours Ago",
        img: tableImage2,
    },
    {
        id: 7,
        collected: "Nullam non",
        no: "12345678",
        quantity: 1,
        from: "yatseen.eth",
        to: "steddy.eth",
        time: "21 Hours Ago",
        img: tableImage3,
    },
    {
        id: 8,
        collected: "Phasellus",
        no: "12345678",
        quantity: 1,
        from: "yatseen.eth",
        to: "steddy.eth",
        time: "21 Hours Ago",
        img: tableImage1,
    },
    {
        id: 9,
        collected: "Yomo lopo",
        no: "12345678",
        quantity: 1,
        from: "yatseen.eth",
        to: "steddy.eth",
        time: "21 Hours Ago",
        img: tableImage4,
    },
];

function NFTCollection() {
    const [collectionState, setCollectionState] = useState(1);
    const isMobileView_700 = useResponsiveView(700);

    return (
        <section className="nft__collection__container">
            <figure className="cover">
                <img src={coverImage} alt="cover" />
            </figure>

            <section className="nft__collection__content">
                <section className="nft__collection__detail glass-effect">
                    <header>
                        <figure>
                            <img src={nftImage} alt="nft image" />
                        </figure>

                        <div>
                            <h4>Ey3k0n First Edition</h4>
                            <p>Inscriptions #383632-551340</p>
                        </div>
                    </header>

                    <p className="collection__detail">
                        Created: <strong>Apr 2022</strong> Creator earnings: <strong>5%</strong>{" "}
                        Chain: <strong>Bitcoin</strong> Category: <strong>Virtual Worlds</strong>
                    </p>

                    <p className="collection__about">
                        Ut quis turpis eget justo scelerisque tincidunt. Nulla facilisi. Nunc sed mi
                        a augue pretium feugiat. Integer sagittis aliquam eros, id pharetra sapien
                        ultrices vel. Morbi cursus dui odio, id tempor ex imperdiet sed. Ut sodales
                        ex ac ex sodales, ut mattis lorem porttitor. Morbi quis sem tellus.
                    </p>

                    <div className="collection__stats">
                        <div className="block">
                            <h4>
                                0.01888877 <img src={bitcoin} alt="bitcoin" />
                            </h4>
                            <p>Floor Price</p>
                        </div>
                        <div className="block">
                            <h4>Sale </h4>
                            <p>1887</p>
                        </div>
                        <div className="block">
                            <h4>
                                0.114249 <img src={bitcoin} alt="bitcoin" />
                            </h4>
                            <p>24 HR Volume</p>
                        </div>
                        <div className="block">
                            <h4>
                                2.595848
                                <img src={bitcoin} alt="bitcoin" />
                            </h4>
                            <p>All-Time Volume</p>
                        </div>
                        <div className="block">
                            <h4>952</h4>
                            <p>Listed</p>
                        </div>
                        <div className="block">
                            <h4>9904</h4>
                            <p>Supply</p>
                        </div>
                    </div>
                </section>

                <div className="nft__collection__actions">
                    <div className="tab__group">
                        <button
                            className={`tab__item ${collectionState === 1 ? "active" : ""}`}
                            onClick={() => setCollectionState(1)}
                        >
                            Items
                        </button>
                        <button
                            className={`tab__item ${collectionState === 2 ? "active" : ""}`}
                            onClick={() => setCollectionState(2)}
                        >
                            Activity
                        </button>
                    </div>

                    <div className="filter__group">
                        <div className="search-bar">
                            <img src={searchIcon} alt="search" />
                            <input type="text" name="search" id="search" placeholder="Search" />
                        </div>

                        <div className="select-dropdown">
                            <select name="filter" id="filter">
                                <option value="1">Price low to high</option>
                                <option value="2">Price high to low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {collectionState === 1 && (
                    <>
                        <section className="collection__list">
                            {NFT_DATA.map((item) => (
                                <NFTItem
                                    id={item.id}
                                    key={item.id}
                                    url={item.url}
                                    name={item.name}
                                    description={item.description}
                                    price={item.price}
                                />
                            ))}
                        </section>
                        <Pagination />
                    </>
                )}

                {collectionState === 2 && (
                    <section className="activity__container">
                        <aside>
                            <h4>Event Type</h4>

                            <form action="#">
                                <div className="form-entry">
                                    <label htmlFor="sales">
                                        <img src={cartIcon} alt="listing" />
                                        Sales
                                    </label>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        defaultChecked
                                    />
                                </div>

                                <div className="form-entry">
                                    <label htmlFor="sales">
                                        <img src={listingsIcon} alt="listing" />
                                        Listings
                                    </label>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        defaultChecked
                                    />
                                </div>

                                <div className="form-entry">
                                    <label htmlFor="sales">
                                        <img src={offerIcon} alt="listing" />
                                        Offers
                                    </label>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        defaultChecked
                                    />
                                </div>

                                <div className="form-entry">
                                    <label htmlFor="sales">
                                        <img src={transferIcon} alt="listing" />
                                        Transfer
                                    </label>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        defaultChecked
                                    />
                                </div>
                            </form>
                        </aside>

                        <section className="activity__detail">
                            <div className="activity-chart">
                                <Bar options={options} data={data} />;
                            </div>

                            {isMobileView_700 ? (
                                <>
                                    {tableData.map((item) => {
                                        return (
                                            <article
                                                className="hide-desktop table__item flex gap-10 justify-between"
                                                key={item.id}
                                            >
                                                <div className="left flex justify-between flex-col ">
                                                    <div className="flex gap-8 items-center mb-4">
                                                        <img src={item.img} alt={item.collected} />
                                                        <div>
                                                            <h4 className="whitespace-nowrap">
                                                                {item.collected}
                                                            </h4>
                                                            <p>{item.no}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-16 items-center justify-between">
                                                        <div>
                                                            <span>From</span>
                                                            <p>{item.from}</p>
                                                        </div>
                                                        <div>
                                                            <span>To</span>
                                                            <p>{item.to}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="right grid justify-between items-end">
                                                    <div className="flex gap-4 self-center">
                                                        <h4>Qty</h4>
                                                        <span>{item.quantity}</span>
                                                    </div>
                                                    <div>
                                                        <span>Time</span>
                                                        <p>{item.time}</p>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                                    <Pagination justPageNumbers={true} />
                                </>
                            ) : (
                                // <article className="hide-desktop table__item flex gap-10 justify-between">
                                //     <div className="left flex justify-between flex-col ">
                                //         <div className="flex gap-14 items-center mb-4">
                                //             <img src={tableImage1} alt="" />
                                //             <div>
                                //                 <h4>Phasellus</h4>
                                //                 <p>1245698</p>
                                //             </div>
                                //         </div>

                                //         <div className="flex gap-16 items-center justify-between">
                                //             <div>
                                //                 <span>From</span>
                                //                 <p>yatseen.eth</p>
                                //             </div>
                                //             <div>
                                //                 <span>To</span>
                                //                 <p>steddy.eth</p>
                                //             </div>
                                //         </div>
                                //     </div>

                                //     <div className="right grid justify-between items-end">
                                //         <div className="flex gap-4 self-center">
                                //             <h4>Qty</h4>
                                //             <span>1</span>
                                //         </div>
                                //         <div>
                                //             <span>Time</span>
                                //             <p>21 Hours Ago</p>
                                //         </div>
                                //     </div>
                                // </article>
                                <div className="activity-table table__container">
                                    <div className="table__content overflow-x-auto w-full">
                                        <table className="table w-full">
                                            {/* head */}
                                            <thead>
                                                <tr>
                                                    <th>Collected</th>
                                                    <th>Quantity</th>
                                                    <th>From</th>
                                                    <th>To</th>
                                                    <th>Time</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {/* row 1 */}
                                                {tableData.map((item, i) => {
                                                    return (
                                                        <tr
                                                            className={`${i === 0 ? "active" : ""}`}
                                                            key={item.id}
                                                        >
                                                            <td>
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="avatar">
                                                                        <div className="mask mask-squircle w-22 h-22">
                                                                            <img
                                                                                src={item.img}
                                                                                alt={item.collected}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-bold">
                                                                            {item.collected}
                                                                        </div>
                                                                        <div className="">
                                                                            {item.no}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>{item.quantity}</td>
                                                            <td>{item.from}</td>
                                                            <td>{item.to}</td>
                                                            <td>{item.time}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>

                                        <Pagination justPageNumbers={true} />
                                    </div>
                                </div>
                            )}
                        </section>
                    </section>
                )}
            </section>
        </section>
    );
}

export default NFTCollection;
