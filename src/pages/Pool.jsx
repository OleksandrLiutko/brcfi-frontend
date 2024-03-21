import React, { useEffect, useState } from "react";
import SettingsIcon from "../assets/icons/SettingsIcon";
import RefreshIcon from "../assets/icons/RefreshIcon";
import arrowDown from "../assets/icons/arrowDown.svg";
import PosChangeIcon from "../assets/icons/PosChangeIcon";
import ordinals from "../assets/icons/ordinals.svg";
import ExchangeSelect from "../components/ExchangeSelect";
import DataTable from "../components/DataTable";
import { useAuthState } from "../context/AuthContext";
import { useModalState } from "../context/ModalContext";
import ReactPortal from "../components/ReactPortal";
import { useToast } from "../hooks/useToast";
import { createPoolApi, createPoolFeeApi, } from "../utils/apiRoutes";
import axios from "axios";
import { fakeOrderList } from "../utils/fakeData";
import { createColumnHelper } from "@tanstack/react-table";
import { formatOrderStatus, formatTime, sleep } from "../utils/constants";
import Filters from "../components/Filters";
import OrderStatus from "../components/customComponents/OrderStatus";
import PoolRender from "../components/customComponents/PoolRender";
import BlockScan from "../components/customComponents/BlockScan";
import ArrowDownIcon from "../components/customComponents/ArrowDownIcon";
import ExchangeSelectToken from "../components/ExchangeSelectToken";
import Modal from "../components/Modal";

const columnHelper = createColumnHelper();

const columns = [
    columnHelper.accessor("no", {
        header: () => <span>No</span>,
        cell: (info) => info.getValue(),
        width: '20px'
    }),
    columnHelper.accessor("fee_txid", {
        header: () => "Transaction",
        cell: (info) => <BlockScan transaction={info.getValue()} />,
    }),
    columnHelper.accessor("fee_rate", {
        header: () => <span>Fee Rate</span>,
    }),
    columnHelper.accessor((row) => row.start_time, {
        header: () => <span>Ordered Time</span>,
        id: "orderedTime",
        cell: (info) => <i>{formatTime(info.getValue())}</i>,
    }),
    columnHelper.accessor("token1", {
        header: "Token Pair",
        cell: (props) => <PoolRender record={props.row.original} />
    }),
    columnHelper.accessor("lp_token", {
        header: "LP Token",
    }),
    columnHelper.accessor('order_status', {
        header: 'Order Status',
        cell: (info) => <OrderStatus status={info.getValue()} />
    }),
    columnHelper.accessor("description", {
        header: "Description",
    }),
];


function Pool() {
    const { messageApi } = useToast();
    const { unisatContext, appContext } = useAuthState();
    const { unisatWallet, connected, setUnisatInstalled, address, network, balance, connectWallet, checkConnect } = unisatContext;
    const { factoryWallet, tokenList, tokenSelectList, tokenOne, tokenTwo, setTokenOne, setTokenTwo, orderList, loadOrderList, currentPool, whiteist, tokenDataList } = appContext;

    const [lPTokenTick, setLPTokenTick] = useState('');
    const [lPMax, setLPMax] = useState('');

    const { modalState, openModal, closeModal } = useModalState();
    const [isLoading, setIsLoading] = useState(false);
    const [posChange, setPosChange] = useState(false);
    const [hint, setHint] = useState('LP Token to Deploy');
    const [showFeeReteModal, setShowFeeRateModal] = useState(false);
    const [feeRate, setFeeRate] = useState(1);
    const [fee, setFee] = useState(0);

    useEffect(() => {
        closeModal();
        return async () => {
            closeModal();
            await sleep(0.1);
        }
    }, [])

    useEffect(() => {
        axios.get(`${createPoolFeeApi}?fee_rate=${feeRate}`)
            .then(({ data }) => {
                setFee(data.data)
            })
    }, [feeRate]);

    useEffect(() => {

        // console.log('currentPool :>> ', currentPool);
        if (currentPool) {
            setLPTokenTick(currentPool.lp_token)
        }
        else {
            setLPTokenTick('')
        }
    }, [currentPool])

    const handleLPTokenTick = (e) => {
        const value = e.target.value.trim();
        if (value.length <= 4) setLPTokenTick(value);
    }

    const handleLPMax = (e) => {
        const isNumber = /^-?\d*\.?\d+$/;
        let value = e.target.value;
        if (value == '' || isNumber.test(value)) {
            if (value >= 21000000) value = '21000000';
            setLPMax(value);
        }
    }

    const handleCreatePool = async () => {
        setIsLoading(true);
        const walletCheck = await checkConnect();
        // console.log('walletCheck :>> ', walletCheck);

        if (!walletCheck) return;
        if (!tokenOne || !tokenTwo) {
            messageApi.notifyWarning('Please Select tokens');
            return;
        }
        try {
            const closer = messageApi.notifyWarning(
                `Ordering new liquidity pool for ${tokenOne.ticker.toUpperCase()}/${tokenTwo.ticker.toUpperCase()}`,
                6
            );

            const tx_id = await unisatWallet.sendBitcoin(factoryWallet, fee);
            const body = {
                sender_address: address,
                fee_txid: tx_id,
                fee_rate: feeRate,
                token1: tokenOne.ticker,
                token2: tokenTwo.ticker,
                lp_token: lPTokenTick,
                lp_token_max_supply: Number(lPMax),
            }
            // console.log('window.unisat :>> ', body);
            const { data } = await axios({
                method: 'post',
                url: createPoolApi,
                withCredentials: false,
                data: body,
            });
            // console.log('createPool', data);
            if (data.status == 'ok') {
                closer();
                messageApi.notifySuccess('Create pool order is successfully listed!', 5)
                await loadOrderList();
                await sleep(1);
            }
            else {
                messageApi.notifyFailed('Failed!' + data.message)
            }
        } catch (error) {
            console.error(error);
            messageApi.notifyFailed('User canceled order')
        }
        setIsLoading(false);
        closeModal();
    }

    const handleCreatePoolBtn = (e) => {
        let hint;
        e.preventDefault();
        if (currentPool) {
            messageApi.notifyWarning('Pool already exists!');
            return;
        }
        if (!tokenOne || !tokenTwo) {
            messageApi.notifyWarning('Please Select tokens.');
            return;
        }
        
        if (lPTokenTick.length < 4) {
            messageApi.notifyWarning('Please input LP token ticker.');
            return;
        }
        if (tokenList.find((token) => token.ticker.toUpperCase() === lPTokenTick.toUpperCase())) {
            messageApi.notifyWarning(`${lPTokenTick} was already deployed`);
            return;
        }
        if (lPMax == '') {
            messageApi.notifyWarning('Please input LP token max supply.');
            return;
        }
        // openModal();
        setShowFeeRateModal(true)
    }

    const CreatePoolBtn = () => {
        if (!connected)
            return (
                <button
                    className="d-btn d-btn-primary center-margin active"
                    onClick={(e) => { e.preventDefault(); connectWallet(); }}
                >
                    Connect wallet
                </button>
            )
        return (
            <button
                className="d-btn d-btn-primary center-margin active"
                onClick={handleCreatePoolBtn}
            >
                Create a new pool
            </button>
        )
    }

    useEffect(() => {
        let hint = ''
        if (!tokenTwo || !tokenOne) {
            hint = "LP Token to Deploy"
        }
        else {
            if (currentPool) hint = "Pool already exists."
        }
        setHint(hint);
    }, [tokenOne, tokenTwo, currentPool])

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
                    <h2>Are you sure to create a new pool for {tokenOne?.ticker}/{tokenTwo?.ticker} with a service fee of {fee / 1e8} BTC?</h2>

                    <div className="btn-group">
                        <button className="d-btn d-btn-primary active" onClick={handleCreatePool}>
                            {isLoading && <span className="loader-animation"></span>}
                            Yes
                        </button>
                        <button className="d-btn d-btn-outline" onClick={() => { closeModal(); setIsLoading(false) }}>
                            No
                        </button>
                    </div>
                </section>
            </ReactPortal >
        )
        }
        <section className="pool__container">
            <h1>Pool</h1>
            <section className="pool__content glass-effect center-margin">

                <h2 className="text-center !text-[28px]">Create a new pool</h2>

                {/* <hr className="my-[2rem]" /> */}

                <div className="swap__form center-margin">
                    <div className="mb-3 flex gap-8 relative">
                        <div className="swap-position w-[40px] h-[40px] flex items-center justify-center absolute z-10 text-[20px] rounded-full bg-white border cursor-pointer top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            onClick={() => {
                                setPosChange(prev => !prev)
                                const temp = tokenOne
                                setTokenOne(tokenTwo)
                                setTokenTwo(temp)
                            }}
                        >
                            {/* {'<->'} */}
                            <PosChangeIcon />
                        </div>
                        {!posChange &&
            <div className="w-full coin-container rounded-l-2xl flex flex-col gap-6 px-[20px] pb-[20px]">

                            <ExchangeSelectToken
                                token={tokenOne}
                                setToken={setTokenOne}
                                list={tokenSelectList[0]}
                                selectText={"Select Token"}
                                bordered={true}
                                value={false}
                                label="From"
                                selectIcon={ordinals}
                                tokenDataList={tokenDataList}
                            />
                            
            <p className="w-full text-left">Balance: </p>
            <div className="input-container flex">
              <input className="pl-[16px] w-full" type="number" name="" id="" placeholder="0.00"/>
              {/* <button className="pr-[16px]">Max</button> */}
            </div>
            </div>
                        }
                        <div className="w-full coin-container rounded-l-2xl flex flex-col gap-6 px-[20px] pb-[20px]">
                        <ExchangeSelectToken
                            token={posChange? tokenOne : tokenTwo}
                            setToken={posChange? setTokenOne: setTokenTwo}
                            list={posChange? tokenSelectList[0] : tokenSelectList[1]}
                            selectText={"Select Token"}
                            bordered={true}
                            label={posChange ? "From" : "To"}
                            value={false}
                            inputDisabled={true}
                            tokenDataList={tokenDataList}
                        />
                        <p className="w-full text-left">Balance: </p>
                        <div className="input-container flex">
                          <input className="pl-[16px] w-full" type="number" name="" id="" placeholder="0.00"/>
                          {/* <button className="pr-[16px]">Max</button> */}
                        </div>
                        </div>
                        
                        {posChange &&
                        <div className="w-full coin-container rounded-l-2xl flex flex-col gap-6 px-[20px] pb-[20px]">
                            <ExchangeSelectToken
                                token={tokenTwo}
                                setToken={setTokenTwo}
                                list={tokenSelectList[1]}
                                selectText={"Select Token"}
                                bordered={true}
                                label="To"
                                value={false}
                                selectIcon={ordinals}
                                tokenDataList={tokenDataList}
                            />
                            
            <p className="w-full text-left">Balance: </p>
            <div className="input-container flex">
              <input className="pl-[16px] w-full" type="number" name="" id="" placeholder="0.00"/>
              {/* <button className="pr-[16px]">Max</button> */}
            </div>
            </div>
                        }
                    </div>

                    <hr className="my-[1rem]" />

                    <div className="token__container">
                        <p className="text-[16px] font-medium mb-[3rem]">{hint}</p>
                        <div className="token__container__input">
                            <input
                                type="text"
                                name="tokenName"
                                id="tokenName"
                                placeholder="Token Tick"
                                autoComplete="off"
                                value={lPTokenTick}
                                onChange={handleLPTokenTick}
                                disabled={currentPool}
                            />
                            <input
                                type="text"
                                name="maxSupply"
                                id="maxSupply"
                                placeholder="Max Supply"
                                autoComplete="off"
                                value={lPMax}
                                onChange={handleLPMax}
                                disabled={currentPool}
                            />
                        </div>
                    </div>
                    <CreatePoolBtn />
                </div>
            </section>

            <section className="table__container mb-14">
                {/* <header className="flex items-center">
                    <Filters />
                </header> */}

                <DataTable type={1} dataSource={orderList} columns={columns} title="Create new pool Order List" />
            </section>

        </section>
    </>);
}

export default Pool;
