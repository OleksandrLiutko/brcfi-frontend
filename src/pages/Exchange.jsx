import React, { useEffect, useState } from "react";
import ExchangeSwap from "../components/ExchangeSwap";
import ExchangeAddLiquidity from "../components/ExchangeAddLiquidity";
import ExchangeRemoveLiquidity from "../components/ExchangeRemoveLiquidity";
import { useModalState } from "../context/ModalContext";

function Exchange() {
    const [exchange, setExchange] = useState("addLiquidity");
    const { modalState, openModal, closeModal } = useModalState();
    useEffect(() => {
        closeModal()
    }, [])

    const handleExchangeAction = (val) => {
        setExchange(val);
    };

    return (
        <section className="exchange__container">
            <h2>Liquidity</h2>
            <section className="top relative">
                <section className="btn-actions absolute left-1/2 transform -translate-x-1/2 top-[2.5rem]">
                    {/* <button
                        className={`d-btn d-btn-primary d-btn-condensed ${exchange === "swap" ? "active" : ""
                            }`}
                        onClick={() => handleExchangeAction("swap")}
                    >
                        Swap
                    </button> */}
                    <button
                        className={`d-btn d-btn-primary d-btn-condensed ${exchange === "addLiquidity" ? "active" : ""
                            }`}
                        onClick={() => handleExchangeAction("addLiquidity")}
                    >
                        Add Liquidity
                    </button>
                    <button
                        className={`d-btn d-btn-primary d-btn-condensed ${exchange === "removeLiquidity" ? "active" : ""
                            }`}
                        onClick={() => handleExchangeAction("removeLiquidity")}
                    >
                        Remove Liquidity
                    </button>
                    {/* <button
                        className={`d-btn d-btn-primary d-btn-condensed ${exchange === "bridge" ? "active" : ""
                            }`}
                        onClick={() => handleExchangeAction("bridge")}
                    >
                        Bridge
                    </button> */}
                </section>

                {exchange === "addLiquidity" && <ExchangeAddLiquidity />}
                {exchange === "removeLiquidity" && <ExchangeRemoveLiquidity />}
            </section>
        </section>
    );
}

export default Exchange;
