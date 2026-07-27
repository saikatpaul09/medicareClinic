import { Box } from "@mui/material";
import { Carousel, SearchBySpeciality, Section } from "../components";
import { carouselItems } from "../constants";
import { specialties } from "../constants";
import theme from "../theme";
import { useNavigate } from "react-router";

export const HomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Carousel items={carouselItems} />
      <Section
        title="Browse By Speciality"
        description={
          "Choose from a wide range of specialties and find the right doctor for your needs."
        }
      />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            maxWidth: "1200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: `${theme.spacing(2)}`,
            flexWrap: "wrap",
            marginTop: theme.spacing(3),
          }}
        >
          {specialties.map((specialty) => {
            const IconComponent = specialty.icon;
            const navigateUrl = `/doctors?specialization=${specialty.value}`;
            return (
              <Box
                key={specialty.name}
                onClick={() => navigate(navigateUrl)}
                sx={{
                  textAlign: "center",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "20px",
                  width: "120px",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  padding: theme.spacing(3),
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <IconComponent
                  style={{
                    fontSize: "40px",
                    color: theme.palette.text.primary,
                  }}
                />
                <div>{specialty.name}</div>
              </Box>
            );
          })}
        </Box>
      </Box>
      <SearchBySpeciality />
    </>
  );
};
