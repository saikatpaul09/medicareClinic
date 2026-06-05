import { Box, Typography } from "@mui/material";
import theme from "../../theme";
import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AudioFileRoundedIcon from "@mui/icons-material/AudioFileRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { LOGOUT_USER } from "../../api/mutations";
import useAuthStore from "../../store";
export const MyAccount = () => {
  const { userInfo, clearUserInfo } = useAuthStore((state) => state.login);
  const closePopup = useAuthStore((state) => state.login.closePopup);
  const user = userInfo?.user;
  const shortName = `${user?.firstName} ${user?.lastName}`
    ?.split(" ")
    .map((name: string) => name[0])
    .join("");
  const { mutate: logout } = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const response = await apiClient.post(LOGOUT_USER);
      return response.data;
    },
    onSuccess: () => {
      alert("Logout successful!");
    },
    onError: (error) => {
      alert(`Logout failed! Please try again later. ${error.message}`);
    },
  });

  const onLogoutHandler = () => {
    logout();
    clearUserInfo();
    closePopup();
  };

  const options = [
    {
      id: "my-family",
      label: "My Family",
      icon: <FamilyRestroomRoundedIcon />,
    },
    {
      id: "my-appointments",
      label: "My Appointments",
      icon: <EventAvailableRoundedIcon />,
    },
    {
      id: "health-records",
      label: "Health Records",
      icon: <AudioFileRoundedIcon />,
    },
    {
      id: "logout",
      label: "Logout",
      icon: <LogoutRoundedIcon />,
      onClick: onLogoutHandler,
    },
  ];

  return (
    <Box sx={{ padding: theme.spacing(2) }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#f6f6f6",
          padding: theme.spacing(2),
          borderRadius: theme.shape.borderRadius,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: "bold",
          }}
        >
          {shortName}
        </Box>
        <Box>
          <Typography variant="h6">
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ marginTop: theme.spacing(3) }}>
        {options.map((option) => (
          <Box
            key={option.id}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: theme.spacing(2),
              borderBottom: `1px solid ${theme.palette.divider}`,
              cursor: "pointer",
              "&:last-child": {
                borderBottom: "none",
              },
            }}
            onClick={option.onClick}
          >
            {option.icon}
            <Typography variant="body1" sx={{ marginLeft: theme.spacing(1) }}>
              {option.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
