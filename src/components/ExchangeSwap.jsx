import React, { useEffect, useRef, useState } from "react";
import SettingsIcon from "../assets/icons/SettingsIcon";
import RefreshIcon from "../assets/icons/RefreshIcon";
import arrowDown from "../assets/icons/arrowDown.svg";
import ordinals from "../assets/icons/ordinals.svg";
import DataTable from "./DataTable";
import ExchangeSelect from "./ExchangeSelect";
import ExchangeSelectToken from "./ExchangeSelectToken";
import CancelIcon from "../assets/icons/CancelIcon";
import PosChangeIcon from "../assets/icons/PosChangeIcon";
import { useModalState } from "../context/ModalContext";
import ReactPortal from "./ReactPortal";
import Filters from "./Filters";
import { useAuthState } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { formatOrderStatus, formatTime } from "../utils/constants";
import { createColumnHelper } from "@tanstack/react-table";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import TooltipComp from "./customComponents/Tooltip";
import SwapIcon from "../assets/icons/swap.svg";

const columnHelper = createColumnHelper();

import { useResponsiveView } from "../utils/customHooks";
import { feeRateUrl, swapApi, swapFeeApi } from "../utils/apiRoutes";
import useTokenTwoAmount from "../hooks/useTokenTwoAmount";
import OrderStatus from "./customComponents/OrderStatus";
import BlockScan from "./customComponents/BlockScan";
import Modal from "./Modal";

function ExchangeSwap() {
  const isMobileView_500 = useResponsiveView(500);
  const { messageApi } = useToast();
  const [posChange, setPosChange] = useState(false);
  const { modalState, openModal, closeModal, addModal, removeModal } = useModalState();
  const { unisatContext, appContext } = useAuthState();
  const { unisatWallet, connected, setUnisatInstalled, address, network, balance, connectWallet, checkConnect } = unisatContext;
  const {
    factoryWallet, poolList, poolTokenLists,
    tokenOne, tokenTwo, setTokenOne, setTokenTwo,
    orderList, loadOrderList, currentPool, currentPoolLoading, tokenDataList
  }
    = appContext;

  const [tokenOneAmount, setTokenOneAmount] = useState('');
  const [tokenTwoAmount, setTokenTwoAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toggleSetting, setToggleSetting] = useState(false);
  const [percentage, setPercentage] = useState(1);
  const [feeRate, setFeeRate] = useState(1);
  const [fee, setFee] = useState(0)
  const settingRef = useRef();
  const [result, getResult] = useTokenTwoAmount(tokenOne, tokenTwo, tokenOneAmount, currentPool)

  useEffect(() => {
    axios.get(`${swapFeeApi}?fee_rate=${feeRate}`)
      .then(({ data }) => {
        setFee(data.data)
      })
  }, [feeRate])

  useEffect(() => {
    if (!result) return
    setTokenTwoAmount(tokenTwo.ticker === "BTC" ? (result.out_token_amount / 1e8).toFixed(8) : result.out_token_amount)
  }, [result])

  const tokenSend = (record, id) => {
    const [currentFee, setCurrentFee] = useState(1)
    const status = record.order_status;
    const transfer = record.in_token_transfer;
    const token = record.in_token;
    const amount = id == 1 ? record.token1_amount : record.token2_amount;
    const inscriptionId = transfer ? transfer.inscriptions[0].id : ''
    const disabled = (inscriptionId == '' || localStorage.getItem(inscriptionId) == 'true') || token == 'BTC' || status == 99
    const targetWallet = poolList.find((pool) => pool.lp_token === record.lp_token).address;
    useEffect(() => {
      let isMounted = true;
      const getFeeRate = async () => {
        const res = await axios({
          method: 'get',
          url: feeRateUrl
        });
        if (isMounted) {
          setCurrentFee(res.data?.fastestFee || 1);
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
        <TooltipComp content={`Send ${token} to pool ${record.in_token}/${record.out_token} (${targetWallet}) `}>
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
            {token == 'BTC' ? 'Sent' : localStorage.getItem(inscriptionId) == 'true' ? 'Sent' : 'Send'}
          </button>
        </TooltipComp>
      </>
    )
  }

  const inTokenAmountRender = (record) => {
    return <span>{`${record.in_token === 'BTC' ? record.in_token_amount / 1e8 : record.in_token_amount}`}</span>
  }

  const outTokenAmountRender = (record) => {
    if (record.out_token_amount)
      return <span>{`${record.out_token === 'BTC' ? (record.out_token_amount / 1e8).toFixed(8) : record.out_token_amount}`}</span>
    return <span></span>
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
      id: "orderedTime",
      cell: (info) => <i>{formatTime(info.getValue())}</i>,
      header: () => <span>Ordered Time</span>,
    }),
    columnHelper.accessor("in_token", {
      header: "Send Token",
    }),
    columnHelper.accessor("in_token_amount", {
      header: "Send Amount",
      cell: props => inTokenAmountRender(props.row.original)
    }),
    columnHelper.accessor("Send in token", {
      header: "Send",
      cell: info => tokenSend(info.row.original)
    }),
    columnHelper.accessor("out_token", {
      header: "Receive Token",
    }),
    columnHelper.accessor("out_token_amount", {
      header: "Receive Amount",
      cell: props => outTokenAmountRender(props.row.original)
    }),
    columnHelper.accessor('order_status', {
      header: 'Order status',
      cell: (info) => <OrderStatus status={info.getValue()} />
    }),
    columnHelper.accessor("description", {
      header: "Description",
    }),
  ];

  const handleSettingBlur = () => {
    setTimeout(() => {
      setToggleSetting(false);
      isMobileView_500 && removeModal();
    }, 100);
  };

  useEffect(() => {
    if (toggleSetting) {
      settingRef.current.focus();
    }
  }, [toggleSetting]);

  const handleSwap = async () => {
    // console.log(tokenOne, tokenTwo);
    setIsLoading(true);
    const walletCheck = await checkConnect();
    // console.log('walletCheck :>> ', walletCheck);
    if (!walletCheck) return;
    try {
      messageApi.notifyWarning(
        `Ordering swap for ${tokenOne.ticker.toUpperCase()}/${tokenTwo.ticker.toUpperCase()}`,
        10
      );
      let tx_id;
      if (tokenOne.ticker == 'BTC') {
        tx_id = await unisatWallet.sendBitcoin(factoryWallet, fee + tokenOneAmount * 1e8);
      } else {
        tx_id = await unisatWallet.sendBitcoin(factoryWallet, fee || 4000);
      }
      const body = {
        sender_address: address,
        fee_txid: tx_id,
        fee_rate: feeRate,
        in_token: tokenOne.ticker,
        out_token: tokenTwo.ticker,
        in_token_amount: tokenOne.ticker == "BTC" ? Math.round(Number(tokenOneAmount * 1e8)) : Number(tokenOneAmount),
        lp_token: currentPool.lp_token,
      }
      // console.log('window.unisat :>> ', body);
      const { data } = await axios({
        method: 'post',
        url: swapApi,
        withCredentials: false,
        data: body,
      });
      // console.log('swap_response', data);
      if (data.status == 'ok') {
        messageApi.notifySuccess('Swap order is successfully listed!')
        await loadOrderList();
      }
      else {
        messageApi.notifyFailed('Swap order was failed!')
      }
    } catch (error) {
      console.error(error);
      messageApi.notifyFailed('User canceled order')
    }
    setIsLoading(false);
    closeModal();
  }

  const handleSwapBtn = async (e) => {
    // console.log('currentPool :>> ', currentPool);
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
    if (currentPool) {
      const { balance1, balance2 } = currentPool;
      if (!balance1 || !balance2) {
        messageApi.notifyWarning('There is not enough liquidity.');
        return;
      }
    }
    if (tokenOneAmount == '' || tokenOneAmount <= 0) {
      messageApi.notifyWarning('Please input Token one amount.');
      return;
    }

    // openModal();
    setShow(true)
  };

  const handleSettingsOpen = () => {
    if (isMobileView_500) {
      addModal();
      setTimeout(() => {
        setToggleSetting(true);
      }, 150);
    } else {
      setToggleSetting(true);
    }
  };
  const handleSettingsClose = () => {
    if (isMobileView_500) {
      removeModal();
      setTimeout(() => {
        setToggleSetting(false);
      }, 150);
    } else {
      setToggleSetting(false);
    }
  };

  const onChangeTokenOneAmount = (value) => {
    setTokenOneAmount(value)

    if (currentPool && currentPool.balance2 > 0) {
      let mul = 1;
      if (tokenOne.ticker == "BTC") {
        mul = 1e8;
      }
      const predictIncome = currentPool.balance2 * value * mul / (currentPool.balance1 + value * mul);
      setTokenTwoAmount(predictIncome);
    }
  }

  const onChangeTokenTwoAmount = (value) => {
    setTokenTwoAmount(value)
    // console.log("currentPool_Two", currentPool)
    if (currentPool && currentPool.balance1 > 0) {
      const predictIncome = currentPool.balance1 * value / currentPool.balance2;
      setTokenOneAmount(predictIncome);
    }
  }

  // useEffect(() => {
  //   if (currentPool && currentPool.balance2 > 0) {
  //     let mul = 1;
  //     if (tokenOne.ticker == "BTC") {
  //       mul = 1e8;
  //     }
  //     const predictIncome = currentPool.balance2 * tokenOneAmount * mul / (currentPool.balance1 + tokenOneAmount * mul);
  //     console.log("currentPool_One", currentPool, predictIncome)
  //     setTokenTwoAmount(predictIncome.toFixed(0));
  //   }
  //   else setTokenTwoAmount('');
  // }, [currentPool])

  const SwapButton = () => {
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
        disabled={!currentPool || !currentPool.balance1 || !currentPool.balance2}
        onClick={handleSwapBtn}
      >
        {currentPool && currentPool.balance1 > 0 && currentPool.balance2 > 0 ? 'Swap' : 'No pool exists'}
      </button>)
  }

  const [show, setShow] = useState(false);
  const onClose = (e) => {
    setShow(false)
  }

  const onConfirm = (feeRate) => {
    setFeeRate(feeRate);
    openModal()
    setShow(false);
  }

  const SwapRate = () => {
    if (!currentPool || !currentPool.balance1 || !currentPool.balance2)
      return <></>
    let rateVal = 0;
    if (currentPool.token1 === "BTC") {
      rateVal = currentPool.balance2 / currentPool.balance1 * 1e8
    } else if (currentPool.token2 === "BTC") {
      rateVal = (currentPool.balance2 / currentPool.balance1 / 1e8).toFixed(8)
    } else {
      rateVal = currentPool.balance2 / currentPool.balance1
    }
    return <p style={{ textAlign: 'center' }}>{`1 ${currentPool.token1} = ${rateVal} ${currentPool.token2}`}</p>
  }

  return (
    <>
      {show && <Modal onClose={onClose} onConfirm={onConfirm} />}
      {modalState.open && (
        <ReactPortal>
          <section className="modal__content">
            <h2>
              {`Are you sure to swap ${tokenOne?.ticker}(${tokenOneAmount}) to ${tokenTwo?.ticker}(${tokenTwoAmount}) with a service fee of ${fee / 1e8} BTC?`}
            </h2>

            <div className="btn-group">
              <button className="d-btn d-btn-primary active" onClick={handleSwap}>
                {isLoading && <span className="loader-animation"></span>}
                Yes
              </button>
              <button className="d-btn d-btn-outline" onClick={closeModal}>
                No
              </button>
            </div>
          </section>
        </ReactPortal>
      )}
      <h1>Swap</h1>
      <section className="transaction__panel exchange__container-swap center-margin">
        {/* <header> */}
          <h2>Trade tokens</h2>
          {/* <p>Trade tokens in an instant</p> */}
          {/* <hr /> */}
        {/* </header> */}

        <div className="swap__form center-margin">
          <div className="mb-3 flex flex-1 gap-[2px] relative">
            <div
              className="swap-position w-[40px] h-[40px] flex items-center justify-center absolute z-10 text-[20px] rounded-full bg-white border cursor-pointer top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              onClick={() => {
                setPosChange(prev => !prev)
                const temp = tokenOne
                setTokenOne(tokenTwo)
                setTokenTwo(temp)
                const tempAmount = tokenOneAmount
                setTokenOneAmount(tokenTwoAmount)
                setTokenTwoAmount(tempAmount)
                // console.log("poschange", tokenTwoAmount, tempAmount)
              }}
            >
              {/* {'<->'} */}
              <PosChangeIcon />
            </div>
            {!posChange && 
              <div className="coin-container rounded-s-2xl">
                <p>From</p>
                <ExchangeSelectToken
                  amount={tokenOneAmount}
                  setAmount={onChangeTokenOneAmount}
                  token={tokenOne}
                  setToken={setTokenOne}
                  list={poolTokenLists[0]}
                  selectText={"Select Token"}
                  bordered={true}
                  label="From"
                  selectIcon={ordinals}
                  tokenDataList={tokenDataList}
                />
                <p className={`text-${posChange ? "right" : "left"}`}>
                  Balance:{" "}
                </p>
                <div className="input-container flex">
                  <input
                    className="pl-[16px] w-full"
                    type="number"
                    name=""
                    id=""
                    placeholder="0.00"
                  />
                  <button className="pr-[16px] text-[14px] font-medium text-[#F7931A]">
                    Max
                  </button>
                </div>
              </div>
            }
            <div className={`coin-container rounded-${posChange ? "s" : "r"}-2xl`}>
              <p className={`!text-${posChange ? "left" : "right"}`}>{posChange ? "From" : "To"}</p>
              <ExchangeSelectToken
              amount={result ? tokenTwo.ticker == 'BTC' ? (result.out_token_amount / 1e8).toFixed(8) : result.out_token_amount : ''}
                setAmount={setTokenTwoAmount}
                token={posChange ? tokenOne : tokenTwo}
                setToken={posChange ? setTokenOne : setTokenTwo}
                list={posChange ? poolTokenLists[0] : poolTokenLists[1]}
                selectText={"Select Token"}
                bordered={true}
                label={posChange ? "From" : "To"}
                inputDisabled={true}
                tokenDataList={tokenDataList}
              />
              <p className={`text-${posChange ? "left" : "right"}`}>
                Balance:{" "}
              </p>
              <div className="input-container flex">
                <input
                  className="pl-[16px] w-full"
                  type="number"
                  name=""
                  id=""
                  placeholder="0.00"
                />
                {posChange && (
                  <button className="pr-[16px] text-[14px] font-medium text-[#F7931A]">
                    Max
                  </button>
                )}
              </div>
            </div>
            {posChange && (
              <div className={`coin-container rounded-r-2xl`}>
                <p className="text-right">To</p>
                <ExchangeSelectToken
                  amount={tokenOneAmount}
                  setAmount={onChangeTokenOneAmount}
                  token={tokenTwo}
                  setToken={setTokenTwo}
                  list={poolTokenLists[1]}
                  selectText={"Select Token"}
                  bordered={true}
                  label="To"
                  selectIcon={ordinals}
                  tokenDataList={tokenDataList}
                />
                <p className={`text-${posChange ? "right" : "left"}`}>
                  Balance:{" "}
                </p>

                <div className="input-container flex">
                  <input
                    className="pl-[16px] w-full"
                    type="number"
                    name=""
                    id=""
                    placeholder="0.00"
                  />
                  {/* <button className="pr-[16px]">Max</button> */}
                </div>
              </div>
            )}
          </div>
          {/* <hr /> */}
          {/* {true && 
            <>
              <ExchangeSelect
                amount={tokenOneAmount}
                setAmount={onChangeTokenOneAmount}
                token={tokenOne}
                setToken={setTokenOne}
                list={poolTokenLists[0]}
                selectText={"Select Token"}
                bordered={true}
                label="Swap from"
                selectIcon={ordinals}
                inputDisabled={!currentPool}
                tokenDataList={tokenDataList}
                showBalance={true}
              />
            </>
          }
          {true &&
            <ExchangeSelect
              amount={result ? tokenTwo.ticker == 'BTC' ? (result.out_token_amount / 1e8).toFixed(8) : result.out_token_amount : ''}
              setAmount={setTokenTwoAmount}
              token={tokenTwo}
              setToken={setTokenTwo}
              list={poolTokenLists[1]}
              selectText={"Select Token"}
              bordered={true}
              label={"Swap to"}
              selectIcon={ordinals}
              inputDisabled={true}
              tokenDataList={tokenDataList}
            />
          } */}
          {/* {posChange &&
            <ExchangeSelect
              amount={tokenTwoAmount}
              setAmount={onChangeTokenTwoAmount}
              token={tokenTwo}
              setToken={setTokenTwo}
              list={poolTokenLists[1]}
              selectText={"Select Token"}
              bordered={true}
              label={"Swap from"}
            // inputDisabled={posChange}
            />
          }
          {posChange &&
            <ExchangeSelect
              amount={result ? tokenTwo.ticker == 'BTC' ? (result.out_token_amount / 1e8).toFixed(8) : result.out_token_amount : ''}
              setAmount={onChangeTokenOneAmount}
              token={tokenOne}
              setToken={setTokenOne}
              list={poolTokenLists[0]}
              selectText={"Select Token"}
              bordered={true}
              label={"Swap to"}
              selectIcon={ordinals}
              inputDisabled={true}
            />
          } */}
          <SwapRate />
          {/* <p>dajfkdlsjfkaasdfkljfdkslasdfkl</p> */}
          <SwapButton />
        </div>
      </section>

      <section className="table__container flex flex-col gap-[24px]">
        {/* <header className="flex items-center">
          <Filters />
        </header> */}
        <h2>Swap Order</h2>
        <DataTable
          title="Swap Order List"
          type={4}
          dataSource={orderList}
          columns={columns}
        />
      </section>
    </>
  );
}

export default ExchangeSwap;
