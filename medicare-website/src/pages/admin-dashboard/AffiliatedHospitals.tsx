import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { apiClientWithAuth } from "../../api/client";
import { HOSPITALS_API_ROUTE, HOSPITAL_API_ROUTE } from "../../api/apiRoutes";
import useAuthStore from "../../store";
import { Button, DataTable } from "../../components";
import type { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { hospitalListMapper } from "./helpers";
import { useState } from "react";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import theme from "../../theme";
import InputAdornment from "@mui/material/InputAdornment";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { EditOrAddHospitalForm } from "./EditOrAddHospitalForm";
import { indianStates } from "../../constants";

export const AffiliatedHospitals = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 7,
  });
  const [mode, setMode] = useState(null);
  const [hospitalData, setHospitalData] = useState(null);
  // 3. Track whether a next page exists

  const [filters, setFilters] = useState({
    search: "",
    state: {
      label: "",
      value: "",
    },
  });
  const [filtersApply, setFiltersApply] = useState({
    search: "",
    state: "",
  });

  const [pageCursorMap, setPageCursorMap] = useState<
    Record<number, string | null>
  >({
    0: null,
  });

  const getAllHospitalList = async () => {
    try {
      const result = await apiClientWithAuth.post(HOSPITALS_API_ROUTE, {
        limit: paginationModel.pageSize,
        nextCursor: pageCursorMap[paginationModel.page] || null,
        ...filtersApply,
      });
      if (result) {
        setPageCursorMap((prev) => ({
          ...prev,
          [paginationModel.page + 1]: result.data.data.nextCursor,
        }));
        return result.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { userInfo } = useAuthStore((state) => state.login);
  const userId = userInfo.user.id;
  const { data, isLoading } = useQuery({
    queryKey: [
      "hospitalList",
      userId,
      pageCursorMap[paginationModel.page],
      paginationModel.page,
      paginationModel.pageSize,
      filtersApply,
    ],
    queryFn: getAllHospitalList,
    placeholderData: keepPreviousData,
  });

  const resetPagination = () => {
    setPaginationModel((prev) => ({
      ...prev,
      page: 0,
    }));
    setPageCursorMap({ 0: null });
  };

  const resetAfterFilterClear = () => {
    setPaginationModel({
      page: 0,
      pageSize: paginationModel.pageSize,
    });
    setPageCursorMap({ 0: null });
  };

  const applyFilters = () => {
    resetPagination();
    setFiltersApply({
      search: filters.search,
      state: filters.state.value,
    });
  };
  const clearFilters = () => {
    resetPagination();
    setFilters({
      search: "",
      state: {
        label: "",
        value: "",
      },
    });
    setFiltersApply({
      search: "",
      state: "",
    });
  };
  const queryClient = useQueryClient();

  const { mutate: deleteHospitalHandler } = useMutation({
    mutationKey: ["deleteAdminDocRecord"],
    mutationFn: async (id) => {
      const response = await apiClientWithAuth.delete(HOSPITAL_API_ROUTE, {
        data: { id: id },
      });
      return response.data;
    },
    onSuccess: () => {
      alert(`Hospital record deleted successfully`);
      queryClient.invalidateQueries({
        queryKey: ["hospitalList"],
        exact: false,
      });
    },
    onError: (error) => {
      alert(`Delete Failed! Please refresh and try again. ${error.message}`);
    },
  });
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 220,
    },
    {
      field: "address",
      headerName: "Hospital address",
      width: 270,
    },
    {
      field: "pin",
      headerName: "Pin",
      width: 70,
    },
    {
      field: "contact_number",
      headerName: "Contact",
      type: "string",
      width: 120,
      cellClassName: "wrap-text",
    },
    {
      field: "created_at",
      headerName: "Created At",
      type: "string",
      width: 130,
      valueFormatter: (value) => {
        if (!value) return "";
        return new Intl.DateTimeFormat("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date(value)); // Outputs: MM/DD/YYYY
      },
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      type: "string",
      width: 130,
      valueFormatter: (value) => {
        if (!value) return "";
        return new Intl.DateTimeFormat("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date(value)); // Outputs: MM/DD/YYYY
      },
    },
    {
      field: "state",
      headerName: "State",
      type: "string",
      width: 160,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "string",
      width: 90,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing(1),
            }}
          >
            <IconButton
              onClick={() => {
                setMode("edit");
                setHospitalData(params.row);
              }}
            >
              <BorderColorOutlinedIcon sx={{ fontSize: "18px" }} />
            </IconButton>
            <IconButton onClick={() => deleteHospitalHandler(params.row.id)}>
              <DeleteOutlineOutlinedIcon
                sx={{ color: theme.palette.error.main, fontSize: "18px" }}
              />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  const rows = data
    ? hospitalListMapper({
        data: data.data.hospitals,
      })
    : [];
  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    if (newModel.pageSize !== paginationModel.pageSize) {
      setPageCursorMap({ 0: null });
      setPaginationModel({ page: 0, pageSize: newModel.pageSize });
    } else {
      setPaginationModel(newModel);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: `${theme.spacing(2)}`,
          alignItems: "center",
          backgroundColor: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
        }}
      >
        <TextField
          label="Search by hospital name"
          variant="outlined"
          color="secondary"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          slotProps={{
            input: {
              endAdornment: filters.search && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      resetAfterFilterClear();
                      setFilters({ ...filters, search: "" });
                      setFiltersApply({
                        ...filtersApply,
                        search: "",
                      });
                    }}
                    edge="end"
                  >
                    <CloseOutlinedIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Autocomplete
          sx={{ width: 200 }}
          color="secondary"
          value={filters.state}
          onChange={(_, value) => {
            if (!value) {
              resetAfterFilterClear();
              setFilters({
                ...filters,
                state: {
                  label: "",
                  value: "",
                },
              });
              setFiltersApply({
                ...filtersApply,
                state: "",
              });
            }
            setFilters({ ...filters, state: value });
          }}
          options={indianStates}
          renderInput={(params) => (
            <TextField
              color="secondary"
              {...params}
              label="Search by state"
              variant="outlined"
            />
          )}
        />
      </Box>
      <Box
        sx={{
          padding: `${theme.spacing(2)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          gap: `${theme.spacing(1)}`,
        }}
      >
        <Button
          color="secondary"
          variant="contained"
          startIcon={<FilterAltIcon />}
          onClick={applyFilters}
        >
          Apply filters
        </Button>
        <Button
          color="secondary"
          variant="contained"
          startIcon={<ClearIcon />}
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
        <Button
          color="secondary"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setMode("add")}
        >
          Add Hospital
        </Button>
      </Box>
      <Box>
        <DataTable
          columns={columns}
          rows={rows}
          maxHeight="calc(100vh - 275px)"
          isLoading={isLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          rowCount={data?.data?.totalCount ?? 0}
          paginationMeta={{
            hasNextPage: data?.data?.hasMore ?? false,
          }}
        />
      </Box>
      {mode && (
        <EditOrAddHospitalForm
          open={!!mode}
          hospitalData={hospitalData}
          mode={mode}
          handleClose={() => {
            setMode(null);
            setHospitalData(null);
          }}
        />
      )}
    </Box>
  );
};
