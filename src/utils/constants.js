export const orderStatusArray = ['Listed', 'Processing', 'Finalizing', 'Failed', 'Confirmed']

export const factoryWalletAddress = 'tb1purkq56fu4x9sqpkf9xwgvpwllc0d7qndsvfc6769p0ru9qt347ks008u4y'
export const API_KEY = 'b8ddc98e36141f90507de565a76b5bf7a4de2c69123d11afa2e8faf1380e2cf7'


export const ORDER_TYPE_CREATE_POOL = 1
export const ORDER_TYPE_ADD_LIQUIDITY = 2
export const ORDER_TYPE_REMOVE_LIQUIDITY = 3
export const ORDER_TYPE_SWAP = 4

export const ORDER_STATUS_LISTED = 1
export const ORDER_STATUS_PROCESSING = 2
export const ORDER_STATUS_FINALIZING = 3
export const ORDER_STATUS_FAILED = 4
export const ORDER_STATUS_CONFIRMED = 5
export const formatOrderStatus = (status, type = 1) => {
  switch (status) {
    case 1:
      return 'Order listed'
    case 2:
      return 'Order accepted'
    case 98:
      return 'Failed'
    case 99:
      return 'Confirmed'
    default:
      return 'Pending'
  }
}

export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes();
  if (hours < 10)
    return `0${hours}:${minutes} ${year}/${month}/${day}`
  else
    return `${hours}:${minutes} ${year}/${month}/${day}`
  // return `${year}.${month}.${day} ${hours}:${minutes}`
}

export const isStringEqual = (string1, string2) => {
  if (!string1 || !string2) return false;
  return string1.tick.toUpperCase() === string2.tick.toUpperCase();
}

export const defaultToken = {
  "_id": "64671b984ae76e5e942a07d4",
  "p": "brc-20",
  "op": "deploy",
  "tick": ".....",
  "max": "210000000",
  "lim": "100",
  "deploy_address": "tb1p5z9j8xtxsy2k2umvl5frc2x4dgclhrfryexmw39wft3ezqr006lsa5h2xa",
  "txid": "dfebfc3fb8ff280321a88470ebefa50aed5c17a20a783e2f5734b9df4b3251d1",
  "inscription_number": 1946,
  "valid": true,
  "description": "success",
  "error": 0
}

export const sleep = (timeout) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(true);
    }, timeout * 1000);
  })
}