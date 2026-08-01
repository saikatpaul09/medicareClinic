import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import { useNavigate } from "react-router";

import type { DoctorResult } from "../../types";

interface Props {
  doctor: DoctorResult;
}

const DoctorCard = ({ doctor }: Props) => {
  const navigate = useNavigate();

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 8,
        },
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: "primary.main",
            }}
          >
            <PersonIcon />
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {doctor.name}
            </Typography>

            <Chip
              label={(
                doctor.specialization.charAt(0).toUpperCase() +
                doctor.specialization.slice(1).toLowerCase()
              ).replaceAll("_", " ")}
              color="secondary"
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.2}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <WorkOutlineRoundedIcon color="action" fontSize="small" />
            <Typography variant="body2">
              {Math.trunc(doctor.experience)} Years Experience
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <CurrencyRupeeIcon color="action" fontSize="small" />
            <Typography variant="body2">
              ₹ {Math.trunc(doctor.consultationFee)}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <BusinessIcon color="action" fontSize="small" />
            <Typography variant="body2">{doctor.institution}</Typography>
          </Stack>
        </Stack>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          sx={{
            mt: 3,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
          onClick={() => navigate(`/doctor/${doctor.slug}/${doctor.id}`)}
        >
          Book Appointment
        </Button>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
