import {
  DataGrid,
  type GridColDef,
  type GridPaginationMeta,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

export const DataTable = ({
  columns,
  rows,
  paginationModel,
  isLoading,
  height,
  onPaginationModelChange,
  paginationMeta,
  maxHeight,
  rowCount,
  rowHeight,
  ...props
}: {
  columns: GridColDef[];
  rows: never[];
  paginationModel: { page: number; pageSize: number };
  isLoading: boolean;
  height?: number | string;
  onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
  paginationMeta: GridPaginationMeta;
  maxHeight: string;
  rowCount?: number;
  rowHeight?: number;
}) => {
  return (
    <Paper sx={{ height, width: "100%" }}>
      <DataGrid
        rows={rows}
        rowHeight={rowHeight}
        columns={columns}
        paginationModel={paginationModel}
        pageSizeOptions={[10, 15, 20]}
        checkboxSelection={false}
        disableRowSelectionOnClick
        loading={isLoading}
        paginationMode="server"
        onPaginationModelChange={onPaginationModelChange}
        paginationMeta={paginationMeta}
        rowCount={rowCount}
        filterMode="server"
        sx={{
          maxHeight: maxHeight || "500px",
          border: 0,
        }}
        {...props}
      />
    </Paper>
  );
};
