import { Pagination } from "@tanstack/table-core";
import TimeIcon from "../../../assets/icons/TimeIcon";
import BlockScan from "../BlockScan";
import NoDataIcon from "../../../assets/icons/NoDataIcon";
import OrderStatus from "../OrderStatus";
import TooltipComp from "../Tooltip";
import { useAuthState } from "../../../context/AuthContext";
import { useState } from "react";
import MobilePagination from "./MobilePagination";


export function AddLiquidityTable({ dataSource }) {

  const [currentPage, setCurrentPage] = useState(0);
  const totalPageNumber = Math.ceil(dataSource.length / 2);

  const gotoPreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  }

  const gotoNextPage = () => {
    if (currentPage < totalPageNumber - 1) setCurrentPage(currentPage + 1);
  }

  const { unisatContext, appContext } = useAuthState();
  const { unisatWallet, connected, setUnisatInstalled, address, network, balance, connectWallet, checkConnect } = unisatContext;
  const { factoryWallet, poolList, tokenSelectList, tokenOne, tokenTwo, setTokenOne, setTokenTwo, orderList, loadOrderList, currentPool, calculateFee } = appContext;

  const TokenSend = ({ record, id }) => {
    const status = record.order_status;
    const transfer = id == 1 ? record.token_transfer1 : record.token_transfer2;
    const token = id == 1 ? record.token1 : record.token2;
    const amount = id == 1 ? record.token_amount1 : record.token_amount2;
    const inscriptionId = transfer ? transfer.inscription : ''
    const disabled = (status != 11 || localStorage.getItem(inscriptionId) == 'true')
    const targetWallet = poolList.length ? poolList.find((pool) => pool.lp_token === record.lp_token).address : '';
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
                await window.unisat.sendInscription(targetWallet, inscriptionId);
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

  if (dataSource.length == 0) {
    return (
      <span className="nodata__container">
        <NoDataIcon />
        No Data
      </span>
    )
  }
  return (<section className="table__mb hide-desktop">
    {dataSource.slice(0, 2).map((item) => {
      return (
        <article className="table__item hide-desktop" key={item.no}>
          <div>
            <p>No</p>
            <h4>{item.no}</h4>
            <p className="flex items-center gap-8">
              <TimeIcon classes="icon" /> 07:56 5/6/2023
            </p>
          </div>

          <div>
            <p>Transaction</p>
            <h4><BlockScan transaction={item.fee_txid} /></h4>
            <p>Description</p>
          </div>

          <div>
            <p>Fee Rate</p>
            <h4>{item.fee_rate}</h4>
            <p>{item.description}</p>
          </div>

          <div>
            <p>Token Pair</p>
            <h4>{item.token1 + '/' + item.token2}</h4>
            <p> </p>
          </div>

          <div>
            <p>Token Amount</p>
            <h4>{item.token1 === 'BTC'? item.token_amount1/ 1e8: item.token_amount1 + '/' + item.token2 === 'BTC'? item.token_amount2/ 1e8: item.token_amount2}</h4>
            <p>Send Token1  </p>
          </div>

          <div>
            <p>LP Token</p>
            <h4>{item.lp_token}</h4>
            <TokenSend record={item} id={1} />
          </div>

          <div>
            <p>Rewards</p>
            <h4>{item.lp_token_amount}</h4>
            <p>Send Token2  </p>
          </div>

          <div>
            <p>Status</p>
            <h4>
              <OrderStatus status={item.status} />
            </h4>
            <TokenSend record={item} id={2} />
          </div>
        </article>
      );
    })}
    <MobilePagination
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      gotoNextPage={gotoNextPage}
      gotoPreviousPage={gotoPreviousPage}
      totalPageNumber={totalPageNumber}
    />
  </section>
  )
}