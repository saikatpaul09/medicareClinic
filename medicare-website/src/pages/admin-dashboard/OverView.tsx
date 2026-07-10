import { useQuery } from "@tanstack/react-query";
import { Box, Card, Grid, Typography, Skeleton, Stack } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { DASHBOARD_OVERVIEW } from "../../api/apiRoutes";
import { apiClientWithAuth } from "../../api/client";
import theme from "../../theme";

export const DashboardOverview = () => {
  const getDashboardOverview = async () => {
    try {
      const result = await apiClientWithAuth.get(DASHBOARD_OVERVIEW);
      if (result) {
        return result.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: getDashboardOverview,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const cards = [
    {
      title: "Doctors",
      value: data?.data?.totalDoctors ?? 0,
      icon: <MedicalServicesIcon sx={{ fontSize: 34 }} />,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.dark} 50%, ${theme.palette.secondary.main} 100%)`,
    },
    {
      title: "Patients",
      value: data?.data?.totalPatients ?? 0,
      icon: <PeopleAltIcon sx={{ fontSize: 34 }} />,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.dark} 50%, ${theme.palette.secondary.main} 100%)`,
    },
    {
      title: "Hospitals",
      value: data?.data?.totalHospitals ?? 0,
      icon: <LocalHospitalIcon sx={{ fontSize: 34 }} />,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.dark} 50%, ${theme.palette.secondary.main} 100%)`,
    },
    {
      title: "Appointments",
      value: data?.data?.totalAppointments ?? 0,
      icon: <CalendarMonthOutlinedIcon sx={{ fontSize: 34 }} />,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.dark} 50%, ${theme.palette.secondary.main} 100%)`,
    },
  ];

  if (isError) {
    return (
      <Typography color="error">Failed to load dashboard overview.</Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid
            key={card.title}
            size={{
              xs: 12,
              md: 3,
              lg: 3,
            }}
          >
            <Card
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 5,
                color: "white",
                background: card.gradient,
                minHeight: 180,
                p: 3,
                boxShadow: 8,
                transition: "all .25s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 16,
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  right: -20,
                  bottom: -20,
                  opacity: 0.12,
                  transform: "rotate(-15deg)",
                  "& svg": {
                    fontSize: 180,
                  },
                }}
              >
                {card.icon}
              </Box>

              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      opacity: 0.9,
                      fontWeight: 500,
                    }}
                  >
                    Total {card.title}
                  </Typography>

                  {isLoading ? (
                    <Skeleton
                      width={120}
                      height={70}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        mt: 1,
                      }}
                    />
                  ) : (
                    <Typography
                      variant="h2"
                      sx={{
                        mt: 1,
                        lineHeight: 1,
                        fontWeight: 800,
                      }}
                    >
                      {card.value.toLocaleString()}
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {card.icon}
                </Box>
              </Stack>

              <Typography
                variant="body2"
                sx={{
                  mt: 4,
                  opacity: 0.8,
                }}
              >
                Active records in the system
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
