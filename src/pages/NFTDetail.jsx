import React, { useState } from "react";
import nftImage from "../assets/images/nft-image.png";
import ordinal from "../assets/icons/ordinals.svg";
import discordIcon from "../assets/icons/discord.svg";
import instaIcon from "../assets/icons/insta.svg";
import twitterIcon from "../assets/icons/twitter.svg";
import cartIcon from "../assets/icons/cart.svg";
import listingsIcon from "../assets/icons/listings.svg";
import offerIcon from "../assets/icons/offer.svg";
import transferIcon from "../assets/icons/transfer.svg";
import bitcoinIcon from "../assets/icons/bitcoin.svg";

let nftDetail = {
    name: "",
    price: "",
    url: "",
    info: "",
    activity: [],
    details: [
        {
            label: "Inscription ID",
            value: "533a9 ... 0i0",
        },
        {
            label: "Inscription Number",
            value: "50601",
        },
        {
            label: "Owner",
            value: "bc1p2 ... m62",
        },
        {
            label: "Content",
            value: "Link",
        },
        {
            label: "Sat Numebr",
            value: "1926746834596688",
        },
        {
            label: "Sat Name",
            value: "aewpvrponpp",
        },
        {
            label: "Location",
            value: "a88d2 ... 0:0",
        },
        {
            label: "Content Type",
            value: "image/png",
        },
        {
            label: "Created",
            value: "2/11/2023, 5:48:39 AM",
        },
        {
            label: "Genesis Transaction",
            value: "533a9 ... 1b0",
        },
        {
            label: "Sat Rarity",
            value: "Common",
        },
        {
            label: "Location BlockHeight",
            value: "781170",
        },
        {
            label: "Output",
            value: "a88d2 ... 0:0",
        },
    ],
};

function NFTDetail() {
    const [infoOrActivity, setInfoOrActivity] = useState(1);

    const handleChangeInfoOrActivity = (val) => setInfoOrActivity(val);

    return (
        <section className="nft__detail-container">
            <section className="info__container">
                <figure>
                    <img src={nftImage} alt="nft" />
                </figure>

                <section className="glass-effect info">
                    <h2>NFT Single List #567645</h2>
                    <p className="ordinal-value">
                        <img src={ordinal} alt="ordinal" className="icon" />
                        0.323
                    </p>

                    <div className="btn-actions justify-start">
                        <button className="d-btn d-btn-primary active">Make Offer</button>
                        <button className="d-btn d-btn-secondary active">Buy Now</button>
                    </div>

                    <div className="tab-group">
                        <button
                            className={`d-btn ${infoOrActivity === 1 ? "active" : ""}`}
                            onClick={() => handleChangeInfoOrActivity(1)}
                        >
                            Info
                        </button>
                        <button
                            className={`d-btn ${infoOrActivity === 2 ? "active" : ""}`}
                            onClick={() => handleChangeInfoOrActivity(2)}
                        >
                            Activity
                        </button>
                    </div>

                    {infoOrActivity === 1 && (
                        <section className="info__content">
                            <h4>Ey3k0n First Edition</h4>
                            <p>
                                Ut quis turpis eget justo scelerisque tincidunt. Nulla facilisi.
                                Nunc sed mi a augue pretium feugiat. Integer sagittis aliquam eros,
                                id pharetra sapien ultrices vel. Morbi cursus dui odio, id tempor ex
                                imperdiet sed. Ut sodales ex ac ex sodales, ut mattis lorem
                                porttitor. Morbi quis sem tellus.
                            </p>

                            <ul>
                                <li>
                                    <a href="#">
                                        <img src={instaIcon} alt="insta" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <img src={twitterIcon} alt="twitter" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <img src={discordIcon} alt="discord" />
                                    </a>
                                </li>
                            </ul>
                        </section>
                    )}

                    {infoOrActivity === 2 && (
                        <section className="activity__content">
                            <ul className="menu menu-horizontal px-1">
                                <li tabIndex={0}>
                                    <a>
                                        All Events
                                        <svg
                                            className="fill-current"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                                        </svg>
                                    </a>
                                    <ul className="submenu p-2  w-full">
                                        <li>
                                            <button>Event 1</button>
                                        </li>
                                        <li>
                                            <button>Event 2</button>
                                        </li>
                                    </ul>
                                </li>
                            </ul>

                            <ul className="events__list">
                                <li>
                                    <div>
                                        <h4>
                                            <img src={cartIcon} alt="car" />{" "}
                                            <div>
                                                Sales{" "}
                                                <p>
                                                    <img src={bitcoinIcon} alt="car" />{" "}
                                                    <span>0.25</span>
                                                </p>
                                            </div>
                                        </h4>
                                    </div>

                                    <div>
                                        <p>
                                            <span className="from">yatseen.eth</span> to{" "}
                                            <span className="to">steddy.eth</span>
                                        </p>
                                        <p>5 Days ago</p>
                                    </div>
                                </li>

                                <li>
                                    <div>
                                        <h4>
                                            <img src={listingsIcon} alt="car" />
                                            <div>
                                                Listings
                                                <p>
                                                    <img src={bitcoinIcon} alt="car" />{" "}
                                                    <span>0.25</span>
                                                </p>
                                            </div>
                                        </h4>
                                    </div>
                                    <div>
                                        <p>
                                            <span className="from">yatseen.eth</span> to{" "}
                                            <span className="to">steddy.eth</span>
                                        </p>
                                        <p>5 Days ago</p>
                                    </div>
                                </li>

                                <li>
                                    <div>
                                        <h4>
                                            <img src={offerIcon} alt="car" />
                                            <div>
                                                Offer
                                                <p>
                                                    <img src={bitcoinIcon} alt="car" />{" "}
                                                    <span>0.25</span>
                                                </p>{" "}
                                            </div>
                                        </h4>
                                    </div>
                                    <div>
                                        <p>
                                            <span className="from">yatseen.eth</span> to{" "}
                                            <span className="to">steddy.eth</span>
                                        </p>
                                        <p>5 Days ago</p>
                                    </div>
                                </li>

                                <li>
                                    <div>
                                        <h4>
                                            <img src={transferIcon} alt="car" />{" "}
                                            <div>
                                                Transfer
                                                <p>
                                                    <img src={bitcoinIcon} alt="car" />{" "}
                                                    <span>0.25</span>
                                                </p>{" "}
                                            </div>
                                        </h4>
                                    </div>
                                    <div>
                                        <p>
                                            <span className="from">yatseen.eth</span> to{" "}
                                            <span className="to">steddy.eth</span>
                                        </p>
                                        <p>5 Days ago</p>
                                    </div>
                                </li>
                            </ul>
                        </section>
                    )}
                </section>
            </section>

            <section className="detail__container">
                <h3>Details</h3>
                <ul>
                    {nftDetail.details.map((item) => (
                        <li key={item.label}>
                            <h6 className="label">{item.label}</h6>
                            <h4 className="value">{item.value}</h4>
                        </li>
                    ))}
                </ul>
            </section>
        </section>
    );
}

export default NFTDetail;
