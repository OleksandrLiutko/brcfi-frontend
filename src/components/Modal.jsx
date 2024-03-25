import React, { useEffect, useState } from 'react';
import "../styles/components/modal.scss";
import { feeRateUrl } from '../utils/apiRoutes';
import axios from 'axios';

export default function Modal({ onClose, onConfirm }) {
    const [showCustom, setShowCustom] = useState(false);
    const [feeRate, setFeeRate] = useState(1);
    const [loading, setLoading] = useState(false);
    const [rateValues, setRateValues] = useState([1, 1, 1]);
    const [selectedOption, setSelectedOption] = useState(0)
    console.log('rateValues :>> ', rateValues);
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await axios({
                    method: 'get',
                    url: feeRateUrl
                });
                setRateValues([res.data?.hourFee, res.data?.halfHourFee, res.data?.fastestFee]);
                setFeeRate(res.data?.halfHourFee)
            } catch(err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        })();
    }, [])

    const onChange = (e) => {
        let value = Number(e.target.value);

        if (isNaN(value)) {
            setFeeRate(defaultSats[1]);
            return;
        }

        if (value < rateValues[0]) value = rateValues[0];
        if (value > 500) value = 500;

        setFeeRate(value);
    }

    const onConfirmClick = () => {
        onConfirm(feeRate);
    }

    return (
        <div className='modal-container z-30 absolute top-0 w-full left-0 h-full backdrop-blur-sm'>
            <div className='top-0 left-0 absolute w-full h-full' onClick={onClose}></div>
            <div className="modal-wrapper m-auto absolute w-full max-w-[500px] h-[470px] top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white rounded-[20px] shadow-lg shadow-[#00000050]">
                <div className="px-[2rem]">
                    <h3 className="!text-[26px] font-normal mt-[24px] mb-[10px]">
                        FeeRate Setting
                    </h3>
                    <p className="text-[14px] font-normal leading-[20px] mb-[25px]">
                        You can customize fee rate on your needs.
                    </p>
                </div>
                {!loading ?
                    <div className="button-group flex gap-8 mb-[20px] px-[30px] justify-center">
                        <div className="border border-[#00000050] border-color rounded-[10px] w-full py-[10px]">
                            <div className="mb-[4px] text-center text-[24px]">{rateValues[0]}</div>
                            <div className="mb-[4px] text-center text-[14px]">Sats/VB</div>
                            <div className="mb-[4px] text-center text-[16px] font-semibold">SLOW</div>
                        </div>
                        <div className="border border-[#00000050] border-color rounded-[10px] w-full py-[10px]">
                            <div className="mb-[4px] text-center text-[24px]">{rateValues[1]}</div>
                            <div className="mb-[4px] text-center text-[14px]">Sats/VB</div>
                            <div className="mb-[4px] text-center text-[16px] font-semibold">NORMAL</div>
                        </div>
                        <div className="border border-[#00000050] border-color rounded-[10px] w-full py-[10px]">
                            <div className="mb-[4px] text-center text-[24px]">{rateValues[2]}</div>
                            <div className="mb-[4px] text-center text-[14px]">Sats/VB</div>
                            <div className="mb-[4px] text-center text-[16px] font-semibold">FAST</div>
                        </div>
                    </div> :
                    <div className="button-group flex gap-8 mb-[20px] px-[30px] justify-center text-[16px] py-[45px]">
                        Loading fee rates ...
                    </div>
                }
                <div className="flex gap-8 px-[30px] items-center text-[14px] justify-center">
                    {!showCustom &&
                        <div className="px-[15px] py-[10px] text-center cursor-pointer text-[20px] font-semibold whitespace-nowrap border border-[#00000050] border-color rounded-[10px]" onClick={() => setShowCustom(true)}>Custom</div>
                    }
                    {showCustom &&
                        <input type="number" value={feeRate} onChange={(e) => setFeeRate(e.target.value)} onBlur={onChange} name="feerate" className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md focus:ring-1 w-[100px] h-[40px]" placeholder="Enter custom fee rate" />
                    }
                    {showCustom &&
                        <div>Sats/VB</div>
                    }
                </div>
                <div className="my-[30px] text-[#00000070] text-center text-[16px] text-dark">Estimated fee: {feeRate} Sats/VB</div>
                <button className="rounded-[10px] px-[18px] py-[10px] text-[16px] bg-[#fea820] text-black font-semibold active:opacity-60 hover:opacity-80" onClick={onConfirmClick}>
                    Confirm
                </button>
            </div>
        </div>
    )
}
