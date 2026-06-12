import { useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { TextField } from "../text-field/TextField";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../button/Button";
import { EMAIL_REGEX, roles } from "../../constants";
import type { SideBarRole } from "../../types";
import useBoundStore from "../../store";
import { REGISTER_USER } from "../../api/mutations";
import { apiClient } from "../../api/client";

export const SignUp = () => {
  const openPopup = useBoundStore((state) => state.login.openPopup);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "patient",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const formDataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: "PATIENT",
      };
      const response = await apiClient.post(REGISTER_USER, formDataToSend);
      return response.data;
    },
    onSuccess: () => {
      alert("User created successfully! Please log in.");
      openPopup(roles.LOGIN as SideBarRole);
      // Optionally, you can log the user in immediately after registration
      // or redirect them to a welcome page.
    },
    onError: (error) => {
      console.error("Error creating user:", error);
      alert(`Error creating user:", ${error.message}`);
    },
  });

  const btnDisabled =
    Object.values(formData).some((field) => !field) && !!error;
  return (
    <Box sx={{ margin: 3 }}>
      <TextField
        label="First Name"
        required
        variant="outlined"
        fullWidth
        margin="normal"
        value={formData.firstName}
        onChange={(e) =>
          setFormData({ ...formData, firstName: e.target.value })
        }
      />
      <TextField
        label="Last Name"
        required
        variant="outlined"
        fullWidth
        margin="normal"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
      />
      <TextField
        label={error ? "Please enter proper email Id" : "Email"}
        required
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!error}
        value={formData.email}
        onBlur={() => {
          // Trim whitespace to handle accidental trailing spaces
          const trimmedEmail = formData.email.trim();
          if (!trimmedEmail) {
            setError("Email address is required.");
          } else if (!EMAIL_REGEX.test(trimmedEmail)) {
            setError("Please enter a valid email address.");
          } else {
            setError(""); // Clear error if validation passes
          }
        }}
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
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
        fullWidth
        disabled={btnDisabled}
        loading={isPending}
        onClick={() => mutate()}
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
