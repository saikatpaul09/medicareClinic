import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import PersonalInjuryIcon from "@mui/icons-material/PersonalInjury";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { useLocation, useNavigate } from "react-router";
import logo from "../../assets/medicare_icon.png";
import theme from "../../theme";

const sidebarContent = [
  {
    id: "Dashboard",
    icon: DashboardIcon,
    url: "/dashboard",
  },
  {
    id: "All Appointments",
    icon: CalendarMonthIcon,
    url: "/dashboard/appointments",
  },
  {
    id: "Doctors List",
    icon: LocalPharmacyIcon,
    url: "/dashboard/doctors-list",
  },
  {
    id: "All patients",
    icon: PersonalInjuryIcon,
    url: "/dashboard/patient-list",
  },
  {
    id: "Affiliated Hospitals",
    icon: LocalHospitalIcon,
    url: "/dashboard/hospital-list",
  },
];
export const AdminSideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        padding: "12px",
        position: "fixed",
        left: 0,
        height: "100vh",
        minWidth: "250px",
        top: "0",
        zIndex: 10,
        marginTop: "10px",
      }}
    >
      <img src={logo} width={100} height={100} alt="Medicare Logo" />
      <Box
        sx={{
          marginTop: "60px",
          display: "flex",
          gap: "12px",
          flexDirection: "column",
        }}
      >
        {sidebarContent.map((content) => {
          const isActive = location.pathname === content.url;

          return (
            <Box
              key={`admin${content.id}`}
              onClick={() => navigate(`${content.url}`)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px 12px",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "30px",
                color: `${isActive ? "white" : "#64748b"}`,
                background: `${isActive ? theme.palette.secondary.main : "#fff"}`,
                "&:hover": {
                  color: theme.palette.secondary.main,
                  background: theme.palette.secondary.light, // Custom background color on hover
                },
              }}
            >
              <content.icon />
              <Typography>{content.id}</Typography>
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px 12px",
          cursor: "pointer",
          padding: "8px 12px",
          borderRadius: "30px",
          color: "#64748b",
          background: "#fff",
          position: "fixed",
          bottom: 30,
          width: "230px",
          "&:hover": {
            color: theme.palette.secondary.main,
            background: theme.palette.secondary.light, // Custom background color on hover
          },
        }}
      >
        <PowerSettingsNewIcon />
        <Typography>Logout</Typography>
      </Box>
    </Box>
  );
};
