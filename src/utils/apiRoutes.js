export const host = 'https://bitcswap-api.proskillowner.com';

export const getVaultAddressApi = `${host}/getVaultAddress`;
export const getWeightApi = `${host}/getfee`;
export const tokenListApi = `${host}/getTokenList`;
export const poolTokenListApi = `${host}/getPoolTokenList`;
export const tokenInfoApi = `${host}/tokeninfo/pooltokenlist`;
export const tokenDataListApi = `https://api.coinranking.com/v2/coins?tags[]=brc-20&limit=99`;
export const poolListApi = `${host}/getpool`;
export const createPoolApi = `${host}/createpool`;
export const addLiquidityApi = `${host}/addliquidity`;
export const addLiquidityAmountApi = `${host}/addliquidity/tokenamount`;
export const removeLiquidityApi = `${host}/removeliquidity`;
export const removeLiquidityAmountApi = `${host}/removeliquidity/tokenamount`;
export const swapApi = `${host}/swap`;
export const swapAmountApi = `${host}/swap/tokenamount`;
export const getMyOrderListApi = `${host}/getMyOrderList`;
export const getBalanceApi = `${host}/gettokenbalance`;
export const deployTokenApi = `${host}/deploy`;
export const getWhitelistApi = `${host}/getwhitelisttoken`;
export const updateOrderApi = `${host}/updateorder`;
export const getAdminApi = `${host}/getadmin`;
export const getRewardsApi = (add) => {
    return `${host}/getbtcbalance/platform/${add}/list`
}
export const withdrawApi = `${host}/withdrawbtc`

export const BTCTestExplorerUrl = 'https://mempool.space/tx/'
export const getTXInfoUrl = 'https://mempool.space/api/tx/'
export const feeRateUrl = 'https://mempool.space/api/v1/fees/recommended'

export const dayilyURL = 'https://api.coingecko.com/api/v3/coins/ordinals/market_chart?vs_currency=usd&days=1'
export const weeklyURL = 'https://api.coingecko.com/api/v3/coins/ordinals/market_chart?vs_currency=usd&days=7'
export const monthlyURL = 'https://api.coingecko.com/api/v3/coins/ordinals/market_chart?vs_currency=usd&days=31'
export const yearlyURL = 'https://api.coingecko.com/api/v3/coins/ordinals/market_chart?vs_currency=usd&days=365'