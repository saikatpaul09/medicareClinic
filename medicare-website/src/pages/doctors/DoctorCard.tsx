import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { type Doctor } from "./types";
import { useAllHospitalData } from "../../hooks/useAllHospitalData";
import { useNavigate } from "react-router";

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const specialization = doctor?.specialization.replace("_", " ");
  const specializationU =
    specialization.charAt(0).toUpperCase() +
    specialization.slice(1).toLowerCase();
  const { data: hospitalData } = useAllHospitalData();
  const hospitalName = hospitalData?.data?.hospitals?.find(
    (hospital) => hospital.id === doctor.hospital_id,
  );
  const navigate = useNavigate();
  const navigateString = `/doctor/dr-${doctor.firstName}-${doctor.lastName}/${doctor.id}`;
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        maxWidth: "750px",
        cursor: "pointer",
      }}
      onClick={() => navigate(navigateString)}
    >
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        sx={{ justifyContent: "space-between" }}
      >
        <Stack direction="row" spacing={2}>
          <Avatar
            src={doctor?.profile_picture}
            sx={{
              width: 90,
              height: 90,
            }}
          />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Dr. {doctor?.firstName} {doctor?.lastName}
            </Typography>

            <Typography color="primary" sx={{ fontWeight: 600 }}>
              {specializationU}
            </Typography>

            <Typography variant="body2">
              +{doctor?.experience.toString().replace(/\.00$/, "")} Years
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {hospitalName?.name}
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            ₹{doctor?.consultation_fee}
          </Typography>

          <Button variant="contained">Book Appointment</Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
