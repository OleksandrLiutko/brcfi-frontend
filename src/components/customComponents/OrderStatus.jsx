import { formatOrderStatus } from "../../utils/constants";

export default function OrderStatus({ status }) {
  return (
    <span
      className="table-status table-status-outline"
    >
      {formatOrderStatus(status)}
    </span>)
}