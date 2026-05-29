import { Box, Divider, Typography } from "@mui/material";
import { TextField } from "../text-field/TextField";
import { Button } from "../button/Button";
import theme from "../../theme";
import useBoundStore from "../../store";
import { roles } from "../../constants";
import { type SideBarRole } from "../../types";

export const Login = () => {
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
      <Typography variant="body2" color="textSecondary">
        By clicking Continue, you agree to medicare's Privacy Policy & Terms and
        Conditions
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
        fullWidth
      >
        Sign in
      </Button>
      <Divider sx={{ marginTop: `${theme.spacing(2)}` }} />
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ marginTop: 3, textAlign: "center" }}
      >
        Don't have an account?
        <Button
          variant="text"
          sx={{ height: "24px" }}
          onClick={() => openPopup(roles.SIGNUP as SideBarRole)}
        >
          Sign up
        </Button>
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ textAlign: "center" }}
      >
        Forgot your password?
        <Button
          variant="text"
          sx={{ height: "24px" }}
          onClick={() => openPopup(roles.FORGOT_PASSWORD as SideBarRole)}
        >
          Reset
        </Button>
      </Typography>
    </Box>
  );
};
