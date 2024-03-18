import React, { useState } from "react";
import ClipIcon from "../assets/icons/ClipIcon";
import ClipIcon1 from "../assets/icons/ClipIcon";
import UploadFile from "../assets/icons/UploadFile";
import bitcoin from "../assets/icons/bitcoin.svg";

function NFTUpload() {
    const [uploadState, setUploadState] = useState(1);
    return (
        <section className="nft__upload__container">
            <section className="upload__content glass-effect">
                <h2>
                    Upload anything to
                    <ClipIcon1 width="5rem" height="5rem" />
                </h2>
                <div className="btn-group">
                    <button
                        className={`d-btn d-btn-primary ${uploadState === 1 ? "active" : ""}`}
                        onClick={() => setUploadState(1)}
                    >
                        File
                    </button>
                    <button
                        className={`d-btn d-btn-primary ${uploadState === 2 ? "active" : ""}`}
                        onClick={() => setUploadState(2)}
                    >
                        Text
                    </button>
                    <button
                        className={`d-btn d-btn-primary ${uploadState === 3 ? "active" : ""}`}
                        onClick={() => setUploadState(3)}
                    >
                        BRC-20
                    </button>
                    <button
                        className={`d-btn d-btn-primary ${uploadState === 4 ? "active" : ""}`}
                        onClick={() => setUploadState(4)}
                    >
                        .sats/.ltc/.doge
                    </button>
                </div>

                {uploadState === 1 && (
                    <>
                        <div className="form-group">
                            <label htmlFor="file" className="file">
                                <UploadFile />
                                <p>Click or drag file to this area to upload</p>
                                <input type="file" name="file" id="file" />
                            </label>
                        </div>
                        <div className="btn-group">
                            <button className="d-btn d-btn-primary active">Bulk Inscribe</button>
                        </div>
                    </>
                )}

                {uploadState === 2 && (
                    <>
                        <div className="form-group">
                            <label htmlFor="happening">What’s Happening?</label>
                            <textarea
                                name="happening"
                                id="happening"
                                cols="10"
                                rows="10"
                            ></textarea>
                        </div>
                        <div className="btn-group">
                            <button className="d-btn d-btn-primary active">
                                Bulk Inscribe your Text
                            </button>
                        </div>
                    </>
                )}

                {uploadState === 3 && (
                    <>
                        <div className="radio-group">
                            <div>
                                <input
                                    type="radio"
                                    name="rad"
                                    id="mints"
                                    className="radio radio-primary"
                                    defaultChecked
                                />
                                <label htmlFor="mints">Mints</label>
                            </div>

                            <div>
                                <input
                                    type="radio"
                                    name="rad"
                                    id="deploy"
                                    className="radio radio-primary"
                                />
                                <label htmlFor="deploy">Deploy</label>
                            </div>
                        </div>

                        <h4>
                            Chain: <img src={bitcoin} alt="bitcoin" /> <span>Protocol: brc-20</span>
                        </h4>

                        <form action="#" className="upload__brc-form">
                            <div>
                                <label htmlFor="tick">Tick</label>
                                <input
                                    type="text"
                                    name="order"
                                    id="order"
                                    placeholder="Address to Receive Inscription (optional):"
                                />
                            </div>
                            <div>
                                <label htmlFor="amount">Amount</label>
                                <input
                                    type="text"
                                    name="order"
                                    id="order"
                                    placeholder="Amount"
                                    defaultValue={1}
                                />
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="repeatMint">Repeat Mint</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        defaultValue="40"
                                        className="range range-primary"
                                    />
                                </div>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="rangeValue"
                                    id="rangeValue"
                                    defaultValue={100}
                                />
                            </div>
                        </form>
                    </>
                )}

                {uploadState === 4 && (
                    <>
                        <div className="form-group">
                            <h4>
                                Chain: <img src={bitcoin} alt="bitcoin" />
                            </h4>
                            <label htmlFor="happening">
                                Add your .sats/.ltc/.doge names below, each one on a new line.
                            </label>
                            <textarea
                                name="happening"
                                id="happening"
                                cols="10"
                                rows="10"
                            ></textarea>
                        </div>
                        <div className="btn-group">
                            <button className="d-btn d-btn-primary active">
                                Bulk Inscribe your Text
                            </button>
                        </div>
                    </>
                )}

                <div className="recieve info-box">
                    <p>Address to Receive Inscription (optional):</p>
                    <input
                        type="text"
                        name="recieve"
                        id="recieve"
                        placeholder="Address to Receive Inscription (optional):"
                    />

                    <div className="btn-group">
                        <button className="d-btn d-btn-primary active">How does this work</button>
                        <button className="d-btn d-btn-primary active">Pay & Inscribe</button>
                    </div>
                </div>

                <div className="order info-box">
                    <p>Enter your Order ID</p>
                    <input type="text" name="order" id="order" placeholder="Enter your Order ID" />

                    <div className="btn-group">
                        <button className="d-btn d-btn-primary active">Get Order Info</button>
                    </div>
                </div>
            </section>
        </section>
    );
}

export default NFTUpload;
