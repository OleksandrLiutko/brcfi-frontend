export const host = 'https://brcfi-api.proskillowner.com';

export const getVaultAddressApi = `${host}/getVaultAddress`;
export const getTokenListApi = `${host}/getTokenList`;
export const getPoolTokenListApi = `${host}/getPoolTokenList`;
export const getTokenBalanceListApi = `${host}/getTokenBalanceList`;
export const tokenInfoApi = `${host}/tokeninfo/pooltokenlist`;
export const tokenDataListApi = `https://api.coinranking.com/v2/coins?tags[]=brc-20&limit=99`;
export const poolListApi = `${host}/getPoolList`;
export const getPoolByTokenPairApi = `${host}/getPoolByTokenPair`;
export const getPoolBalanceListApi = `${host}/getPoolBalanceList`;
export const createPoolFeeApi = `${host}/createPool/getFee`;
export const createPoolApi = `${host}/createPool`;
export const addLiquidityFeeApi = `${host}/addLiquidity/getFee`;
export const addLiquidityAmountApi = `${host}/addLiquidity/getAmount`;
export const addLiquidityApi = `${host}/addliquidity`;
export const removeLiquidityFeeApi = `${host}/removeLiquidity/getFee`;
export const removeLiquidityAmountApi = `${host}/removeLiquidity/getAmount`;
export const removeLiquidityApi = `${host}/removeLiquidity`;
export const swapFeeApi = `${host}/swap/getFee`;
export const swapAmountApi = `${host}/swap/getAmount`;
export const swapApi = `${host}/swap`;
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

export const mempoolTxUrl = `https://mempool.space/testnet/tx`
export const mempoolApiUrl = 'https://mempool.space/testnet/api/v1';
export const getTXInfoUrl = `${mempoolApiUrl}/tx/`
export const feeRateUrl = `${mempoolApiUrl}/fees/recommended`

export const dayilyURL = 'https://api.coingecko.com/api/v3/coins/ordinals/market_chart?vs_currency=usd&days=1'
export const weeklyURL = 'https://api.coingecko.com/api/v3/coins/ordinals/market_chart?vs_currency=usd&days=7'
export const monthlyURL = 'https://api.coingecko.com/api/v3/coins/ordinals/market_chart?vs_currency=usd&days=31'
export const yearlyURL = 'https://api.coingecko.com/api/v3/coins/ordinals/market_chart?vs_currency=usd&days=365'
