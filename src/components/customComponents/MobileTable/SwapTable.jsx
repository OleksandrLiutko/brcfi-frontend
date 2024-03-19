import TimeIcon from "../../../assets/icons/TimeIcon";
import BlockScan from "../BlockScan";
import { formatTime } from "../../../utils/constants";
import NoDataIcon from "../../../assets/icons/NoDataIcon";
import OrderStatus from "../OrderStatus";
import TooltipComp from "../Tooltip";
import { useAuthState } from "../../../context/AuthContext";
import { useState } from "react";
import MobilePagination from "./MobilePagination";


export function SwapTable({ dataSource }) {

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
  const { factoryWallet, poolList, tokenSelectList, tokenOne, tokenTwo, setTokenOne, setTokenTwo, orderList, loadOrderList, currentPool } = appContext;


  const tokenSend = (record, id) => {
    const status = record.order_status;
    const transfer = record.in_token_transfer;
    const token = record.in_token;
    const amount = id == 1 ? record.token1_amount : record.token2_amount;
    const inscriptionId = transfer ? transfer.inscriptions[0].id : ''
    const disabled = (inscriptionId == '' || localStorage.getItem(inscriptionId) == 'true')
    const targetWallet = poolList.find((pool) => pool.lp_token === record.lp_token).address;
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
              <TimeIcon classes="icon" />
              {formatTime(item.start_time)}
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
            <p>Send Token</p>
            <h4>{item.in_token}</h4>
          </div>

          <div>
            <p>Send Amount</p>
            <h4>{item.in_token === 'BTC'? item.in_token_amount/ 1e8 : item.in_token_amount}</h4>
          </div>

          <div>
            <p>Receive Token</p>
            <h4>{item.out_token}</h4>
            <p> </p>
          </div>

          <div>
            <p>Receive Amount</p>
            <h4>{item.out_token === 'BTC'? item.out_token_amount/ 1e8 : item.out_token_amount}</h4>
            <p>Send In Token</p>
          </div>

          <div>
            <p>Status</p>
            <OrderStatus status={item.status} />

            {tokenSend(item)}
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