import React, { useEffect, useState } from "react";
import DataList from "./DataList";
import { searchOptions } from "../assets/data";
import ordinalIcon from "../assets/icons/ordinals.svg"
import btcIcon from "../assets/icons/btc.png"
import brcfiIcon from "../assets/icons/brcfi.png"
import brpdIcon from "../assets/icons/brpd.png"
import { useResponsiveView } from "../utils/customHooks";
import { useModalState } from "../context/ModalContext";

function ExchangeSelectToken({ amount, setAmount, token, setToken, list, tokenDataList, selectIcon, selectText, bordered, filled, label, value = true, disabled = false, inputDisabled = false, ...props }) {
    console.log("list", list)
    console.log("tokenDataList", tokenDataList)
    // tokenDataList = [{
    //     balance: 0, ticker: "BTC"
    // }, 
    // ]
    const isMobileView_500 = useResponsiveView(500);
    const { addModal, removeModal } = useModalState();
    const [toggleDataList, setToggleDataList] = useState(false);
    // const [selectedOption, setSelectedOption] = useState({
    //     ticker: selectText,
    //     icon: btc,
    // });

    const [selectedOption, setSelectedOption] = useState(token ? token : { ticker: selectText, icon: ordinalIcon });

    useEffect(() => {
        if (!token)
            setSelectedOption({ ticker: selectText, icon: ordinalIcon })
        else
            setSelectedOption(token)
    }, [token])

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
        // console.log('SSSSSSSSSSS');
        const isNumber = /^[-+]?(\d+|\d*\.\d+|\d+\.\d*)([eE][-+]?\d+)?$/;
        let value = e.target.value;
        if (value == '' || isNumber.test(value)) {
            // console.log(value);
            if (value >= 21000000) value = '21000000';
            setAmount(value);
        }
    }

    return (
        <>
        {label === "From" && 
            <div className="relative text-[14px] cursor-pointer w-full rounded-l-lg"
                onClick={handleToggleDataList}
            >
                {/* <div className='mb-5'>{label}</div> */}
                <div className="flex items-center">
                    <img className="w-[56px] h-[56px] icon" src={selectedOption?.ticker === 'BTC' ? btcIcon : selectedOption?.ticker === 'BRPD'? brpdIcon : (() => {
                            const selectedItem = tokenDataList?.filter(item => item.symbol.toLowerCase() === selectedOption?.ticker?.toLowerCase());
                            if (selectedItem && selectedItem.length > 0) {
                                return selectedItem[0].iconUrl + "?size=30x30";
                            }
                            return ordinalIcon;
                        })()} alt=""  style={{borderRadius: "50%"}} />
                    <div className="pl-3">
                        <div className="font-bold mb-5">{selectedOption?.ticker || "Select"}</div>
                        <div className="text-[12px] text-[#6F767E]">{selectedOption?.ticker === 'BTC' ? "On Bitcoin" : "Ordinal"}</div>
                    </div>
                </div>

                <div className="">
                    {
                        !disabled && <DataList
                            show={toggleDataList}
                            options={list}
                            handleBlur={handleDataListBlur}
                            setSelectedOption={setSelectedOption}
                            setToken={setToken}
                        />
                    }
                </div>
            </div>
        }
        {label === "To" && 
            <div className="relative text-[14px] cursor-pointer w-full rounded-l-lg"
                onClick={handleToggleDataList}
            >
                {/* <div className='mb-5'>{label}</div> */}
                <div className="flex items-center flex-row-reverse">
                    
                    <img className="w-[56px] h-[56px] icon" src={selectedOption?.ticker === 'BTC' ? btcIcon : selectedOption?.ticker === 'BRPD'? brpdIcon : (() => {
                            const selectedItem = tokenDataList?.filter(item => item.symbol.toLowerCase() === selectedOption?.ticker?.toLowerCase());
                            if (selectedItem && selectedItem.length > 0) {
                                return selectedItem[0].iconUrl + "?size=30x30";
                            }
                            return ordinalIcon;
                        })()} alt=""  style={{borderRadius: "50%"}} />
                        <div className="pr-3 !text-right">
                        <div className="font-bold mb-5">{selectedOption?.ticker || "Select"}</div>
                        <div className="text-[12px] text-[#6F767E]">{selectedOption?.ticker === 'BTC' ? "On Bitcoin" : "Ordinal"}</div>
                    </div>
                </div>

                <div className="">
                    {
                        !disabled && <DataList
                            show={toggleDataList}
                            options={list}
                            handleBlur={handleDataListBlur}
                            setSelectedOption={setSelectedOption}
                            setToken={setToken}
                        />
                    }
                </div>
            </div>
        }
        </>
    );
}

export default ExchangeSelectToken;
