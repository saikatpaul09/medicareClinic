import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentsIcon from "@mui/icons-material/Payments";
import { apiClientWithAuth } from "../../api/client";
// Adjust to match your actual apiRoutes.ts entry
import { GET_APPOINTMENT_BY_ID_ROUTE } from "../../api/apiRoutes";
import useAuthStore from "../../store";

// ---------- Types ----------
interface AppointmentRow {
  id: string;
  appointment_datetime: string;
  status: "Scheduled" | "Completed" | "Cancelled" | string;
  doctor_first_name: string;
  doctor_last_name: string;
  specialization: string;
  degree_name: string;
  hospital_name: string;
  amount: number;
  payment_status: "Completed" | "Pending" | "Failed" | string;
  payment_method: string;
}

// ---------- API ----------
const fetchMyAppointments = async (): Promise<AppointmentRow[]> => {
  const result = await apiClientWithAuth.get(`${GET_APPOINTMENT_BY_ID_ROUTE}`);
  return result.data.data.appointments;
};

// ---------- Helpers ----------
const formatDate = (isoString: string) =>
  new Date(isoString).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatTime = (isoString: string) =>
  new Date(isoString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const statusColor = (
  status: string,
): "success" | "warning" | "error" | "default" => {
  switch (status) {
    case "Scheduled":
      return "success";
    case "Completed":
      return "success";
    case "Cancelled":
      return "error";
    default:
      return "default";
  }
};

const paymentStatusColor = (
  status: string,
): "success" | "warning" | "error" | "default" => {
  switch (status) {
    case "Confirmed":
      return "success";
    case "Pending":
      return "warning";
    case "Failed":
      return "error";
    default:
      return "default";
  }
};

// ---------- Component ----------
export const MyAppointmentsPage = () => {
  const navigate = useNavigate();
  const userInfo = useAuthStore((state) => state.login.userInfo);
  const patientId = userInfo?.user?.id;
  const {
    data: appointments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myAppointments", patientId],
    queryFn: () => fetchMyAppointments(),
    enabled: Boolean(patientId),
  });

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 3 } }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        My Appointments
      </Typography>

      {isLoading && (
        <Stack spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" spacing={2}>
                  <Skeleton variant="rounded" width={64} height={64} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton width="40%" height={28} />
                    <Skeleton width="25%" />
                    <Skeleton width="60%" sx={{ mt: 1 }} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {isError && (
        <Typography color="error" sx={{ textAlign: "center", py: 4 }}>
          Something went wrong while loading your appointments. Please try
          again.
        </Typography>
      )}

      {!isLoading && !isError && appointments?.length === 0 && (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            No appointments yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Once you book a consultation, it'll show up here.
          </Typography>
          <Button variant="contained" onClick={() => navigate("/doctors")}>
            Browse Doctors
          </Button>
        </Box>
      )}

      {!isLoading && !isError && appointments && appointments.length > 0 && (
        <Stack spacing={2}>
          {appointments.map((appointment) => (
            <Card
              key={appointment.id}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              <CardContent>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ alignItems: { sm: "center" } }}
                >
                  <Avatar variant="rounded" sx={{ width: 64, height: 64 }}>
                    {appointment.doctor_first_name?.[0]}
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Dr. {appointment.doctor_first_name}{" "}
                      {appointment.doctor_last_name}
                    </Typography>
                    <Typography
                      color="primary"
                      variant="body2"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {appointment?.specialization.charAt(0).toUpperCase() +
                        appointment?.specialization.slice(1).toLowerCase()}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center", mb: 0.5 }}
                    >
                      <LocationOnIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {appointment?.hospital_name}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ alignItems: "center", flexWrap: "wrap" }}
                    >
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ alignItems: "center" }}
                      >
                        <CalendarMonthIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {formatDate(appointment.appointment_datetime)}
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ alignItems: "center" }}
                      >
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {formatTime(appointment.appointment_datetime)}
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ alignItems: "center" }}
                      >
                        <PaymentsIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          ₹{appointment.amount}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>

                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ display: { xs: "none", sm: "block" } }}
                  />

                  <Stack
                    spacing={1}
                    sx={{
                      alignItems: { xs: "flex-start", sm: "flex-end" },
                      minWidth: 140,
                    }}
                  >
                    <Chip
                      label={appointment.status}
                      color={statusColor(appointment.status)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip
                      label={`Payment: ${appointment.payment_status}`}
                      color={paymentStatusColor(appointment.payment_status)}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};
