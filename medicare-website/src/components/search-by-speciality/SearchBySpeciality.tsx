import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { Button } from "../button/Button";
import theme from "../../theme";
import { Section } from "../Section";
import { specialties } from "../../constants";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

export const SearchBySpeciality = () => {
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
            sx={{ width: "250px" }}
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
            options={specialties}
            sx={{ width: "250px" }}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  height: "56px",
                  "& .MuiOutlinedInput-root": { height: "56px" },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnOutlinedIcon />
                      </InputAdornment>
                    ),
                  },
                }}
                placeholder="Choose Location"
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
