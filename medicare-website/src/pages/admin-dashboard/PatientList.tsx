import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClientWithAuth } from "../../api/client";
import { GET_ALL_ADMIN_PATIENTS } from "../../api/query";
import useAuthStore from "../../store";
import { Button, DataTable } from "../../components";
import type { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { patientListMapper } from "./helpers";
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
import { EditOrAddDoctorForm } from "./EditAndAddDoctorForm";
import { DELETE_ADMIN_PATIENT_PROFILE } from "../../api/mutations";

export const PatientList = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 7,
  });
  const [mode, setMode] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  // 3. Track whether a next page exists

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phone_number: "",
    gender: {
      label: "",
      value: "",
    },
  });
  const [filtersApply, setFiltersApply] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone_number: "",
    gender: "",
  });
  const [pageCursorMap, setPageCursorMap] = useState<
    Record<number, string | null>
  >({
    0: null,
  });

  const getAllDoctorsList = async () => {
    try {
      const result = await apiClientWithAuth.post(GET_ALL_ADMIN_PATIENTS, {
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
      "patientList",
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
      phone_number: filters.phone_number,
      gender: filters.gender.value,
    });
  };
  const clearFilters = () => {
    resetPagination();
    setFilters({
      name: "",
      email: "",
      phone_number: "",
      gender: {
        label: "",
        value: "",
      },
    });
    setFiltersApply({
      firstName: "",
      lastName: "",
      email: "",
      phone_number: "",
      gender: "",
    });
  };
  const queryClient = useQueryClient();
  const { mutate: deletePatientHandler } = useMutation({
    mutationKey: ["deleteAdminPatientRecord"],
    mutationFn: async (id) => {
      const response = await apiClientWithAuth.delete(
        DELETE_ADMIN_PATIENT_PROFILE,
        { data: { userId: id } },
      );
      return response.data;
    },
    onSuccess: () => {
      alert(`Patient record deleted successfully`);
      queryClient.invalidateQueries({
        queryKey: ["patientList"],
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
      field: "email",
      headerName: "Email",
      type: "string",
      width: 220,
      cellClassName: "wrap-text",
    },
    {
      field: "phone",
      headerName: "Phone",
      type: "string",
      width: 150,
    },
    {
      field: "gender",
      headerName: "Gender",
      type: "string",
      width: 80,
    },
    {
      field: "age",
      headerName: "Age",
      type: "string",
      width: 80,
    },
    {
      field: "createdAt",
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
      field: "updatedAt",
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
      field: "actions",
      headerName: "Actions",
      type: "string",
      width: 150,
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
            <IconButton onClick={() => deletePatientHandler(params.row.id)}>
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
    ? patientListMapper({
        data: data.data.patients,
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
          label="Search by Phone No"
          variant="outlined"
          color="secondary"
          value={filters.phone_number}
          onChange={(e) =>
            setFilters({ ...filters, phone_number: e.target.value })
          }
          slotProps={{
            input: {
              endAdornment: filters.phone_number && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      resetAfterFilterClear();
                      setFilters({ ...filters, phone_number: "" });
                      setFiltersApply({
                        ...filtersApply,
                        phone_number: "",
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
          value={filters.gender}
          onChange={(_, value) => {
            if (!value) {
              resetAfterFilterClear();
              setFilters({
                ...filters,
                gender: {
                  label: "",
                  value: "",
                },
              });
              setFiltersApply({
                ...filtersApply,
                gender: "",
              });
            }
            setFilters({ ...filters, gender: value });
          }}
          options={[
            { label: "Male", value: "MALE" },
            { label: "Female", value: "FEMALE" },
            { label: "Others", value: "OTHERS" },
          ]}
          renderInput={(params) => (
            <TextField
              color="secondary"
              {...params}
              label="Gender"
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
          Add Patient
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
          open={!!mode}
          profile="PATIENT"
          doctorData={doctorData}
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
