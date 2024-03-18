import React, { useEffect, useRef, useState } from "react";
import SettingsIcon from "../assets/icons/SettingsIcon";
import RefreshIcon from "../assets/icons/RefreshIcon";
import arrowDown from "../assets/icons/arrowDown.svg";
import ordinals from "../assets/icons/ordinals.svg";
import DataTable from "./DataTable";
import ExchangeSelect from "./ExchangeSelect";
import ExchangeSelectToken from "./ExchangeSelectToken";
import CancelIcon from "../assets/icons/CancelIcon";
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
import SwapIcon from "../assets/icons/swap.svg"

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
  const [feeRate, setFeeRate] = useState(5);
  const [fee, setFee] = useState(0)
  const settingRef = useRef();
  const [result, getResult] = useTokenTwoAmount(tokenOne, tokenTwo, tokenOneAmount, currentPool)
  const [priceImpact, setPriceImpact] = useState(false);

  useEffect(() => {
    axios.get(`${swapFeeApi}?fee_rate=${feeRate}`)
      .then(({data}) => {
        setFee(data.data)
      })
  }, [feeRate])
  useEffect(() => {
    if(!result) return
    setTokenTwoAmount(tokenTwo.ticker === "BTC"? (result.out_token_amount / 1e8).toFixed(8): result.out_token_amount)
    setPriceImpact(false)
    const aVal = currentPool.balance2 * 0.3
    if (result.out_token_amount > currentPool.balance2 * 0.3) {
      setPriceImpact(true)
      messageApi.notifyWarning("Price impact too high")
    }
  }, [result])


  const tokenSend = (record, id) => {
    const [currentFee, setCurrentFee] = useState(10)
    const status = record.order_status;
    const transfer = record.in_token_transfer;
    const token = record.in_token;
    const amount = id == 1 ? record.token_amount1 : record.token_amount2;
    const inscriptionId = transfer ? transfer.inscription : ''
    const disabled = (inscriptionId == '' || localStorage.getItem(inscriptionId) == 'true') || token == 'BTC' || status == 99
    const targetWallet = poolList.find((pool) => pool.lp_token === record.lp_token).address;
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
        <TooltipComp content={`Send ${token} to pool ${record.in_token}/${record.out_token} (${targetWallet}) `}>
          <button
            className={`table-btn table-btn-${disabled
              ? "black" : "primary"
              }`}
            disabled={disabled}
            onClick={async () => {
              try {
                await window.unisat.sendInscription(targetWallet, inscriptionId, {feeRate: currentFee});
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
    return <span>{`${record.in_token === 'BTC'? record.in_token_amount / 1e8 : record.in_token_amount}`}</span>
  }

  const outTokenAmountRender = (record) => {
    if(record.out_token_amount)
      return <span>{`${record.out_token === 'BTC'? (record.out_token_amount / 1e8).toFixed(8) : record.out_token_amount}`}</span>
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
    columnHelper.accessor((row) => row.ordered_time, {
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
    // setPriceImpact(false)
    setTokenOneAmount(value)
    // if (currentPool && currentPool.balance1 > 0 && currentPool.balance2 > 0) {
    //   const aVal = currentPool.token1 === "BTC" ? currentPool.balance1 / 1e8 * 0.3 : currentPool.balance1 * 0.3
    //   if (value > aVal) {
    //     setPriceImpact(true)
    //     messageApi.notifyWarning("Price Impact too high")
    //   } 
    // }
    console.log("currentPool_One", currentPool)
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
        disabled={!currentPool || !currentPool.balance1 || !currentPool.balance2 || priceImpact}
        onClick={handleSwapBtn}
      >
        {priceImpact? 'Price Impact': currentPool && currentPool.balance1 > 0 && currentPool.balance2 > 0 ? 'Swap' : 'No pool exists'}
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
    if(!currentPool || !currentPool.balance1 || !currentPool.balance2) 
      return <></>
    let rateVal = 0;
    if (currentPool.token1 === "BTC") {
      rateVal = currentPool.balance2 / currentPool.balance1 * 1e8
    } else if (currentPool.token2 === "BTC") {
      rateVal = (currentPool.balance2 / currentPool.balance1 / 1e8).toFixed(8)
    } else {
      rateVal = currentPool.balance2 / currentPool.balance1
    }
    return <p style={{textAlign: 'center'}}>{`1 ${currentPool.token1} = ${rateVal} ${currentPool.token2}`}</p>
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
      <section className="exchange__container-swap glass-effect center-margin">
        <header>
          <div>
            <h2>Swap</h2>
            <p>Trade tokens in an instant</p>
            {/* <p style={{color: "red"}}>please contact me on Telegram. <a href="https://t.me/@crypto0405" target="_blank">Nestor: @crypto0405</a></p> */}
          </div>
          <hr />
          {/* <div className="btn-actions">
            <button className="setting__wrapper">
              <SettingsIcon onClick={handleSettingsOpen} />

              {toggleSetting && (
                <div
                  tabIndex={0}
                  className="setting__menu"
                  onBlur={handleSettingBlur}
                  ref={settingRef}
                >
                  <p className="">
                    Settings <CancelIcon onClick={handleSettingsClose} />
                  </p>

                  <p className="my-4">Slippage Tolerance</p>

                  <div className="tabs tabs-boxed">
                    <button
                      className={`tab ${percentage === 1 ? "tab-active" : ""
                        }`}
                      onClick={() => setPercentage(1)}
                    >
                      0.5%
                    </button>
                    <button
                      className={`tab ${percentage === 2 ? "tab-active" : ""
                        }`}
                      onClick={() => setPercentage(2)}
                    >
                      2.5%
                    </button>
                    <button
                      className={`tab ${percentage === 3 ? "tab-active" : ""
                        }`}
                      onClick={() => setPercentage(3)}
                    >
                      5%
                    </button>
                  </div>
                </div>
              )}
            </button>
            <button>
              <RefreshIcon />
            </button>
          </div> */}
        </header>

        <div className="swap__form center-margin">
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
                // console.log("poschange", tokenTwoAmount, tempAmount)
              }}
            >
              {'<->'}
            </div>
            {!posChange &&
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
            }
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
            {posChange &&
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
            }
          </div>
          <hr />
          {/* {true &&
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
            />
          } */}
          {true && 
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
          }
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

      <section className="table__container">
        {/* <header className="flex items-center">
          <Filters />
        </header> */}

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
