import { Box, Divider, Typography } from "@mui/material";
import { Button } from "../button/Button";
import type { SideBarRole } from "../../types";
import useBoundStore from "../../store";
import { roles } from "../../constants";
import { TextField } from "../text-field/TextField";
export const ForgotPassword = () => {
  const openPopup = useBoundStore((state) => state.login.openPopup);
  return (
    <Box sx={{ margin: 3 }}>
      <TextField
        label="Email"
        required
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
        fullWidth
      >
        Reset Password
      </Button>
      <Divider sx={{ marginTop: 2 }} />
      <Typography variant="body2" color="textSecondary" sx={{ marginTop: 3 }}>
        If you have any issues, please contact support.
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ textAlign: "center" }}
      >
        Already have an account?
        <Button
          variant="text"
          sx={{ height: "24px" }}
          onClick={() => openPopup(roles.LOGIN as SideBarRole)}
        >
          Log in
        </Button>
      </Typography>
    </Box>
  );
};
