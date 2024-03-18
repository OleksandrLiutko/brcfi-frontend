import React, { useState } from "react";
import arrowDown from "../assets/icons/arrowDown.svg";
import ordinals from "../assets/icons/ordinals.svg";
import DataList from "../components/DataList";
import { searchOptions } from "../assets/data";
import ExchangeSwap from "../components/ExchangeSwap";
function Swap() {
    // SELECT TOKEN 1
    const [toggleDataList, setToggleDataList] = useState(false);
    const [selectedOption, setSelectedOption] = useState({
        value: "ORDI",
        icon: ordinals,
    });

    const handleToggleDataList = (e) => {
        e.preventDefault();
        setToggleDataList((prevState) => !prevState);
    };

    const handleDataListBlur = (e) => {
        e.stopPropagation();
        setTimeout(() => {
            setToggleDataList(false);
        }, 100);
    };

    // SELECT TOKEN 2
    const [toggleDataList2, setToggleDataList2] = useState(false);
    const [selectedOption2, setSelectedOption2] = useState({
        value: "Select a token",
        icon: null,
    });

    const handleToggleDataList2 = (e) => {
        e.preventDefault();
        setToggleDataList2((prevState) => !prevState);
    };

    const handleDataListBlur2 = (e) => {
        e.stopPropagation();
        setTimeout(() => {
            setToggleDataList2(false);
        }, 100);
    };
    return (
        <section className="exchange__container">
            <ExchangeSwap />
            {/* <form className="swap__form glass-effect center-margin">
                <h2>Swap</h2>
                <p>Trade tokens in an instant</p>
                <div className={`exchange__select`}>
                    <div>
                        <p>From</p>
                        <input type="text" className="value" defaultValue={"0.0"} />
                    </div>

                    <section className="datalist__wrapper">
                        <button className={"bordered"} onClick={handleToggleDataList}>
                            {!!selectedOption.icon && (
                                <img src={selectedOption.icon} alt="" className="icon" />
                            )}
                            {selectedOption.value}
                            <svg
                                className="fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                            >
                                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                            </svg>
                        </button>

                        {toggleDataList && (
                            <DataList
                                options={searchOptions}
                                handleBlur={handleDataListBlur}
                                handleOptionClick={setSelectedOption}
                            />
                        )}
                    </section>
                </div>

                <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="center-margin"
                >
                    <g id="Complete">
                        <g id="arrow-down">
                            <g>
                                <polyline
                                    data-name="Right"
                                    fill="none"
                                    id="Right-2"
                                    points="7 16.4 12 21.5 17 16.4"
                                    stroke="inherit"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />

                                <line
                                    fill="none"
                                    stroke="inherit"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    x1="12"
                                    x2="12"
                                    y1="2.5"
                                    y2="19.2"
                                />
                            </g>
                        </g>
                    </g>
                </svg>

                <div className={`exchange__select`}>
                    <div>
                        <p>to</p>
                        <input type="text" className="value" defaultValue={"0.0"} />
                    </div>

                    <section className="datalist__wrapper">
                        <button className={"filled"} onClick={handleToggleDataList2}>
                            {!!selectedOption2.icon && (
                                <img src={selectedOption2.icon} alt="" className="icon" />
                            )}
                            {selectedOption2.value}
                            <svg
                                className="fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                            >
                                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                            </svg>
                        </button>

                        {toggleDataList2 && (
                            <DataList
                                options={searchOptions}
                                handleBlur={handleDataListBlur2}
                                handleOptionClick={setSelectedOption2}
                            />
                        )}
                    </section>
                </div>

                <button className="d-btn d-btn-primary center-margin active">Connect Wallet</button>
            </form> */}
        </section>
    );
}

export default Swap;
