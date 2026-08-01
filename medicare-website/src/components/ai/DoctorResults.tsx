import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import DoctorCard from "./DoctorCard";

import { type DoctorResult } from "../../types";

interface Props {
  doctors: DoctorResult[];
}

const DoctorResults = ({ doctors }: Props) => {
  if (doctors.length === 0) return null;

  return (
    <>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Doctors Found
      </Typography>

      <Grid container spacing={2}>
        {doctors.map((doctor) => (
          <Grid key={doctor.id} size={{ xs: 12, md: 6 }}>
            <DoctorCard doctor={doctor} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default DoctorResults;
