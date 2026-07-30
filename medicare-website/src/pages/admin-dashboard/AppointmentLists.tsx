import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClientWithAuth } from "../../api/client";
import { ADMIN_GET_APPOINTMENTS } from "../../api/apiRoutes";
import useAuthStore from "../../store";
import { Button, DataTable } from "../../components";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import type { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { appointmentListWrapper } from "./helpers";
import { useState } from "react";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import theme from "../../theme";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";
import { Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import dayjs from "dayjs";

export const AppointmentList = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });

  const [filters, setFilters] = useState({
    status: {
      label: "",
      value: "",
    },
    appointmentStart: null as Dayjs | null,
    appointmentEnd: null as Dayjs | null,
  });
  const [filtersApply, setFiltersApply] = useState({
    status: "",
    appointmentStart: null as string | null,
    appointmentEnd: null as string | null,
  });
  const [pageCursorMap, setPageCursorMap] = useState<
    Record<number, string | null>
  >({
    0: null,
  });
  const getAllAppointmentList = async () => {
    try {
      const result = await apiClientWithAuth.post(ADMIN_GET_APPOINTMENTS, {
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
      "AppointmentLists",
      userId,
      paginationModel.page,
      paginationModel.pageSize,
      filtersApply.status,
      filtersApply.appointmentEnd,
      filtersApply.appointmentStart,
    ],
    staleTime: 60 * 1000 * 0.5,
    queryFn: getAllAppointmentList,
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
      status: filters.status ? filters.status.value : "",
      appointmentStart: filters.appointmentStart
        ? filters.appointmentStart.startOf("day").toISOString()
        : null,
      appointmentEnd: filters.appointmentEnd
        ? filters.appointmentEnd.endOf("day").toISOString()
        : null,
    });
  };
  const clearFilters = () => {
    resetPagination();
    setFilters({
      status: {
        label: "",
        value: "",
      },
      appointmentStart: null,
      appointmentEnd: null,
    });
    setFiltersApply({
      status: "",
      appointmentStart: null,
      appointmentEnd: null,
    });
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Patient name",
      width: 140,
      sortable: false,
    },
    {
      field: "doctor",
      headerName: "Doctor name",
      width: 160,
      sortable: false,
    },
    {
      field: "department",
      headerName: "Department",
      width: 130,
      sortable: false,
    },
    {
      field: "hospital_name",
      headerName: "Hospital",
      type: "string",
      width: 210,
      cellClassName: "wrap-text",
      sortable: false,
    },

    {
      field: "appointment_datetime",
      headerName: "Appointment",
      width: 160,
      sortable: true,
      renderCell: (params) => {
        const date = dayjs(params.value);
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              gap: 1,
              height: "100%",
            }}
          >
            <CalendarTodayIcon color="primary" sx={{ fontSize: 18 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {date.format("DD MMM YYYY")}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <AccessTimeIcon
                  sx={{
                    fontSize: 14,
                    color: "text.secondary",
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {date.format("hh:mm A")}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      },
    },

    {
      field: "status",
      headerName: "Appoint. Status",
      type: "string",
      width: 120,
      sortable: false,
    },
    {
      field: "payment_status",
      headerName: "Payment status",
      type: "string",
      width: 120,
      sortable: false,
    },
    {
      field: "payment_method",
      headerName: "Payment method",
      type: "string",
      width: 140,
      sortable: false,
    },
  ];

  const rows = data
    ? appointmentListWrapper({
        data: data.data.appointments,
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="From"
            value={filters.appointmentStart}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                appointmentStart: value,
              }))
            }
            slotProps={{
              textField: {
                size: "small",
                color: "secondary",
              },
            }}
          />

          <DatePicker
            label="To"
            value={filters.appointmentEnd}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                appointmentEnd: value,
              }))
            }
            slotProps={{
              textField: {
                size: "small",
                color: "secondary",
              },
            }}
          />
        </LocalizationProvider>
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
            { label: "Scheduled", value: "Scheduled" },
            { label: "Confirmed", value: "Confirmed" },
            { label: "In Progress", value: "In_Progress" },
            { label: "Completed", value: "Completed" },
            { label: "Cancelled", value: "Cancelled" },
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
