import { Pagination } from "@tanstack/table-core";
import TimeIcon from "../../../assets/icons/TimeIcon";
import BlockScan from "../BlockScan";
import NoDataIcon from "../../../assets/icons/NoDataIcon";
import { formatTime } from "../../../utils/constants";
import OrderStatus from "../OrderStatus";
import { useState } from "react";
import MobilePagination from "./MobilePagination";


export function CreatePoolTable({ dataSource }) {

  const [currentPage, setCurrentPage] = useState(0);
  const totalPageNumber = Math.ceil(dataSource.length / 2);

  const gotoPreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  }

  const gotoNextPage = () => {
    if (currentPage < totalPageNumber - 1) setCurrentPage(currentPage + 1);
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
    {dataSource.slice(currentPage * 2, currentPage * 2 + 2).map((item) => {
      return (
        <article className="table__item hide-desktop" key={item.no}>
          <div>
            <p>No</p>
            <h4>{item.no}</h4>
            <p className="flex items-center gap-8">
              <TimeIcon classes="icon" />{formatTime(item.ordered_time)}
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
            <p>LP token</p>
            <h4>{item.lp_token}</h4>
            <p> </p>
          </div>

          <div>
            <p>Status</p>
            <OrderStatus status={item.status} />
            {/* <button className="table-btn table-btn-primary">Send</button> */}
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