import React, { useState } from "react";
import NFTItem from "../components/NFTItem";
import searchIcon from "../assets/icons/search.svg";
import Pagination from "../components/Pagination";
import { NFT_DATA } from "../assets/data";
import { Link } from "react-router-dom";
import NFTCollectionIcon from "../assets/icons/NFTCollectionIcon";
import NFTUploadIcon from "../assets/icons/NFTUploadIcon";

function NFT() {
    return (
        <>
            <section className="nft__container">
                <section className="backdrop__container">
                    <h2>Coming Soon.</h2>

                </section>
                <div className="btn-actions pb-12">
                    <Link
                        className="d-btn d-btn-primary flex items-center gap-4"
                        to={"/nft-collection"}
                    >
                        <NFTCollectionIcon />
                        NFT Collection
                    </Link>

                    <Link
                        className="d-btn d-btn-primary flex items-center gap-4"
                        to={"/nft-upload"}
                    >
                        <NFTUploadIcon />
                        NFT Upload
                    </Link>
                </div>

                <section className="nft__collection">
                    <header>
                        <h1>DexOrdi Collectibles</h1>
                        <div className="search-bar">
                            <img src={searchIcon} alt="search" />
                            <input type="text" name="search" id="search" placeholder="Search" />
                        </div>
                    </header>

                    <section className="collection__list">
                        {NFT_DATA.map((item) => (
                            <NFTItem
                                id={item.id}
                                key={item.id}
                                url={item.url}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                            />
                        ))}
                    </section>

                    {/* <Pagination /> */}
                </section>
            </section>
        </>
    );
}

export default NFT;
