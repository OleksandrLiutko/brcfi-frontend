import React, { useEffect, useState } from "react";
import "../styles/pages/reward.scss";
import BlockScan from "../components/customComponents/BlockScan";
import OrderStatus from "../components/customComponents/OrderStatus";
import DataTable from "../components/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { useAuthState } from "../context/AuthContext";
import { getAdminApi, getRewardsApi, withdrawApi } from "../utils/apiRoutes";
import useFetch from "../hooks/useFetch";
import { formatTime } from "../utils/constants";
import { useModalState } from "../context/ModalContext";
import Modal from "../components/Modal";
import ReactPortal from "../components/ReactPortal";
import { useToast } from "../hooks/useToast";
import axios from "axios";

const columnHelper = createColumnHelper();

const columns = [
    columnHelper.accessor("no", {
        header: () => <span>No</span>,
        cell: (info) => info.getValue(),
        width: '20px'
    }),
    columnHelper.accessor("fee_txid", {
        header: () => "Transaction",
        cell: (info) => <BlockScan transaction={info.getValue()} />
    }),
    columnHelper.accessor("fee_rate", {
        header: () => <span>Fee Rate</span>,
    }),
    columnHelper.accessor((row) => row.start_time, {
        id: "orderedTime",
        cell: (info) => <i>{formatTime(info.getValue())}</i>,
        header: () => <span>Ordered Time</span>,
    }),
    // columnHelper.accessor("in_token", {
    //     header: "Send Token",
    // }),
    // columnHelper.accessor("in_token_amount", {
    //     header: "Send Amount",
    // }),
    // columnHelper.accessor("Send in token", {
    //     header: "Send",
    //     cell: info => tokenSend(info.row.original)
    // }),
    // columnHelper.accessor("out_token", {
    //     header: "Receive Token",
    // }),
    // columnHelper.accessor("Withdraw", {
    //     header: "Function",
    // }),
    columnHelper.accessor('order_status', {
        header: 'Order status',
        cell: (info) => <OrderStatus status={info.getValue()} />
    }),
    columnHelper.accessor("description", {
        header: "Description",
    }),
];

const poolRender = (record) => {
    return <span>{`${record.token1}/${record.token2}`}</span>
}

function Reward() {
    const {messageApi} = useToast()
    const [admin, setAdmin] = useState(false);
    const [creator, setCreator] = useState(false);
    const { modalState, openModal, closeModal } = useModalState();
    const {unisatContext, appContext} = useAuthState();
    const {address, connectWallet, checkConnect, unisatWallet} = unisatContext;
    const {orderList, calculateFee, factoryWallet, loadOrderList} = appContext;
    const [rewardsData, fetchRewardsData] = useFetch(getRewardsApi(address));
    const [adminAddress, fetchAdminAddress] = useFetch(getAdminApi);
    const [showFeeReteModal, setShowFeeRateModal] = useState(false);
    const [feeRate, setFeeRate] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [isDisabled, setIsDisabled] = useState(false)

    useEffect(() => {
        if(address) {
            fetchRewardsData()
        }
    },[address])

    useEffect(() => {
        fetchAdminAddress()
    },[])

    useEffect(() => {
        if (rewardsData) {
            setCreator(false)
            if (rewardsData.lp_holder_balance > 0)
                setCreator(true)
        }
    },[address, rewardsData])

    useEffect(() => {
        setAdmin(address == adminAddress)
    }, [adminAddress, fetchAdminAddress, address])

    useEffect(() => {
        const parseList = async() => {
            setIsDisabled(false)
            const orders = orderList.filter((row) => row.order_type == 5 && row.order_status != 99)
            if (orders && orders.length > 0) setIsDisabled(true)
        }
        parseList()
    }, [orderList, loadOrderList])

    const onClaimReward = async(e) => {
        e.preventDefault();
        const walletCheck = await checkConnect();
        if (!walletCheck) {
            await connectWallet();
            return;
        }
        setShowFeeRateModal(true)
    }

    const onCloseFeeRateModal = (e) => {
        setShowFeeRateModal(false)
    }
  
    const onConfirmFeeRate = (feeRate) => {
      setFeeRate(feeRate);
      openModal();
      setShowFeeRateModal(false);
    }

    const handleWithdraw = async() => {
        setIsLoading(true);
        const walletCheck = await checkConnect();
        // console.log('walletCheck :>> ', walletCheck);
        if (!walletCheck) return;
        try {
            messageApi.notifyWarning(
                `Ordering Withdraw BTC`,
                10
            );
            let tx_id;
            tx_id = await unisatWallet.sendBitcoin(factoryWallet, calculateFee(feeRate).withdraw_fee);
            const body = {
                sender_address: address,
                fee_txid: tx_id,
                fee_rate: feeRate,
                withdraw_address: address,
                withdraw_amount: rewardsData.admin_balance + rewardsData.lp_holder_balance
            }
            // console.log('window.unisat :>> ', body);
            const { data } = await axios({
                method: 'post',
                url: withdrawApi,
                withCredentials: false,
                data: body,
            });
            // console.log('withdraw_response', data);
            if (data.status == 'ok') {
                messageApi.notifySuccess('Withdraw order is successfully listed!')
                await loadOrderList();
            }
            else {
                messageApi.notifyFailed('Withdraw order was failed!')
            }
        } catch (error) {
            console.error(error);
            messageApi.notifyFailed('User canceled order')
        }
        setIsLoading(false);
        closeModal();
    }

    return (
        <>
            {showFeeReteModal && <Modal onClose={onCloseFeeRateModal} onConfirm={onConfirmFeeRate} />}
            {modalState.open && (
                <ReactPortal>
                    <section className="modal__content">
                        <h2>
                            {`Are you sure withdraw rewards with a service fee of ${calculateFee(feeRate).withdraw_fee / 1e8} BTC?`}
                        </h2>

                        <div className="btn-group">
                            <button className="d-btn d-btn-primary active" onClick={handleWithdraw}>
                                {isLoading && <span className="loader-animation"></span>}
                                Yes
                            </button>
                            <button className="d-btn d-btn-outline" onClick={closeModal}>
                                No
                            </button>
                        </div>
                    </section>
                </ReactPortal >
            )}
            <section className="reward-container">
                
                <div className="card-box">
                    {admin &&
                        <>
                            <h2>Admin Reward</h2>
                            <div className="items-center justify-center cell-box">
                                <div className="flex items-center justify-center">
                                    <h3>Reward:</h3>
                                    <div className="whitespace-nowrap pl-5">{(rewardsData.admin_balance / 1e8).toFixed(8) || '0'} BTC</div>
                                </div>
                                {/* <button 
                                    className="rounded-[10px] px-[18px] py-[5px] mt-[20px] text-[16px] bg-[#fea820] text-black font-semibold"
                                    // disabled={!address || rewardsData.admin_balance <= 0}
                                    onClick={onClaimAdminReward}
                                >
                                    Claim
                                </button> */}
                            </div>
                            {creator && <hr />}
                        </>
                    }
                    {creator &&
                        <>
                            <h2 className="mt-[40px]">LP Creator Reward</h2>
                            <div className="cell-box flex items-center justify-center">
                                <div className="text-center">
                                    {rewardsData.lp_holder_details.map((row, index) => {
                                        return (
                                            <div className="flex">
                                                <h4>{poolRender(row)} :</h4>
                                                <div className="pl-5">{(row.balance / 1e8).toFixed(8) || '0'} BTC</div>
                                            </div>
                                        )
                                    })}
                                    {/* <div className="flex items-center mt-5 justify-between">
                                        <h3>Total : </h3>
                                        <div className="pl-5 font-bold">{rewardsData.lp_holder_balance / 1e8 || '0'} BTC</div>
                                    </div>
                                    <button 
                                        className="rounded-[10px] px-[18px] py-[5px] text-[16px] bg-[#fea820] text-black font-semibold active:opacity-60 hover:opacity-80 h-fit mt-[30px]"
                                        disabled={!address || rewardsData.lp_holder_balance <= 0}
                                        onClick={onClaimCreatorReward}
                                    >
                                        Claim All
                                    </button> */}
                                </div>
                            </div>
                        </>
                    }
                    <>
                        {(admin || creator) && 
                            <>
                                <hr />
                                <div className="flex items-center mt-5 justify-center">
                                    <h3>Total : </h3>
                                    <div className="pl-5 font-bold">{((rewardsData.lp_holder_balance + rewardsData.admin_balance) / 1e8).toFixed(8) || '0'} BTC</div>
                                </div>
                                <button 
                                    className="rounded-[10px] px-[18px] py-[5px] text-[16px] bg-[#fea820] text-black font-semibold active:opacity-60 hover:opacity-80 h-fit mt-[30px]"
                                    disabled={!address || (rewardsData.lp_holder_balance + rewardsData.admin_balance) <= 0 || isDisabled}
                                    onClick={onClaimReward}
                                >
                                    Claim All
                                </button>
                            </>
                        }
                    </>
                    {!admin && !creator &&
                        <div className="font-bold text-[20px] mt-[130px] opacity-50">
                            There is no reward.
                        </div>
                    }
                </div>

                <section className="table__container mt-5">
                    <DataTable
                        title="Reward Claim Order List"
                        type={5}
                        dataSource={orderList}
                        columns={columns}
                    />
                </section>
            </section>
        </>
    );
}

export default Reward;
