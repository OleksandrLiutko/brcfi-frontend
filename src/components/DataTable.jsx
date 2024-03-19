import React, { useEffect, useState } from "react";
import NoDataIcon from "../assets/icons/NoDataIcon";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Pagination from "./Pagination";
import { formatTime } from "../utils/constants";
import { useResponsiveView } from "../utils/customHooks";
import TimeIcon from "../assets/icons/TimeIcon";
import { CreatePoolTable } from "./customComponents/MobileTable/CreatePoolTable";
import { AddLiquidityTable } from "./customComponents/MobileTable/AddLiquidityTable";
import { RemoveLiquidityTable } from "./customComponents/MobileTable/RemoveLiquidityTable";
import { SwapTable } from "./customComponents/MobileTable/SwapTable";

// import { faker } from "@faker-js/faker";

// export function createRandomUser() {
//     return {
//         no: faker.datatype.number,
//         username: faker.internet.userName(),
//         email: faker.internet.email(),
//         avatar: faker.image.avatar(),
//         password: faker.internet.password(),
//         birthdate: faker.date.birthdate(),
//         registeredAt: faker.date.past(),
//     };
// }

// export const USERS = faker.helpers.multiple(createRandomUser, {
//     count: 5,
// });
const defaultData = [
  {
    no: 1,
    orderedTime: "07:56 5/6/2023",
    pool: "SAT1/SAT2",
    feeTX_ID: "9d4345...",
    feeRate: 1,
    token1Amount: 1000000000,
    token2Amount: 1000000000,
    token1Send: "Send",
    token2Receive: "Success",
    status: "Received",
  },
  {
    no: 2,
    orderedTime: "07:56 5/6/2023",
    pool: "SAT1/SAT2",
    feeTX_ID: "9d4345...",
    feeRate: 2,
    token1Amount: 1000000000,
    token2Amount: 1000000000,
    token1Send: "Send",
    token2Receive: "Success",
    status: "Received",
  },
  {
    no: 3,
    orderedTime: "07:56 5/6/2023",
    pool: "SAT1/SAT2",
    feeTX_ID: "9d4345...",
    feeRate: 3,
    token1Amount: 1000000000,
    token2Amount: 1000000000,
    token1Send: "Send",
    token2Receive: "Success",
    status: "Received",
  },
];


function DataTable({ title = "", type, dataSource, columns }) {

  const [data, setData] = useState([]);
  const isMobileView_800 = useResponsiveView(800);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
  });

  useEffect(() => {
    const datas = dataSource
      .sort((a, b) => b.start_time - a.start_time)
      .filter((row) => row.order_type === type)
      .map((row, index) => {
        return {
          ...row, no: index + 1
        }
      })
    setData(datas)
  }, [dataSource])


  useEffect(() => {
    table.setPageSize(5)
  }, [])

  return isMobileView_800 ? (<>
    {(type == 1) && <CreatePoolTable dataSource={data} />}
    {(type == 2) && <AddLiquidityTable dataSource={data} />}
    {(type == 3) && <RemoveLiquidityTable dataSource={data} />}
    {(type == 4) && <SwapTable dataSource={data} />}
    {/* {(type == 7) && <SwapTable dataSource={data} />} */}
  </>
  ) : (
    <div className="table__content overflow-x-auto">
      <h3>{title}</h3>
      {data.length > 0 ? (
        <>
          <table className="table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => {
                return (
                  <tr key={index}>
                    {row.getVisibleCells().map((cell) => {
                      let entry = flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      );
                      let element = flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      );

                      switch (cell.column.id) {
                        case "button":
                          element = (
                            <button
                              className={`table-btn table-btn-${cell.row.original.no === 1
                                ? "primary"
                                : cell.row.original.no === 2
                                  ? "black"
                                  : "green"
                                }`}
                            >
                              {entry}
                            </button>
                          );
                          break;

                        case "status":
                          element = (
                            <span className="table-status table-status-outline">
                              {entry}
                            </span>
                          );

                          break;

                        case "status-filled":
                          element = (
                            <span className="table-status table-status-filled">
                              {entry}
                            </span>
                          );

                          break;

                        default:
                          break;
                      }
                      return <td key={cell.id} style={{ width: cell.column.columnDef.width ? cell.column.columnDef.width : '' }}>{element}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>

          <Pagination
            justPageNumbers={true}
            table={table}
          />
        </>
      ) : (
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <tr>
              <td colSpan="12">
                <span className="nodata__container">
                  <NoDataIcon />
                  No Data
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DataTable;
