import React, { useState } from "react";
import FilterIcon from "../assets/icons/FilterIcon";
import CheckOutlineIcon from "../assets/icons/CheckOutlineIcon";

const filters = [
    {
        label: "All",
        val: 0,
    },
    {
        label: "Listed",
        val: 1,
    },
    {
        label: "Accepted",
        val: 2,
    },
    {
        label: "Failed",
        val: 98,
    },
    {
        label: "Success",
        val: 99,
    },
    {
        label: "Pending",
        val: 100,
    },
];

function Filters() {
    const [activeFilter, setActiveFilter] = useState(0);
    const [toggleFiltersList, setToggleFiltersList] = useState(false);

    const handleFilterClick = (val) => {
        setActiveFilter(val);
    };

    const handleToggleFilters = () => {
        setToggleFiltersList((prevState) => !prevState);
    };

    return (
        <section
            className={`filters__container ${toggleFiltersList ? "active" : ""}`}
            onClick={handleToggleFilters}
        >
            <h5>
                {filters[activeFilter].label}
                <span className="icon-s">
                    <FilterIcon />
                </span>
            </h5>

            <ul className={`filters__list ${toggleFiltersList ? "active" : ""}`}>
                {filters.map((filter, index) => {
                    return (
                        <li
                            className={`filter__item ${activeFilter === filter.val ? "active" : ""
                                }`}
                            key={filter.val}
                            onClick={() => handleFilterClick(index)}
                        >
                            {filter.label}{" "}
                            <span className="icon-xs">
                                <CheckOutlineIcon />
                            </span>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

export default Filters;
