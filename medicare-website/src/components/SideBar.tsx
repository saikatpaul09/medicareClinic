import { Box, Divider, Typography } from "@mui/material";
import theme from "../theme";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { sideBarContent } from "../constants";
import useAuthStore from "../store";

type Role = "" | "LOGIN" | "SIGNUP" | "FORGOT_PASSWORD" | "PROFILE";
export const SideBar = ({ role }: { role: Role }) => {
  const { title, component: Component } =
    sideBarContent?.[role as keyof typeof sideBarContent] || {};
  const closePopup = useAuthStore((state) => state.login.closePopup);
  return (
    <Box
      sx={{
        position: "fixed",
        right: 0,
        top: 0,
        height: "100vh",
        width: 400,
        bgcolor: `${theme.palette.background.paper}`,
        borderRight: "1px solid",
        borderColor: "divider",
        boxShadow: theme.shadows[4],
        zIndex: 1000,
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            cursor: "pointer",
            alignItems: "center",
            marginTop: theme.spacing(2),
            marginRight: theme.spacing(2),
          }}
          onClick={closePopup}
        >
          <CloseOutlinedIcon />
        </Box>
        <Divider sx={{ margin: `${theme.spacing(2)} 0` }} />
        {role !== "PROFILE" && (
          <Typography variant="h5" sx={{ margin: theme.spacing(3) }}>
            {title}
          </Typography>
        )}
        <Component />
      </Box>
    </Box>
  );
};
