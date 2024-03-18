import React from "react";
import ordinals from "../assets/icons/ordinals.svg";
import { Link } from "react-router-dom";

function NFTItem({ id, url, name, description, price }) {
    return (
        <Link to={`/nft/${id}`} className="card bg-base-100 shadow-xl">
            <figure>
                <img src={url} alt="Shoes" loading="lazy" />
            </figure>

            <div className="card-body">
                <div className="top">
                    <div className="card-title">
                        <h4>{name}</h4>
                        <p>{description}</p>
                    </div>

                    <div className="price">
                        <img src={ordinals} alt="ordinals" />
                        <span>{price}</span>
                    </div>
                </div>

                <div className="card-actions justify-between">
                    <span className="id">#{id}</span>
                    <button className="d-btn d-btn-primary active">Buy Now</button>
                </div>
            </div>
        </Link>
    );
}

export default NFTItem;
