import "./styles.css";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import type { RowData } from "../../models/Notion";
import { mapNotionColor } from "../../utils/notion/helper";

const columnHelper = createColumnHelper<RowData>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => <strong>{info.getValue()}</strong>,
  }),
  columnHelper.accessor("contentSummary", {
    header: "Content Summary",
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const color = info.row.original.statusColor;
      return (
        <span
          className="notion-tag"
          style={{
            backgroundColor: mapNotionColor(color),
            color: "#1e1e1e",
          }}
        >
          {info.getValue()}
        </span>
      );
    },
  }),
  columnHelper.accessor("priority", {
    header: "Priority",
    cell: (info) => {
      const color = info.row.original.priorityColor;
      return (
        <span
          className="notion-tag"
          style={{
            backgroundColor: mapNotionColor(color),
            color: "#1e1e1e",
          }}
        >
          {info.getValue()}
        </span>
      );
    },
  }),
  columnHelper.accessor("estimatedValue", {
    header: "Estimated Value",
  }),
];

type IndexProps = {
  data: RowData[];
};

function Index({ data }: IndexProps) {
  const table = useReactTable<RowData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });

  return (
    <table className="notion-table">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                style={{
                  width: header.getSize(),
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                <div
                  {...{
                    onMouseDown: header.getResizeHandler(),
                    onTouchStart: header.getResizeHandler(),
                    style: {
                      position: "absolute",
                      right: 0,
                      top: 0,
                      height: "100%",
                      width: "4px",
                      cursor: "col-resize",
                    },
                  }}
                />
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

Index.propTypes = {};

export default Index;
