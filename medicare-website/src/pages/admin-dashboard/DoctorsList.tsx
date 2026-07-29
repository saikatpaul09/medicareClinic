import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { apiClientWithAuth } from "../../api/client";
import { ADMIN_GET_DOCTORS_LIST, DOCTOR_API_ROUTE } from "../../api/apiRoutes";
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
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { EditOrAddDoctorForm } from "./EditAndAddDoctorForm";
import { useAllHospitalData } from "../../hooks/useAllHospitalData";

export const DoctorsList = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });
  const [mode, setMode] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
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
      filtersApply.specialization,
      filtersApply.status,
      filtersApply.name,
    ],
    staleTime: 60 * 1000 * 0.5,
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
  const queryClient = useQueryClient();
  const { mutate: deleteDoctorHandler } = useMutation({
    mutationKey: ["deleteAdminDocRecord"],
    mutationFn: async (id) => {
      const response = await apiClientWithAuth.delete(DOCTOR_API_ROUTE, {
        data: { userId: id },
      });
      return response.data;
    },
    onSuccess: () => {
      alert(`Doctor record deleted successfully`);
      queryClient.invalidateQueries({
        queryKey: ["doctorsList"],
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
      width: 150,
    },
    {
      field: "hospitalName",
      headerName: "Hospital",
      width: 180,
    },
    {
      field: "email",
      headerName: "Email",
      type: "string",
      width: 180,
      cellClassName: "wrap-text",
    },
    {
      field: "phone",
      headerName: "Phone",
      type: "string",
      width: 99,
    },
    {
      field: "specialization",
      headerName: "Specialization",
      type: "string",
      width: 110,
    },
    {
      field: "license_number",
      headerName: "License",
      type: "string",
      width: 80,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      type: "string",
      width: 100,
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
      width: 100,
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
                setDoctorData(params.row);
              }}
            >
              <BorderColorOutlinedIcon sx={{ fontSize: "18px" }} />
            </IconButton>
            <IconButton onClick={() => deleteDoctorHandler(params.row.id)}>
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
        <Button
          color="secondary"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setMode("add")}
        >
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
      {mode && (
        <EditOrAddDoctorForm
          profile="DOCTOR"
          open={!!mode}
          doctorData={doctorData}
          hospitalOptions={hospitalOptions}
          mode={mode}
          handleClose={() => {
            setMode(null);
            setDoctorData(null);
          }}
        />
      )}
    </Box>
  );
};
