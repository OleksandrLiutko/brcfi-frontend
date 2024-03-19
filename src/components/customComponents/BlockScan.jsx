import { mempoolTxUrl } from "../../utils/apiRoutes";


export default function BlockScan({ transaction }) {
  return (
    <a
      href={`${mempoolTxUrl}/${transaction}`}
      target='_blank'
      style={{ color: '#6900FF' }}
    >
      {transaction.slice(0, 4) + '...' + transaction.slice(-4)}
    </a>)
}