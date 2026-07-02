import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClientWithAuth } from "../../api/client";
import { GET_ADMIN_ALL_DOCTORS_LIST } from "../../api/query";
import useAuthStore from "../../store";
import { Button, DataTable } from "../../components";
import type { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { doctorListMapper } from "./helpers";
import { useState } from "react";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import theme from "../../theme";
import { specialtiesList } from "../../constants";
import InputAdornment from "@mui/material/InputAdornment";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export const DoctorsList = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 7,
  });

  // 3. Track whether a next page exists

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    license_number: "",
    specialization: {
      label: "",
      value: "",
    },
    status: {
      label: "",
      value: "",
    },
  });
  const [filtersApply, setFiltersApply] = useState({
    firstName: "",
    lastName: "",
    email: "",
    license_number: "",
    specialization: "",
    status: "",
  });
  const [pageCursorMap, setPageCursorMap] = useState<
    Record<number, string | null>
  >({
    0: null,
  });

  const getAllDoctorsList = async () => {
    try {
      const result = await apiClientWithAuth.post(GET_ADMIN_ALL_DOCTORS_LIST, {
        limit: paginationModel.pageSize,
        nextCursor: pageCursorMap[paginationModel.page] || null,
        filters: { ...filtersApply },
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
      "userProfile",
      userId,
      pageCursorMap[paginationModel.page],
      paginationModel.page,
      paginationModel.pageSize,
      filtersApply,
    ],
    queryFn: getAllDoctorsList,
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
      firstName: filters.name.split(" ")[0] || "",
      lastName: filters.name.split(" ")[1] || "",
      email: filters.email,
      license_number: filters.license_number,
      specialization: filters.specialization.value,
      status: filters.status.value,
    });
  };
  const clearFilters = () => {
    resetPagination();
    setFilters({
      name: "",
      email: "",
      license_number: "",
      specialization: {
        label: "",
        value: "",
      },
      status: {
        label: "",
        value: "",
      },
    });
    setFiltersApply({
      firstName: "",
      lastName: "",
      email: "",
      license_number: "",
      specialization: "",
      status: "",
    });
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 130 },
    {
      field: "email",
      headerName: "Email",
      type: "string",
      width: 200,
      cellClassName: "wrap-text",
    },
    {
      field: "phone",
      headerName: "Phone",
      type: "string",
      width: 125,
    },
    {
      field: "specialization",
      headerName: "Specialization",
      type: "string",
      width: 120,
    },
    {
      field: "license_number",
      headerName: "License",
      type: "string",
      width: 120,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      type: "string",
      width: 120,
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
      field: "updatedAt",
      headerName: "Updated At",
      type: "string",
      width: 120,
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
      field: "status",
      headerName: "Status",
      type: "string",
      width: 90,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "string",
      width: 90,
      renderCell: () => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing(1),
            }}
          >
            <IconButton>
              <BorderColorOutlinedIcon sx={{ fontSize: "18px" }} />
            </IconButton>
            <IconButton>
              <DeleteOutlineOutlinedIcon
                sx={{ color: theme.palette.error.main, fontSize: "18px" }}
              />
            </IconButton>
          </Box>
        );
      },
    },
  ];
  const rows = data ? doctorListMapper(data.data.doctors) : [];
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
          label="Search by name"
          variant="outlined"
          color="secondary"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          slotProps={{
            input: {
              endAdornment: filters.name && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      resetAfterFilterClear();
                      setFilters({ ...filters, name: "" });
                      setFiltersApply({
                        ...filtersApply,
                        firstName: "",
                        lastName: "",
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
        <TextField
          label="Search by email"
          variant="outlined"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          color="secondary"
          slotProps={{
            input: {
              endAdornment: filters.email && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      resetAfterFilterClear();
                      setFilters({ ...filters, email: "" });
                      setFiltersApply({
                        ...filtersApply,
                        email: "",
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
        <TextField
          label="Search by license number"
          variant="outlined"
          color="secondary"
          value={filters.license_number}
          onChange={(e) =>
            setFilters({ ...filters, license_number: e.target.value })
          }
          slotProps={{
            input: {
              endAdornment: filters.license_number && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      resetAfterFilterClear();
                      setFilters({ ...filters, license_number: "" });
                      setFiltersApply({
                        ...filtersApply,
                        license_number: "",
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
          options={specialtiesList}
          value={filters.specialization}
          onChange={(_, value) => {
            if (!value) {
              resetAfterFilterClear();
              setFilters({
                ...filters,
                specialization: {
                  label: "",
                  value: "",
                },
              });
              setFiltersApply({
                ...filtersApply,
                specialization: "",
              });
            }
            setFilters({ ...filters, specialization: value });
          }}
          renderInput={(params) => (
            <TextField
              color="secondary"
              {...params}
              label="Specialization"
              variant="outlined"
            />
          )}
        />
        <Autocomplete
          sx={{ width: 200 }}
          color="secondary"
          value={filters.status}
          onChange={(_, value) => {
            if (!value) {
              resetAfterFilterClear();
              setFilters({
                ...filters,
                status: {
                  label: "",
                  value: "",
                },
              });
              setFiltersApply({
                ...filtersApply,
                status: "",
              });
            }
            setFilters({ ...filters, status: value });
          }}
          options={[
            { label: "Active", value: "ACTIVE" },
            { label: "Inactive", value: "INACTIVE" },
            { label: "On Leave", value: "ON_LEAVE" },
          ]}
          renderInput={(params) => (
            <TextField
              color="secondary"
              {...params}
              label="Status"
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
        <Button color="secondary" variant="contained" startIcon={<AddIcon />}>
          Add Doctor
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
    </Box>
  );
};
