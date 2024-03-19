import React, { useEffect, useState } from "react";
import arrowDown from "../assets/icons/arrowDown.svg";
import ordinals from "../assets/icons/ordinals.svg";
import DataTable from "./DataTable";
import ExchangeSelect from "./ExchangeSelect";
import Filters from "./Filters";

import { useAuthState } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { fakeOrderList } from "../utils/fakeData";
import { ORDER_STATUS_LISTED, formatOrderStatus, formatTime } from "../utils/constants";
import { createColumnHelper } from "@tanstack/react-table";
import { useModalState } from "../context/ModalContext";
import ReactPortal from "./ReactPortal";
import { addLiquidityApi, feeRateUrl, removeLiquidityApi, removeLiquidityFeeApi } from "../utils/apiRoutes";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import TooltipComp from "./customComponents/Tooltip";
import useTokenOneAndTwo from "../hooks/useTokenOneAndTwo";
import BlockScan from "./customComponents/BlockScan";
import Modal from "./Modal";


const columnHelper = createColumnHelper();

function ExchageRemoveLiquidity() {
    const { modalState, openModal, closeModal } = useModalState();
    const { messageApi } = useToast();
    const { unisatContext, appContext } = useAuthState();
    const { unisatWallet, connected, setUnisatInstalled, address, network, balance, connectWallet, checkConnect } = unisatContext;
    const { factoryWallet, poolList, tokenSelectList, tokenOne, tokenTwo, setTokenOne, setTokenTwo, orderList, loadOrderList, currentPool, tokenDataList } = appContext;

    const [tokenOneAmount, setTokenOneAmount] = useState('');
    const [tokenTwoAmount, setTokenTwoAmount] = useState('');
    const [lPAmount, setLPAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lPToken, setLPToken] = useState(null);
    const [result, getResult] = useTokenOneAndTwo(lPAmount, tokenOne, tokenTwo, lPToken);
    const [showFeeReteModal, setShowFeeRateModal] = useState(false);
    const [feeRate, setFeeRate] = useState(1);
    const [fee, setFee] = useState(0)

    useEffect(() => {
        axios.get(`${removeLiquidityFeeApi}?fee_rate=${feeRate}`)
            .then(({ data }) => {
                setFee(data.data)
            })
    }, [feeRate])

    const [lpTokenList, setLpTokenList] = useState(poolList.map((pool) => {
        return {
            ticker: pool.lp_token,
            token1: pool.token1,
            token2: pool.token2,
            address: pool.address,
            balance: pool.balance
        }
    }));

    useEffect(() => {
        setLpTokenList(poolList.map((pool) => {
            return {
                ticker: pool.lp_token,
                token1: pool.token1,
                token2: pool.token2,
                address: pool.address,
                balance: pool.balance
            }
        })
        )
    }, [poolList])

    useEffect(() => {
        setLPToken(lpTokenList[0])
    }, [])
    useEffect(() => {
        if (lPToken) {
            setTokenOne(lPToken.token1);
            setTokenTwo(lPToken.token2);
        }
        else {
            setTokenOne(null);
            setTokenTwo(null);
        }
    }, [lPToken]);

    const lpTokenSend = (record, id) => {
        const [currentFee, setCurrentFee] = useState(10)
        const status = record.order_status;
        const transfer = record.lp_token_transfer;
        const token = record.lp_token;
        const amount = id == 1 ? record.token1_amount : record.token2_amount;
        const inscriptionId = transfer ? transfer.inscriptions[0].id : ''
        const disabled = (inscriptionId == '' || localStorage.getItem(inscriptionId) == 'true' || status == 99)
        const targetWallet = poolList.find((pool) => pool.lp_token === record.lp_token).address;
        useEffect(() => {
            let isMounted = true;
            const getFeeRate = async () => {
                const res = await axios({
                    method: 'get',
                    url: feeRateUrl
                });
                if (isMounted) {
                    setCurrentFee(res.data?.fastestFee || 10);
                }
            }
            if (!disabled) {
                getFeeRate()
            }

            return () => {
                isMounted = false
            }
        }, [])
        return (
            <>
                <TooltipComp content={`Receive ${token} from pool ${record.token1}/${record.token2} (${inscriptionId}) `}>
                    <button
                        className={`table-btn table-btn-${disabled
                            ? "black" : "primary"
                            }`}
                        disabled={disabled}
                        onClick={async () => {
                            try {
                                await window.unisat.sendInscription(targetWallet, inscriptionId, { feeRate: currentFee });
                                localStorage.setItem(inscriptionId, 'true');
                                loadOrderList();
                            } catch (error) {
                            }
                        }}
                    >
                        {localStorage.getItem(inscriptionId) == 'true' ? 'Sent' : 'Send'}
                    </button>
                </TooltipComp>
            </>
        )
    }

    const poolRender = (record) => {
        return <span>{record.token1 + '/' + record.token2}</span>
    }

    const amountRender = (record) => {
        if (record.token1_amount)
            return <span>{`${record.token1 === 'BTC' ? record.token1_amount / 1e8 : record.token1_amount}/${record.token2 === 'BTC' ? record.token2_amount / 1e8 : record.token2_amount}`}</span>
        else return <></>
    }

    const columns = [
        columnHelper.accessor("no", {
            header: () => <span>No</span>,
            cell: (info) => info.getValue(),
            width: '20px'
        }),
        columnHelper.accessor("fee_txid", {
            header: () => "Transaction",
            cell: (info) => <BlockScan transaction={info.getValue()} />
        }),
        columnHelper.accessor("fee_rate", {
            header: () => <span>Fee Rate</span>,
        }),
        columnHelper.accessor((row) => row.start_time, {
            header: () => <span>Ordered Time</span>,
            id: "orderedTime",
            cell: (info) => <i>{formatTime(info.getValue())}</i>,
        }),
        columnHelper.accessor("lp_token", {
            header: "LP token",
            cell: (props) => `${props.row.original.lp_token}`
        }),
        columnHelper.accessor("lp_token_amount", {
            header: "Amount",
            cell: (props) => `${props.row.original.lp_token_amount}`
        }),
        columnHelper.accessor("Token Pair", {
            header: "Token Pair",
            cell: props => poolRender(props.row.original)
        }),
        columnHelper.accessor("token1", {
            header: "Token Amount",
            cell: props => amountRender(props.row.original)
        }),
        columnHelper.accessor('token1_send', {
            header: 'Send LP Token',
            cell: props => lpTokenSend(props.row.original, 1)
        }),
        columnHelper.accessor('order_status', {
            header: 'Order status',
            cell: (info) => <span
                className="table-status table-status-outline"
            >
                {formatOrderStatus(info.getValue(), 2)}
            </span>
        }),
        columnHelper.accessor("description", {
            header: "Description",
        }),
    ];

    const handleRemoveBtn = async (e) => {
        e.preventDefault();
        const walletCheck = await checkConnect();

        if (!walletCheck) {
            await connectWallet();
            return;
        }
        if (!lPToken) {
            messageApi.notifyWarning('Please Select LP token to remove.');
            return;
        }
        if (!lPAmount || lPAmount == 0) {
            messageApi.notifyWarning('Please input LP token Amount to remove.');
            return;
        }
        // openModal();
        setShowFeeRateModal(true)
    }

    const handleRemoveLiquidity = async () => {
        setIsLoading(true);
        const walletCheck = await checkConnect();
        if (!walletCheck) return;
        try {
            messageApi.notifyWarning(
                `Ordering remove liquidity pool for ${tokenOne.ticker}/${tokenTwo.ticker}`,
                6
            );
            const tx_id = await unisatWallet.sendBitcoin(factoryWallet, fee);
            const body = {
                sender_address: address,
                fee_txid: tx_id,
                fee_rate: feeRate,
                token1: tokenOne.ticker,
                token2: tokenTwo.ticker,
                lp_token: lPToken.ticker,
                lp_token_amount: Number(lPAmount),
            }
            const { data } = await axios({
                method: 'post',
                url: removeLiquidityApi,
                withCredentials: false,
                data: body,
            });
            if (data.status == 'ok') {
                messageApi.notifySuccess('Remove liqudity order is successfully listed!')
                await loadOrderList();
            }
            else {
                messageApi.notifyFailed('Remove liqudity order was failed!')
            }
        } catch (error) {
            console.error(error);
            messageApi.notifyFailed('User canceled order.')
        }
        setIsLoading(false);
        closeModal();
    }
    const RemoveBtn = () => {
        if (!connected)
            return (
                <button
                    className="d-btn d-btn-primary center-margin active"
                    onClick={(e) => { e.preventDefault(); connectWallet() }}
                >
                    Connect Wallet
                </button>
            )
        return (
            <button
                className="d-btn d-btn-primary center-margin active"
                onClick={handleRemoveBtn}
            >
                Remove liquidity
            </button>
        )
    }

    const onCloseFeeRateModal = (e) => {
        setShowFeeRateModal(false)
    }

    const onConfirmFeeRate = (feeRate) => {
        setFeeRate(feeRate);
        openModal();
        setShowFeeRateModal(false);
    }

    return (
        <>
            {showFeeReteModal && <Modal onClose={onCloseFeeRateModal} onConfirm={onConfirmFeeRate} />}
            {modalState.open && (
                <ReactPortal>
                    <section className="modal__content">
                        <h2>Are you sure to remove liquidity for {tokenOne?.ticker}/{tokenTwo?.ticker} with a service fee of {fee / 1e8} BTC?</h2>

                        <div className="btn-group">
                            <button className="d-btn d-btn-primary active" onClick={handleRemoveLiquidity}>
                                {isLoading && <span className="loader-animation"></span>}
                                Yes
                            </button>
                            <button className="d-btn d-btn-outline" onClick={closeModal}>
                                No
                            </button>
                        </div>
                    </section>
                </ReactPortal >
            )}
            <section className="exchange__container-swap glass-effect center-margin">
                <h2 className="text-center !text-[28px] mt-[7rem]">Remove liquidity </h2>

                <div className="swap__form center-margin full-w-select">

                    <p className="text-center !text-[16px] text-[#6F767E]">Select LP Token to Remove</p>
                    <ExchangeSelect
                        amount={lPAmount}
                        setAmount={setLPAmount}
                        token={lPToken}
                        setToken={setLPToken}
                        list={lpTokenList}
                        selectText={'Select token'}
                        bordered={true}
                        selectIcon={ordinals}
                        tokenDataList={tokenDataList}
                        showBalance={true}
                    />
                    <svg
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="center-margin"
                        id="arrow-down"
                    >
                        <g>
                            <g>
                                <g>
                                    <polyline
                                        dataname="Right"
                                        fill="inherit"
                                        id="Right-2"
                                        points="7 16.4 12 21.5 17 16.4"
                                        stroke="inherit"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                    />

                                    <line
                                        fill="inherit"
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
                    <ExchangeSelect
                        amount={result ? tokenOne.ticker == "BTC" ? (result.token1_amount / 1e8).toFixed(8) : result.token1_amount : ''}
                        setAmount={setTokenOneAmount}
                        token={tokenOne}
                        setToken={setTokenOne}
                        list={tokenSelectList[0]}
                        selectText={'Not available'}
                        bordered={true}
                        selectIcon={ordinals}
                        disabled={true}
                        inputDisabled={true}
                        tokenDataList={tokenDataList}
                    />

                    <ExchangeSelect
                        amount={result ? tokenTwo.ticker == "BTC" ? (result.token2_amount / 1e8).toFixed(8) : result.token2_amount : ''}
                        setAmount={setTokenTwoAmount}
                        token={tokenTwo}
                        setToken={setTokenTwo}
                        list={tokenSelectList[1]}
                        selectText={"Not available"}
                        bordered={true}
                        selectIcon={ordinals}
                        disabled={true}
                        inputDisabled={true}
                        tokenDataList={tokenDataList}
                    />

                    <RemoveBtn />
                </div>
            </section>

            <section className="table__container">
                {/* <header className="flex items-center">
                    <Filters />
                </header> */}

                <DataTable
                    title="Remove liquidity Orderbook"
                    type={3}
                    dataSource={orderList}
                    columns={columns}
                />
            </section>
        </>
    );
}

export default ExchageRemoveLiquidity;
