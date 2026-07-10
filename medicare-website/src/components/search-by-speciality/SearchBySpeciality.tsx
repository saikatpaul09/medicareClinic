import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "../button/Button";
import theme from "../../theme";
import { Section } from "../Section";
import { getHospitalOptions, specialties } from "../../constants";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAllHospitalData } from "../../hooks/useAllHospitalData";
import { useState } from "react";
import { useNavigate } from "react-router";

export const SearchBySpeciality = () => {
  const { data: hospitalData } = useAllHospitalData();
  const hospitalOptions = getHospitalOptions({
    hospitals: hospitalData?.data?.hospitals,
  });
  const [searchState, setSearchState] = useState({
    specialization: "",
    hospital_id: "",
  });
  const navigate = useNavigate();
  const disabled = !searchState.hospital_id || !searchState.hospital_id;
  const navigateUrl = `/doctors?specialization=${searchState.specialization}&hospital_id=${searchState.hospital_id}`;
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
            value={
              specialties.filter(
                (item) => item.value === searchState.specialization,
              )[0]
            }
            sx={{ minWidth: "250px" }}
            getOptionLabel={(option) => option.name}
            onChange={(_, value) => {
              setSearchState({
                ...searchState,
                specialization: value.value,
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose Speciality"
                variant="outlined"
              />
            )}
          />
          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Appointment Date" />
          </LocalizationProvider> */}
          <Autocomplete
            options={hospitalOptions}
            value={
              hospitalOptions.filter(
                (hospital) => hospital.value === searchState.hospital_id,
              )[0]
            }
            onChange={(_, value) =>
              setSearchState({
                ...searchState,
                hospital_id: value.value,
              })
            }
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
          <Button
            disabled={disabled}
            variant="contained"
            sx={{ height: "56px", width: "150px" }}
            onClick={() => navigate(navigateUrl)}
          >
            Search
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
