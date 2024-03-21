import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import logo from "../assets/images/logo-baner.png";
// import logoDark from "../assets/logo/dexordi-dark.svg";

import ExchangeIcon from "../assets/icons/ExchangeIcon";
import DashboardIcon from "../assets/icons/DashboardIcon";
import BrcScanIcon from "../assets/icons/BrcScanIcon"
import LaunchGround from "../assets/icons/LaunchGround"
import Wallet from "../assets/icons/Wallet"
import DAOIcon from "../assets/icons/DAOIcon";
import SwapIcon from "../assets/icons/SwapIcon";
import PoolIcon from "../assets/icons/PoolIcon";
import NFTIcon from "../assets/icons/NFTIcon";
// import NFTCollectionIcon from "../assets/icons/NFTCollectionIcon";
// import NFTUploadIcon from "../assets/icons/NFTUploadIcon";
import LinkIcon from "../assets/icons/LinkIcon";
import twitterIcon from "../assets/icons/twitter.svg";
import mediumIcon from "../assets/icons/Medium.svg";
import telegramIcon from "../assets/icons/telegram.svg";
import discordIcon from "../assets/icons/discord.svg"
import webIcon from "../assets/icons/web.svg";
import lightIcon from "../assets/icons/light-icon.png";
import darkIcon from "../assets/icons/dark-icon.png";

import { useAuthState } from "../context/AuthContext";
import LPIcon from "../assets/icons/LPIcon";

function Aside({ setToggleMobileMenu }) {

    const navigate = useNavigate();
    const { authState, updateTheme } = useAuthState();
    const closeMenu = (e) => {
        // e.preventDefault();
        setToggleMobileMenu(false);
    }
    return (
        <aside className={`app__menu`}>
            <figure className="logo__container_aside hide-mobile gap-3 opacity-40" onClick={() => { navigate('/') }}>
                {/* <img
                    src={logo} alt="logo"
                    width={200}
                    height={50}
                /> */}
                <p>Main menu</p>
                {/* <span>BrcFi</span> */}
            </figure>

            <ul className="nav__list">
                <li>
                    <NavLink className="d-btn d-btn-primary" to={"/"} onClick={closeMenu}>
                        <DashboardIcon />
                        Dashboard
                    </NavLink>
                </li>
                <li >
                    <NavLink className="d-btn d-btn-primary" to={"/swap"} onClick={closeMenu} >
                        <ExchangeIcon />
                        Swap
                    </NavLink>
                </li>
                <li>
                    <NavLink className="d-btn d-btn-primary" to={"/liquidity"} onClick={closeMenu}>
                        <SwapIcon />
                        Liquidity
                    </NavLink>
                </li>
                <li>
                    <NavLink className="d-btn d-btn-primary" to={"/pool"} onClick={closeMenu}>
                        <LPIcon />
                        Pool
                    </NavLink>
                </li>
                {/* <li>
                    <NavLink className="d-btn d-btn-primary" to={"/lending"} onClick={closeMenu}>
                        <PoolIcon />
                        Lending/Borrowing
                    </NavLink>
                </li> */}
                <li>
                    <NavLink className="d-btn d-btn-primary" to={"/launchground"} onClick={closeMenu}>
                        <LaunchGround />
                        Launch Pad{/* LaunchGround */}
                    </NavLink>
                </li>
                {/* <li>
                    <NavLink className="d-btn d-btn-primary" to={"/brcscan"} onClick={closeMenu}>
                        <BrcScanIcon />
                        BrcScan
                    </NavLink>
                </li> */}
                {/* <li>
                    <NavLink className="d-btn d-btn-primary" to={"/wallet"} onClick={closeMenu}>
                        <Wallet />
                        Wallet
                    </NavLink>
                </li> */}

                {/* <li>
                    <NavLink className="d-btn d-btn-primary" to={"/nft-collection"}>
                        <NFTCollectionIcon />
                        NFT Collection
                    </NavLink>
                </li>
                <li>
                    <NavLink className="d-btn d-btn-primary" to={"/nft-upload"}>
                        <NFTUploadIcon />
                        NFT Upload
                    </NavLink>
                </li> */}
                {/* <li>
                    <button className="d-btn d-btn-primary noeffect" onClick={closeMenu}>
                        <LinkIcon />
                        More
                    </button>

                    <ul>
                        <li>
                            <a href="https://brcfi.io" target="_blank">Official website</a>
                        </li>
                        <li>
                            <a href="https://doc.bitcswap.io/" target="_blank">Doc</a>
                        </li>
                        
                    </ul>
                </li> */}
            </ul>

            <footer>
                {/* <p>Contact</p> */}

                <ul>
                    <li>
                        <a href="https://twitter.com/Brc_Fi" target="_blank">
                            <img src={twitterIcon} alt="twitter" />
                        </a>
                    </li>
                    <li>
                        <a href="https://t.me/BRC_Fi" target="_blank">
                            <img src={telegramIcon} alt="telegram" />
                        </a>
                    </li>
                    {/* <li>
                        <a href="https://medium.com/@BitcSwap" target="_blank">
                            <img src={mediumIcon} alt="medium" />
                        </a>
                    </li> */}
                    <li>
                        <a href="https://brcfi.io" target="_blank">
                            <img src={webIcon} alt="discord" />
                        </a>
                    </li>
                </ul>

                {/* <div className="switch-theme" onClick={updateTheme}>
                    <img src={authState.preferDark ? lightIcon : darkIcon} alt="dark theme" />
                </div> */}
            </footer>
        </aside>
    );
}

export default Aside;
