import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { useAuthState } from "./context/AuthContext";
import { useModalState } from "./context/ModalContext";

import Header from "./components/Header";
import Aside from "./components/Aside";

import Dashboard from "./pages/Dashboard";
import Exchange from "./pages/Exchange";
import NFT from "./pages/NFT";
import Pool from "./pages/Pool";
import Swap from "./pages/Swap";
import DAO from "./pages/DAO";
import Bridge from "./pages/Bridge";
import NFTDetail from "./pages/NFTDetail";
import NFTCollection from "./pages/NFTCollection";
import NFTUpload from "./pages/NFTUpload";

import "react-toastify/dist/ReactToastify.min.css";
import "react-tooltip/dist/react-tooltip.css";
import "./App.css";
import { useResponsiveView } from "./utils/customHooks";
import DataList from "./components/DataList";

import btcIcon from "./assets/icons/btc.png";
import ethIcon from "./assets/icons/etherium.png";
import arbitIcon from "./assets/icons/arbitrum.png";
import CancelIcon from "./assets/icons/CancelIcon";
import okxWalletIcon from "./assets/icons/okxWalletIcon.png";
import metamaskWalletIcon from "./assets/icons/metamaskWalletIcon.png";
import unisatWalletIcon from "./assets/icons/unisatWalletIcon.png";
import Modal from "./components/Modal";
import Lending from "./pages/Lending";
import BrcScan from "./pages/BrcScan";
import LaunchGround from "./pages/LaunchGround";
import Wallet from "./pages/Wallet";

const networkOptions = [
    {
        icon: btcIcon,
        value: 1,
        tick: "Bitcoin Testnet",
    },
    // {
    //     icon: ethIcon,
    //     value: 2,
    //     tick: "Ethereum Mainnet",
    // },
    // {
    //     icon: arbitIcon,
    //     value: 3,
    //     tick: "Arbitrum Mainnet",
    // },
    // {
    //     icon: btcIcon,
    //     value: 3,
    //     tick: "Bitcoin Test",
    // },
    // {
    //     icon: ethIcon,
    //     value: 4,
    //     tick: "Ethereum Mainnet 2",
    // },
    // {
    //     icon: arbitIcon,
    //     value: 5,
    //     tick: "Arbitrum Mainnet 3",
    // },
];

const walletOptions = [
    {
        icon: okxWalletIcon,
        value: 1,
        label: "OKX Wallet",
        label2: "Support Bitcoin Wallet",
    },
    {
        icon: unisatWalletIcon,
        value: 2,
        label: "Unisat Wallet",
        label2: "Support Bitcoin Wallet",
    },
    {
        icon: metamaskWalletIcon,
        value: 3,
        label: "MetaMask Wallet",
    },
];

function App() {
    const { authState } = useAuthState();
    const { modalState } = useModalState();
    const isMobileView_800 = useResponsiveView();
    const [networkList, setNetworkList] = useState(false);
    const [walletList, setWalletList] = useState(false);

    const [toggleMobileMenu, setToggleMobileMenu] = useState(false);

    useEffect(() => {
        if (authState.preferDark) {
            document.documentElement.style.setProperty("--color-base", "#1A1D1F");
            document.documentElement.style.setProperty("--color-base1", "#272B30");
            document.documentElement.style.setProperty("--color-base2", "#373737");
            document.documentElement.style.setProperty("--color-text", "#ffffff");
            document.documentElement.style.setProperty(
                "--color-backgroundDim",
                "rgba(0, 0, 0, 0.5)"
            );
            document.documentElement.style.setProperty(
                "--color-boxShadow",
                "0px 4px 20px rgba(0, 0, 0, 0.11)"
            );
            document.documentElement.style.setProperty("--color-border", "#373737 ");
            document.documentElement.style.setProperty("--theme", "dark");
        } else {
            document.documentElement.style.setProperty("--color-base", "rgba(255, 255, 255, 0.4)");
            document.documentElement.style.setProperty("--color-base1", "#ffffff");
            document.documentElement.style.setProperty("--color-base2", "#ffffff");
            document.documentElement.style.setProperty("--color-text", "#000");
            document.documentElement.style.setProperty(
                "--color-backgroundDim",
                "rgba(255, 255, 255, 0.5)"
            );
            document.documentElement.style.setProperty(
                "--color-boxShadow",
                "0px 4px 20px rgba(0, 0, 0, 0.11)"
            );
            document.documentElement.style.setProperty("--color-border", "#f0f0f0 ");
            document.documentElement.style.setProperty("--theme", "light");
        }
    }, [authState.preferDark]);

    const handleDataListBlur = (e) => {
        e.stopPropagation();
        setTimeout(() => {
            setNetworkList(false);
        }, 100);
    };

    const handleNetworkChange = (option) => {
        console.log(option);
    };

    const toggleNetworkList = () => {
        setNetworkList((prevState) => !prevState);
    };

    const toggleWalletList = () => {
        setWalletList((prevState) => !prevState);
    };

    const [show, setShow] = useState(true);
    const onClose = (e) => {
        setShow(false)
    }

    return (
        <div className={`${authState.preferDark ? "dark-theme" : ""} body__container`}>
            {/* {show && <Modal onClose={onClose} />} */}
            <Header
                toggleWalletList={toggleWalletList}
                toggleNetworkList={toggleNetworkList}
                toggleMobileMenu={toggleMobileMenu}
                setToggleMobileMenu={setToggleMobileMenu}
            />
            <main className={`main__container ${authState.preferDark ? "dark-theme" : ""}`}>
                {!isMobileView_800 && <Aside setToggleMobileMenu={setToggleMobileMenu} />}

                <section className="main__content glass-effect">
                    <ToastContainer autoClose={false} hideProgressBar={true} newestOnTop={true} />

                    <Routes>
                        <Route path="/" element={<Dashboard />}></Route>
                        <Route path="/liquidity" element={<Exchange />}></Route>
                        <Route path="/nft" element={<NFT />}></Route>
                        <Route path="/nft/:id" element={<NFTDetail />}></Route>
                        <Route path="/nft-collection" element={<NFTCollection />}></Route>
                        <Route path="/nft-upload" element={<NFTUpload />}></Route>
                        <Route path="/pool" element={<Pool />}></Route>
                        <Route path="/swap" element={<Swap />}></Route>
                        <Route path="/dao" element={<DAO />}></Route>
                        <Route path="/bridge" element={<Bridge />}></Route>
                        <Route path="/lending" element={<Lending />}></Route>
                        <Route path="/brcscan" element={<BrcScan />}></Route>
                        <Route path="/launchground" element={<LaunchGround />}></Route>
                        <Route path="/wallet" element={<Wallet />}></Route>
                    </Routes>

                    {modalState.addModalContainer && (
                        <section className="modal__container backdrop__container" id="modal" />
                    )}

                    {/* {networkList && (
                        <section className="networkList__container backdrop__container">
                            <DataList
                                placeholder="Search Network"
                                typeRadio={true}
                                value={authState.network}
                                options={networkOptions}
                                handleBlur={handleDataListBlur}
                                handleOptionClick={handleNetworkChange}
                            // show={networkList}
                            />
                        </section>
                    )} */}

                    {walletList && (
                        <section className="walletList__container backdrop__container">
                            <section className="wallet__content">
                                <header>
                                    <h3>Connect your wallet</h3>{" "}
                                    <button onClick={toggleWalletList}>
                                        <CancelIcon />
                                    </button>
                                </header>

                                <ul>
                                    {walletOptions.map((item) => {
                                        return (
                                            <li
                                                className={`${item.value === authState.wallet ? "active" : ""
                                                    }`}
                                                key={item.label}
                                            >
                                                <div>
                                                    <h3>{item.label}</h3>
                                                    {item.label2 && <p>{item.label2}</p>}
                                                </div>

                                                <img src={item.icon} alt={item.label} />
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        </section>
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;
