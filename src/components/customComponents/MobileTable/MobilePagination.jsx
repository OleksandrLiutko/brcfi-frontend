import React, { useState } from "react";
import LeftAngle from "../../../assets/icons/LeftAngle";
import RightAngle from "../../../assets/icons/RightAngle";

function MobilePagination({ currentPage, setCurrentPage, gotoPreviousPage, gotoNextPage, totalPageNumber }) {

  return (
    <section className={`pagination__container "justify-center"`}>
      {/* {!justPageNumbers && (
        <div className="collection__stats hide-mobile">
          <p>
            Showing {collectionStats.current} - {collectionStats.limit} out of{" "}
            {collectionStats.total}
          </p>
        </div>
      )} */}
      <div className="pagenumbers__container">
        <button onClick={gotoPreviousPage}>
          <LeftAngle />
        </button>
        <ul>
          {Array(totalPageNumber).fill('')
            .map((item, index) =>
              <li key={index}>
                <button
                  className={index == currentPage ? 'active' : 'inactive'}
                  onClick={() => {
                    setCurrentPage(index)
                  }}
                >
                  {index + 1}
                </button>
              </li>)}
        </ul>
        <button onClick={gotoNextPage}>
          <RightAngle />
        </button>
      </div>

      {/* {!justPageNumbers && (
        <p className="list-limit hide-mobile">
          Shows rows{" "}
          <select name="list-limit" id="list-limit">
            <option value="50">50</option>
          </select>
        </p>
      )} */}
    </section>
  );
}

export default MobilePagination;
