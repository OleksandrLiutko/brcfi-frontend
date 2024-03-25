import React, { useEffect, useState } from "react";
import DataList from "./DataList";
import { searchOptions } from "../assets/data";
import ordinalIcon from "../assets/icons/ordinals.svg"
import btcIcon from "../assets/icons/btc.png"
import brcfiIcon from "../assets/icons/brcfi.png"
import brpdIcon from "../assets/icons/brpd.png"
import { useResponsiveView } from "../utils/customHooks";
import { useModalState } from "../context/ModalContext";
import { useAuthState } from "../context/AuthContext";
import axios from "axios";
import { getBtcBalanceApi } from "../utils/apiRoutes";

function ExchangeSelect({
    amount,
    setAmount,
    token,
    setToken,
    list,
    tokenDataList,
    selectIcon,
    selectText,
    bordered,
    filled,
    label,
    value = true,
    disabled = false,
    inputDisabled = false,
    showBalance = false,
    ...props
}) {
    const isMobileView_500 = useResponsiveView(500);
    const { addModal, removeModal } = useModalState();
    const [toggleDataList, setToggleDataList] = useState(false);
    const [selectedOption, setSelectedOption] = useState(token ? token : { ticker: selectText, icon: ordinalIcon });
    const { unisatContext, appContext } = useAuthState()
    const { tokenBalanceList } = appContext
    const { address } = unisatContext
    const [balance, setBalance] = useState(0)


    useEffect(() => {
        if (!token)
            setSelectedOption({ ticker: selectText, icon: ordinalIcon, balance: 0 })
        else setSelectedOption(token)

        setBalance(0);
        if (token && tokenBalanceList) {
            const filter = tokenBalanceList.filter(item => (item?.ticker?.toUpperCase() === token?.ticker?.toUpperCase()))
            if (filter.length > 0) {
                setBalance(filter[0].balance)
            } else if (token.ticker === 'BTC') {
                axios.get(`${getBtcBalanceApi}?address=${address}`)
                    .then(data => {
                        setBalance(data.data.data / 1e8)
                    })
            }
        }
    }, [token, tokenBalanceList])

    const handleToggleDataList = (e) => {
        e.preventDefault();
        if (isMobileView_500 && !toggleDataList) {
            addModal();
        }
        if (isMobileView_500 && toggleDataList) {
            removeModal();
        }

        setToggleDataList(!toggleDataList);
    };

    const handleDataListBlur = (e) => {
        setTimeout(() => {
            setToggleDataList(false);
            isMobileView_500 && removeModal();
        }, 100);
    };
    
    const handleChange = (e) => {
        const isNumber = /^[-+]?(\d+|\d*\.\d+|\d+\.\d*)([eE][-+]?\d+)?$/;
        let value = e.target.value;
        if (value == '' || isNumber.test(value)) {
            if (value >= 21000000) value = '21000000';
            if (token.ticker == "BTC" && value < 1e-7 && value > 0) value = '0.00000001';
            setAmount(value);
        }
    }

    return (
        <>
            {label && <p className="!font-medium !text-[16px]">{label}</p>}
            <div className={`exchange__select relative ${!value ? "full-w" : ""}`}>
                {/* <div className="input-box"> */}
                <section
                    className="datalist__wrapper"
                    data-tooltip-id={props["data-tooltip-id"]}
                    data-tooltip-content={props["data-tooltip-content"]}
                    data-tooltip-place={props["data-tooltip-place"]}
                    data-tooltip-delay-hide={50000}
                >
                    <button
                        className={`${bordered ? "bordered" : filled ? "filled" : ""} `}
                        disabled={disabled}
                        onClick={handleToggleDataList}
                    >
                        <img src={selectedOption.ticker == 'BTC' ? btcIcon : selectedOption?.ticker?.toLowerCase() === 'BRPD'? brpdIcon : (() => {
                            const selectedItem = tokenDataList?.filter(item => item.symbol?.toLowerCase() === selectedOption?.ticker?.toLowerCase());
                            if (selectedItem && selectedItem.length > 0) {
                                // console.log(selectedItem)
                                return selectedItem[0].iconUrl + "?size=30x30";
                            }
                            return ordinalIcon;
                        })()} alt="" className="icon" style={{borderRadius: "50%"}} />
                        {selectedOption.ticker}
                        {/* {!disabled && <svg
                            className="fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                        >
                            {<path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />}
                        </svg>} */}
                    </button>
                    {
                        !disabled && <DataList
                            show={toggleDataList}
                            options={list}
                            handleBlur={handleDataListBlur}
                            setSelectedOption={setSelectedOption}
                            setToken={setToken}
                        />

                    }
                </section>
                <div className="v-bar absolute w-[1px] h-[70%] left-[30%] bg-white"></div>
                {value &&
                    <input
                        type="text"
                        className="value text-right"
                        placeholder={"0"}
                        value={amount}
                        onChange={handleChange}
                        disabled={inputDisabled}
                    />
                }
            </div>
            {token && <div className="flex justify-between">
                <p className="!font-medium !text-[14px]">Balance: {balance}</p>
                {showBalance && <button 
                    className="!font-medium !text-[14px] exchange__select_max_button px-[5px]"
                    onClick={() => setAmount(balance)}
                >
                    Max
                </button>}
            </div> }
        </>
    );
}

export default ExchangeSelect;
