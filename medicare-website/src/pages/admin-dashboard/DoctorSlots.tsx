import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClientWithAuth } from "../../api/client";
import { ADMIN_GET_DOCTORS_LIST } from "../../api/apiRoutes";
import useAuthStore from "../../store";
import { Button, DataTable } from "../../components";
import type { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { doctorListMapper } from "./helpers";
import { useState } from "react";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import theme from "../../theme";
import { getHospitalOptions, specialtiesList } from "../../constants";
import InputAdornment from "@mui/material/InputAdornment";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { useAllHospitalData } from "../../hooks/useAllHospitalData";
import { useNavigate } from "react-router";

export const DoctorSLots = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });
  const navigate = useNavigate();
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
    name: "",
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
  const { data: hospitalList } = useAllHospitalData();
  const hospitalOptions = getHospitalOptions({
    hospitals: hospitalList?.data?.hospitals,
  });
  const getAllDoctorsList = async () => {
    try {
      const result = await apiClientWithAuth.post(ADMIN_GET_DOCTORS_LIST, {
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
      "doctorsList",
      userId,
      paginationModel.page,
      paginationModel.pageSize,
      filtersApply.email,
      filtersApply.license_number,
      filtersApply.name,
      filtersApply.status,
      filtersApply.specialization,
    ],
    staleTime: 1000 * 60 * 0.5,
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
      name: filters.name,
      email: filters.email,
      license_number: filters.license_number,
      specialization: filters.specialization
        ? filters.specialization.value
        : "",
      status: filters.status ? filters.status.value : "",
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
      name: "",
      email: "",
      license_number: "",
      specialization: "",
      status: "",
    });
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 220,
    },
    {
      field: "hospitalName",
      headerName: "Hospital",
      width: 350,
    },
    {
      field: "specialization",
      headerName: "Specialization",
      type: "string",
      width: 250,
      renderCell: (params) => {
        const specialization =
          params.row.specialization.charAt(0).toUpperCase() +
          params.row.specialization.slice(1).toLowerCase();
        const specializationUpplerLowercase = specialization?.replaceAll(
          "_",
          " ",
        );
        return <div>{specializationUpplerLowercase}</div>;
      },
    },
    {
      field: "license_number",
      headerName: "License",
      type: "string",
      width: 120,
    },
    {
      field: "status",
      headerName: "Status",
      type: "string",
      width: 120,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "string",
      width: 120,
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
                navigate(`/dashboard/doctor-slots/${params.row.id}`);
              }}
            >
              <EditCalendarIcon sx={{ fontSize: "18px" }} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  const rows = data
    ? doctorListMapper({
        data: data.data.doctors,
        hospitalOptions: hospitalOptions,
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
                        name: "",
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
