import React, { useState, useEffect } from "react";
import { useToast } from "./useToast";

export function useUnisat() {
  const { messageApi } = useToast();
  const [connected, setConnected] = useState(false);
  const [network, setNetwork] = useState('');

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!connected) return;
      // loadOrderList();
      await checkConnect();
    }, 3000);

    return () => {
      clearInterval(interval);
    }
  }, [connected])

  const checkConnect = async () => {
    return new Promise(async (res, rej) => {

      currentNetwork = '';
      setTimeout(async () => {
        if (currentNetwork === '') {
          messageApi.notifyWarning(
            'Unisat wallet is disconnected! Please reload the page.',
            5
          )
          setConnected(false)
          res(false);
        }
      }, 1000);
      if (!connected)
        currentNetwork = await window.unisat.getNetwork();
      else
        currentNetwork = await unisat.requestAccounts();
      // console.log('Wallet is connected!');
      res(true)
    })
  }

  const connectWallet = async () => {
    if (!unisat) {
      messageApi.notifyWarning('Please install Unisat wallet!', 3)
      return;
    }
    const connect = await checkConnect();
    if (!connect) return;
    try {
      const result = await unisat.requestAccounts();
      await unisat.switchNetwork('livenet')
      handleAccountsChanged(result);
      setConnected(true);
      messageApi.notifySuccess('Wallet is connected!', 3)
    } catch (error) {

    }
  }


}