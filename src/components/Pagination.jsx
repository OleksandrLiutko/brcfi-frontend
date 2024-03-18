import React, { useState } from "react";
import LeftAngle from "../assets/icons/LeftAngle";
import RightAngle from "../assets/icons/RightAngle";

function Pagination({ justPageNumbers = false, table }) {
    const [collectionStats, setCollectionStats] = useState({
        current: 1,
        limit: 50,
        total: 10043,
    });
    const [currentPage, setCurrentPage] = useState(0);

    return (
        <section className={`pagination__container ${justPageNumbers ? "justify-center" : ""}`}>
            {!justPageNumbers && (
                <div className="collection__stats hide-mobile">
                    <p>
                        Showing {collectionStats.current} - {collectionStats.limit} out of{" "}
                        {collectionStats.total}
                    </p>
                </div>
            )}

            <div className="pagenumbers__container">
                <button onClick={() => { table.previousPage() }}>
                    <LeftAngle />
                </button>
                <ul>
                    {Array(table.getPageCount()).fill('')
                        .map((item, index) =>
                            <li key={index}>
                                <button
                                    className={index == currentPage ? 'active' : 'inactive'}
                                    onClick={() => {
                                        table.setPageIndex(index)
                                        setCurrentPage(index)
                                    }}
                                >
                                    {index + 1}
                                </button>
                            </li>)}
                </ul>
                <button onClick={() => { if (table.getCanNextPage()) table.nextPage() }}>
                    <RightAngle />
                </button>
            </div>

            {!justPageNumbers && (
                <p className="list-limit hide-mobile">
                    Shows rows{" "}
                    <select name="list-limit" id="list-limit">
                        <option value="50">50</option>
                    </select>
                </p>
            )}
        </section>
    );
}

export default Pagination;
