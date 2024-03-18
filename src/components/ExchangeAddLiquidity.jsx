import React, { useEffect, useState } from "react";
import arrowDown from "../assets/icons/arrowDown.svg";
import ordinals from "../assets/icons/ordinals.svg";
import DataTable from "./DataTable";
import ExchangeSelect from "./ExchangeSelect";
import Filters from "./Filters";

import { useAuthState } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { fakeOrderList } from "../utils/fakeData";
import { ORDER_STATUS_LISTED, formatOrderStatus, formatTime, sleep } from "../utils/constants";
import { createColumnHelper } from "@tanstack/react-table";
import { useModalState } from "../context/ModalContext";
import ReactPortal from "./ReactPortal";
import { BTCTestExplorerUrl, addLiquidityApi, feeRateUrl, getTXInfoUrl, updateOrderApi, addLiquidityFeeApi } from "../utils/apiRoutes";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import TooltipComp from "./customComponents/Tooltip";
import BlockScan from "./customComponents/BlockScan";
import OrderStatus from "./customComponents/OrderStatus";
import useLPAmount from "../hooks/useLPAmount";
import ExchangeSelectToken from "./ExchangeSelectToken";
import Modal from "./Modal";


const columnHelper = createColumnHelper();

function ExchangeAddLiquidity() {
    const { messageApi } = useToast();
    const { unisatContext, appContext } = useAuthState();
    const { unisatWallet, connected, setUnisatInstalled, address, network, balance, connectWallet, checkConnect } = unisatContext;
    const { factoryWallet, poolList, tokenSelectList, tokenDataList, tokenOne, tokenTwo, setTokenOne, setTokenTwo, orderList, loadOrderList, currentPool, fetchWeightList } = appContext;

    const [tokenOneAmount, setTokenOneAmount] = useState('');
    const [tokenTwoAmount, setTokenTwoAmount] = useState('');
    const [lPAmount, setLPAmount] = useState('');
    const { modalState, openModal, closeModal } = useModalState();
    const [isLoading, setIsLoading] = useState(false);
    const [result, getResult] = useLPAmount(tokenOne, tokenTwo, tokenOneAmount, tokenTwoAmount, currentPool)

    const [posChange, setPosChange] = useState(false);
    const [hint, setHint] = useState('')
    const [showFeeReteModal, setShowFeeRateModal] = useState(false);
    const [feeRate, setFeeRate] = useState(1);
    const [fee, setFee] = useState(0);
    useEffect(() => {
        axios.get(`${addLiquidityFeeApi}?fee_rate=${feeRate}`)
            .then(({ data }) => {
                setFee(data.data)
            })
    }, [feeRate]);

    const TokenSend = ({ record, id }) => {
        const [isConfirmed, setIsConfirmed] = useState(false);
        const [currentFee, setCurrentFee] = useState(10)
        const status = record.order_status;
        let transfer, inscriptionId;
        const token = id == 1 ? record.token1 : record.token2;
        if (token == 'BTC') {
            transfer = id == 1 ? record.token_transfer2 : record.token_transfer1;
            inscriptionId = transfer ? transfer.inscription + 'BTC' : ''
        } else {
            transfer = id == 1 ? record.token_transfer1 : record.token_transfer2;
            inscriptionId = transfer ? transfer.inscription : '';
            // const res = await axios
            // await sleep(1000)
        }
        const amount = id == 1 ? record.token_amount1 : record.token_amount2;
        const confirmed = transfer ? localStorage.getItem(transfer.reveal) == 'true' : false;
        const disabled = (status != 11 || localStorage.getItem(inscriptionId) == 'true') || status == 99 //|| !(isConfirmed || confirmed)
        const targetWallet = poolList.length ? poolList.find((pool) => pool.lp_token === record.lp_token).address : '';
        // console.log("targetWallet", targetWallet)

        useEffect(() => {
            let isMounted = true;
            const getFeeRate = async() => {
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
                <TooltipComp
                    content={`Send ${token} of ${amount} to pool ${record.token1}/${record.token2} (${targetWallet}) `}
                >
                    <button
                        className={`table-btn table-btn-${disabled
                            ? "black" : "primary"
                            }`}
                        disabled={disabled}
                        onClick={async () => {
                            try {
                                if (token == "BTC") {
                                    const tx = await window.unisat.sendBitcoin(factoryWallet, amount, {feeRate: currentFee});
                                    const body = {
                                        sender_address: address,
                                        fee_txid: tx,
                                        fee_rate: 1,
                                        prev_fee_txid: record.fee_txid,
                                    }
                                    try {
                                        await axios.post(updateOrderApi, body);
                                    } catch (error) {
                                    }
                                }
                                else {
                                    await window.unisat.sendInscription(targetWallet, inscriptionId, {feeRate: currentFee});
                                }
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
        return <span>{`${record.token1}/${record.token2}`}</span>
    }

    const amountRender = (record) => {
        return <span>{`${record.token1 === 'BTC'? record.token_amount1/1e8 : record.token_amount1}/${record.token2 === 'BTC'? record.token_amount2/1e8 : record.token_amount2}`}</span>
    }

    const columns = [
        columnHelper.accessor("no", {
            cell: (info) => info.getValue(),
            header: () => <span>No</span>,
            width: '20px'
        }),

        columnHelper.accessor("fee_txid", {
            header: () => "Transaction",
            cell: (info) => (
                <BlockScan transaction={info.getValue()} />
            ),
        }),
        columnHelper.accessor("fee_rate", {
            header: () => <span>Fee Rate</span>,
        }),
        columnHelper.accessor((row) => row.ordered_time, {
            header: () => <span>Ordered Time</span>,
            id: "orderedTime",
            cell: (info) => <i>{formatTime(info.getValue())}</i>,
        }),
        columnHelper.accessor("Token Pair", {
            header: "Token Pair",
            cell: props => poolRender(props.row.original)
        }),
        columnHelper.accessor("Token Amount", {
            header: "Token Amount",
            cell: props => amountRender(props.row.original)
        }),
        columnHelper.accessor('token1_send', {
            header: 'Token1',
            cell: props => <TokenSend record={props.row.original} id={1} />
        }),
        columnHelper.accessor('token2_send', {
            header: 'Token2',
            cell: props => <TokenSend record={props.row.original} id={2} />
        }),
        columnHelper.accessor("lp_token", {
            header: "LP Token",
        }),
        columnHelper.accessor("lp_token_amount", {
            header: "Rewards",
        }),
        columnHelper.accessor('order_status', {
            header: 'Order status',
            cell: (info) => <OrderStatus status={info.getValue()} />
        }),
        columnHelper.accessor("description", {
            header: "Description",
        }),
    ];

    const handleAddBtn = async (e) => {
        e.preventDefault();
        const walletCheck = await checkConnect();
        // console.log('walletCheck :>> ', walletCheck);

        if (!walletCheck) {
            await connectWallet();
            return;
        }
        if (!tokenOne || !tokenTwo) {
            messageApi.notifyWarning('Please Select tokens');
            return;
        }
        if (!currentPool) {
            messageApi.notifyWarning('No pool exists');
            return;
        }
        if (tokenOneAmount == '' || tokenOneAmount <= 0) {
            messageApi.notifyWarning('Please input Token one amount.');
            return;
        }
        if (tokenTwoAmount == '' || tokenTwoAmount <= 0) {
            messageApi.notifyWarning('Please input Token two amount.');
            return;
        }
        // const { data: feeList } = await fetchWeightList();
        // setFee(calculateFee(1, feeList).add_liquidity_fee)
        // openModal();
        setShowFeeRateModal(true)
    }

    const onChangeTokenOneAmount = (value) => {
        setTokenOneAmount(value)
        if (currentPool && currentPool.balance2 > 0) {
            let mul = 1;
            if (tokenOne.ticker == "BTC") {
                mul = 1e8;
            } else if (tokenTwo.ticker === "BTC") {
                mul = 1e-8
            }
            const predictIncome = currentPool.balance2 * value * mul / currentPool.balance1;
            setTokenTwoAmount(predictIncome);
        }
      }
    
      const onChangeTokenTwoAmount = (value) => {
        setTokenTwoAmount(value)
        if (currentPool && currentPool.balance1 > 0) {
          const predictIncome = currentPool.balance1 * value / currentPool.balance2;
          setTokenOneAmount(predictIncome);
        }
      }

    const handleAddLiquidity = async () => {
        setIsLoading(true);
        const walletCheck = await checkConnect();
        // console.log('walletCheck :>> ', walletCheck);
        if (!walletCheck) return;
        if (!tokenOne || !tokenTwo) {
            messageApi.notifyWarning('Please Select tokens');
            return;
        }
        try {
            messageApi.notifyWarning(
                `Ordering add liquidity pool for ${tokenOne.ticker.toUpperCase()}/${tokenTwo.ticker.toUpperCase()} ${fee / 1e8}`,
                6
            );
            const tx_id = await unisatWallet.sendBitcoin(factoryWallet, fee, { feeRate });
            const body = {
                sender_address: address,
                fee_txid: tx_id,
                fee_rate: feeRate,
                token1: tokenOne.ticker,
                token2: tokenTwo.ticker,
                lp_token: currentPool.lp_token,
                token_amount1: tokenOne.ticker == "BTC" ? Math.round(Number(tokenOneAmount * 1e8)) : Number(tokenOneAmount),
                token_amount2: tokenTwo.ticker == "BTC" ? Math.round(Number(tokenTwoAmount * 1e8)) : Number(tokenTwoAmount),
            }
            // console.log('window.unisat :>> ', body);
            const { data } = await axios({
                method: 'post',
                url: addLiquidityApi,
                withCredentials: false,
                data: body,
            });
            // console.log('Add liqudity', data);
            if (data.status == 'ok') {
                messageApi.notifySuccess('Add liqudity order is successfully listed!')
                await loadOrderList();
            }
            else {
                messageApi.notifyFailed('Add liqudity order was failed!')
            }
        } catch (error) {
            console.error(error);
            messageApi.notifyFailed('User canceled order.')
        }
        setIsLoading(false);
        closeModal();
    }

    const AddLiquidityBtn = () => {
        if (!connected)
            return (
                <button
                    className="d-btn d-btn-primary center-margin active"
                    onClick={(e) => { e.preventDefault(); connectWallet() }}
                >
                    Connect Wallet
                </button>
            )
        if (!tokenOne || !tokenTwo)
            return (
                <button
                    className="d-btn d-btn-primary center-margin active"
                    disabled={true}
                >
                    Select a token
                </button>
            )
        return (
            <button
                className="d-btn d-btn-primary center-margin active"
                disabled={!currentPool}
                onClick={handleAddBtn}
            >
                {currentPool ? 'Add liquidity' : 'No pool exists'}
            </button>)
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
                        <h2>
                            {`Are you sure to add liquidity ${tokenOne?.ticker}(${tokenOneAmount})/${tokenTwo?.ticker}(${tokenTwoAmount}) with a service fee of ${fee / 1e8} BTC?`}
                        </h2>

                        <div className="btn-group">
                            <button className="d-btn d-btn-primary active" onClick={handleAddLiquidity}>
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
            <section className="exchange__container-swap glass-effect center-margin pt-[10rem]">
                <h2 className="text-center !text-[28px]">Add liquidity </h2>

                <hr className="my-[2rem]" />
                <div className="mb-3 flex gap-8 relative">
                    <div className="swap-position w-[42px] h-[42px] flex items-center justify-center absolute z-10 text-[20px] rounded-full bg-white border cursor-pointer top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        onClick={() => {
                            setPosChange(prev => !prev)
                            const temp = tokenOne
                            setTokenOne(tokenTwo)
                            setTokenTwo(temp)
                            const tempAmount = tokenOneAmount
                            setTokenOneAmount(tokenTwoAmount)
                            setTokenTwoAmount(tempAmount)
                        }}
                    >
                        {'<->'}
                    </div>
                    {!posChange &&
                        <ExchangeSelectToken
                            amount={tokenOneAmount}
                            setAmount={setTokenOneAmount}
                            token={tokenOne}
                            setToken={setTokenOne}
                            list={tokenSelectList[0]}
                            selectText={"Select Token"}
                            bordered={true}
                            selectIcon={ordinals}
                            tokenDataList={tokenDataList}
                        />
                    }
                    <ExchangeSelectToken
                        amount={result ? tokenTwo.ticker == 'BTC' ? (result.out_token_amount / 1e8).toFixed(8) : result.out_token_amount : ''}
                        setAmount={setTokenTwoAmount}
                        token={posChange? tokenOne : tokenTwo}
                        setToken={posChange? setTokenOne: setTokenTwo}
                        list={posChange? tokenSelectList[0] : tokenSelectList[1]}
                        selectText={"Select Token"}
                        bordered={true}
                        inputDisabled={true}
                        tokenDataList={tokenDataList}
                    />
                    {posChange &&
                        <ExchangeSelectToken
                            amount={tokenOneAmount}
                            setAmount={setTokenOneAmount}
                            token={tokenTwo}
                            setToken={setTokenTwo}
                            list={tokenSelectList[0]}
                            selectText={"Select Token"}
                            bordered={true}
                            selectIcon={ordinals}
                            tokenDataList={tokenDataList}
                        />
                    }
                </div>
                <hr className="my-[2rem]" />

                <div className="swap__form center-margin full-w-select">

                    <ExchangeSelect
                        amount={tokenOneAmount}
                        setAmount={onChangeTokenOneAmount}
                        token={tokenOne}
                        setToken={setTokenOne}
                        list={tokenSelectList[0]}
                        selectText={"Select Token"}
                        bordered={true}
                        selectIcon={ordinals}
                        tokenDataList={tokenDataList}
                        showBalance={true}
                    />

                    <ExchangeSelect
                        token={tokenTwo}
                        amount={tokenTwoAmount}
                        setAmount={onChangeTokenTwoAmount}
                        setToken={setTokenTwo}
                        list={tokenSelectList[1]}
                        selectText={"Select Token"}
                        bordered={true}
                        inputDisabled={currentPool}
                        selectIcon={ordinals}
                        tokenDataList={tokenDataList}
                    />

                    {/* {!posChange &&
                        <ExchangeSelect
                            amount={tokenOneAmount}
                            setAmount={setTokenOneAmount}
                            token={tokenOne}
                            setToken={setTokenOne}
                            list={tokenSelectList[0]}
                            selectText={"Select Token"}
                            bordered={true}
                            // inputDisabled={true}
                            selectIcon={ordinals} />
                    } */}

                    {/* <div className="mt-[3rem]"></div> */}

                    {/* <ExchangeSelect
                        amount={result ? result.lp_token_amount : ''}
                        setAmount={setLPAmount}
                        token={{ ticker: currentPool ? currentPool.lp_token : 'No pool' }}
                        setToken={setTokenTwo}
                        list={tokenSelectList[1]}
                        selectText={currentPool ? currentPool.lp_token : 'No pool'}
                        bordered={true}
                        selectIcon={ordinals}
                        disabled={true}
                        label={currentPool ? 'You will receive LP token' : 'Select available token pair.'}
                        inputDisabled={true}
                        tokenDataList={tokenDataList}
                    /> */}

                    <AddLiquidityBtn />
                </div>
            </section>

            <section className="table__container">
                {/* <header className="flex items-center">
                    <Filters />
                </header> */}

                <DataTable
                    title="Add liquidity Order List"
                    type={2}
                    dataSource={orderList}
                    columns={columns}
                />
            </section>
        </>
    );
}

export default ExchangeAddLiquidity;
