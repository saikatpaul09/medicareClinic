import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  genderOptions,
  experienceOptions,
  consultaionFees,
  specialties,
} from "../../constants";

import { type DoctorFilters, type HospitalOption } from "./types";
import { Button } from "../../components";

interface DoctorsFiltersProps {
  filters: DoctorFilters;
  updateFilter: (key: keyof DoctorFilters, value: string | number) => void;
  clearAllFilters: () => void;
  hospitalOptions: HospitalOption[];
}

export default function DoctorsFilters({
  filters,
  updateFilter,
  clearAllFilters,
  hospitalOptions,
}: DoctorsFiltersProps) {
  return (
    <Stack spacing={1}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Filters
        </Typography>

        <Button size="small" variant="text" onClick={clearAllFilters}>
          Clear All
        </Button>
      </Box>

      {/* Specialization */}
      <Accordion
        defaultExpanded
        disableGutters
        sx={{ boxShadow: "none", border: "none" }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 700 }}>Specialization</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Stack>
            {specialties.map((specialty) => (
              <FormControlLabel
                key={specialty.value}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.specialization === specialty.value}
                    onChange={() =>
                      updateFilter("specialization", specialty.value)
                    }
                  />
                }
                label={specialty.name}
              />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Hospital */}
      <Accordion
        defaultExpanded
        disableGutters
        sx={{ boxShadow: "none", border: "none" }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 600 }}>Hospital</Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ boxShadow: "none", border: "none" }}>
          <FormControl fullWidth size="small">
            <Select
              displayEmpty
              value={filters.hospital_id}
              onChange={(event) =>
                updateFilter("hospital_id", event.target.value)
              }
              renderValue={(selected) => {
                if (!selected) {
                  return "All Hospitals";
                }

                const hospital = hospitalOptions.find(
                  (item) => item.value === selected,
                );

                return hospital?.name ?? "All Hospitals";
              }}
            >
              <MenuItem value="">All Hospitals</MenuItem>

              {hospitalOptions.map((hospital) => (
                <MenuItem key={hospital.value} value={hospital.value}>
                  {hospital.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Gender */}
      <Accordion
        defaultExpanded
        disableGutters
        sx={{ boxShadow: "none", border: "none" }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 600 }}>Gender</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Stack>
            {genderOptions.map((gender) => (
              <FormControlLabel
                key={gender.value}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.gender === gender.value}
                    onChange={() => updateFilter("gender", gender.value)}
                  />
                }
                label={gender.label}
              />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Consultation Fee */}
      <Accordion
        defaultExpanded
        disableGutters
        sx={{ boxShadow: "none", border: "none" }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 600 }}>Consultation Fee</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Stack>
            {consultaionFees.map((fee) => (
              <FormControlLabel
                key={fee.label}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.consultation_fee === fee.label}
                    onChange={() => updateFilter("consultation_fee", fee.label)}
                  />
                }
                label={fee.label}
              />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Experience */}
      <Accordion
        defaultExpanded
        disableGutters
        sx={{ boxShadow: "none", border: "none" }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 600 }}>Experience</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Stack>
            {experienceOptions.map((experience) => (
              <FormControlLabel
                key={experience.value}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.experience === experience.value}
                    onChange={() =>
                      updateFilter("experience", experience.value)
                    }
                  />
                }
                label={`${experience.value}+ Years`}
              />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
