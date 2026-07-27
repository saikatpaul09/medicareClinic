import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import theme from "../../theme";
import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AudioFileRoundedIcon from "@mui/icons-material/AudioFileRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import { useMutation } from "@tanstack/react-query";
import { apiClientWithAuth } from "../../api/client";
import { LOGOUT_USER } from "../../api/apiRoutes";
import useAuthStore from "../../store";
import { EditProfile } from "./EditProfile";
import { shortNameHelper } from "../../utils/helpers";
import { useNavigate } from "react-router";
export const MyAccount = () => {
  const { userInfo, clearUserInfo } = useAuthStore((state) => state.login);
  const [openPopup, setOpenPopup] = useState(false);
  const closePopup = useAuthStore((state) => state.login.closePopup);
  const user = userInfo?.user;
  const name = shortNameHelper(user?.firstName, user?.lastName);
  const navigate = useNavigate();
  const { mutate: logout } = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const response = await apiClientWithAuth.post(LOGOUT_USER, {
        userId: user.id,
      });
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

  const editMyProfileHandler = () => {
    setOpenPopup(true);
  };

  const options = [
    {
      id: "my-account",
      label: "My Profile",
      icon: <FamilyRestroomRoundedIcon />,
      onClick: editMyProfileHandler,
    },
    {
      id: "my-appointments",
      label: "My Appointments",
      icon: <EventAvailableRoundedIcon />,
      onClick: () => {
        navigate("/my-appointments");
        closePopup();
      },
    },
    {
      id: "health-records",
      label: "Health Records",
      icon: <AudioFileRoundedIcon />,
      onClick: () => {
        closePopup();
      },
    },
    {
      id: "logout",
      label: "Logout",
      icon: <LogoutRoundedIcon />,
      onClick: onLogoutHandler,
    },
  ];

  return (
    <>
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
            {name}
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
      {openPopup && (
        <EditProfile open={openPopup} handleClose={() => setOpenPopup(false)} />
      )}
    </>
  );
};
