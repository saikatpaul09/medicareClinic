import { Box, Divider, TextField, Typography } from "@mui/material";
import { Button } from "../button/Button";
import { roles } from "../../constants";
import type { SideBarRole } from "../../types";
import useBoundStore from "../../store";
export const SignUp = () => {
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
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        required
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
        fullWidth
      >
        Sign Up
      </Button>
      <Divider sx={{ marginTop: 2 }} />
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ marginTop: 3, textAlign: "center" }}
      >
        By clicking Sign Up, you agree to medicare's Privacy Policy & Terms and
        Conditions
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ textAlign: "center", marginTop: 2 }}
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
