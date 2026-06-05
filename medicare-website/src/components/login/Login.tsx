import { Box, Divider, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { TextField } from "../text-field/TextField";
import { Button } from "../button/Button";
import theme from "../../theme";
import useAuthStore from "../../store";
import { roles } from "../../constants";
import { type SideBarRole } from "../../types";
import { apiClientWithAuth } from "../../api/client";
import { LOGIN_USER } from "../../api/mutations";
import { useState } from "react";
export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { setUserInfo, closePopup } = useAuthStore((state) => state.login);
  const { mutate: loginUser, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async () => {
      const response = await apiClientWithAuth.post(LOGIN_USER, {
        email: formData.email,
        password: formData.password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      alert("Login successful! Welcome back.");
      setUserInfo(data.data);
      closePopup();
    },
    onError: (error) => {
      alert(
        `Login failed! Please check your credentials and try again. ${error.message}`,
      );
    },
  });

  const openPopup = useAuthStore((state) => state.login.openPopup);
  const btnDisabled = Object.values(formData).some((field) => !field);
  return (
    <Box sx={{ margin: 3 }}>
      <TextField
        label="Email"
        required
        variant="outlined"
        fullWidth
        margin="normal"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        required
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
        disabled={btnDisabled}
        loading={isPending}
        onClick={() => loginUser()}
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
