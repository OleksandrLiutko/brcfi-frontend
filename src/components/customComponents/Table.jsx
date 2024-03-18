import Filters from "../Filters";
import DataTable from "../DataTable";


export function DataTaable() {
  return (
    <section className="table__container">
      <header className="flex items-center">
        <h3>Add liquidity Orderbook </h3>

        <Filters />
      </header>

      <DataTable
        type={2}
        dataSource={orderList}
        columns={columns}
      />
    </section>
  )
}