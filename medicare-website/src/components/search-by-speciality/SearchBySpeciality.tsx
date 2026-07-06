import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "../button/Button";
import theme from "../../theme";
import { Section } from "../Section";
import { getHospitalOptions, specialties } from "../../constants";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAllHospitalData } from "../../hooks/useAllHospitalData";

export const SearchBySpeciality = () => {
  const { data: hospitalData } = useAllHospitalData();
  const hospitalOptions = getHospitalOptions({
    hospitals: hospitalData?.data?.hospitals,
  });

  return (
    <Box
      sx={{
        margin: `${theme.spacing(4)} auto`,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "80%",
          minHeight: "120px",
          backgroundColor: theme.palette.grey[200],
          padding: `${theme.spacing(1)} ${theme.spacing(4)}`,
        }}
      >
        <Section
          title="Find a Doctor in 3 easy steps"
          description={
            "Find the right doctor for your needs by searching through our specialties."
          }
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: theme.spacing(3),
            flexWrap: "wrap",
            gap: `${theme.spacing(2)}`,
          }}
        >
          <Autocomplete
            options={specialties}
            multiple
            sx={{ minWidth: "250px" }}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose Speciality"
                variant="outlined"
              />
            )}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Appointment Date" />
          </LocalizationProvider>
          <Autocomplete
            options={hospitalOptions}
            multiple
            sx={{ minWidth: "250px" }}
            getOptionLabel={(option) => option?.name}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  minHeight: "56px",
                  "& .MuiOutlinedInput-root": { minHeight: "56px" },
                }}
                placeholder="Choose Hospital"
                variant="outlined"
              />
            )}
          />
          <Button variant="contained" sx={{ height: "56px", width: "150px" }}>
            Search
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
