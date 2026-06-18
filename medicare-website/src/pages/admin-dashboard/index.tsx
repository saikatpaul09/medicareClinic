import { Outlet } from "react-router";
import { AdminSideBar } from "../../components";
import { shortNameHelper } from "../../utils/helpers";
import Box from "@mui/material/Box";
import theme from "../../theme";
import useAuthStore from "../../store";
import { Typography } from "@mui/material";

const dashboardContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "calc(100vh - 17px)",
  width: "100%",
  overflow: "hidden",
  margin: 0,
};
const header: React.CSSProperties = {
  position: "fixed",
  top: 0,
  margin: 0,
  left: 275,
  width: "calc(100% - 320px)",
  height: "60px",
  display: "flex",
  alignItems: "center",
  padding: "0 20px",
  zIndex: 1000,
};
const dashboardBody: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  marginTop: "60px",
  marginLeft: "268px",
  height: "100%",
  width: "calc(100% - 275px)",
  overflowY: "auto",
  background: "#f1f5f9",
};

const bodyContainer: React.CSSProperties = {
  padding: `${theme.spacing(3)}`,
};

export const AdminDashBoardLayout = () => {
  const userInfo = useAuthStore((state) => state.login.userInfo);
  const shortName = shortNameHelper(
    userInfo.user.firstName,
    userInfo.user.lastName,
  );
  return (
    <div style={dashboardContainer}>
      <div style={header}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            width: "100%",
            marginRight: "60px",
            alignItems: "end",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "4px",
            }}
          >
            <Box>
              {`${userInfo.user.firstName} ${userInfo.user.lastName}`}
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Senior Administrator
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                color: "white",
                background: theme.palette.secondary.main,
              }}
            >
              {shortName}
            </Box>
          </Box>
        </Box>
      </div>
      <AdminSideBar />
      <div style={dashboardBody}>
        <div style={bodyContainer}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
