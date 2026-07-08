import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "../button/Button";
import theme from "../../theme";
import { EMAIL_REGEX } from "../../constants";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import { PATIENT_API_ROUTE } from "../../api/apiRoutes";
import { apiClientWithAuth } from "../../api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "../Loader";
import useAuthStore from "../../store";

type Gender = "MALE" | "FEMALE" | "OTHERS" | "";
type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  gender: Gender;
};

export const EditProfile = ({
  handleClose,
  open,
}: {
  handleClose: () => void;
  open: boolean;
}) => {
  const queryClient = useQueryClient();
  const { userInfo, setUserInfo } = useAuthStore((state) => state.login);
  const userId = userInfo.user.id;
  const getPatientProfileDetails = async () => {
    try {
      const result = await apiClientWithAuth.get(PATIENT_API_ROUTE);
      if (result) {
        return result.data.data.user;
      }
    } catch (error) {
      console.log(error);
    }
  };
  //Query
  const { data, isLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: getPatientProfileDetails,
    staleTime: 300 * 100,
  });
  //Mutatation
  const { mutate: mutuateUpdateProfile, isPending } = useMutation({
    mutationFn: async (formData: ProfileForm) => {
      const response = await apiClientWithAuth.post(
        PATIENT_API_ROUTE,
        formData,
      );
      return response.data;
    },
    onSuccess: (data) => {
      alert("Profile updated");
      setUserInfo({
        ...userInfo,
        user: {
          ...userInfo.user,
          firstName: data.data.user.firstName,
          lastName: data.data.user.lastName,
          email: data.data.user.email,
        },
      });
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      queryClient.setQueryData(["user", userId], data);
      handleClose();
    },
    onError: (error) => {
      alert(`Error updating profile: ${error?.message ?? error}`);
    },
  });

  if (isLoading) {
    return <Loader />;
  }
  return (
    <EditProfilDialogBox
      open={open}
      handleClose={handleClose}
      data={data}
      key={`userProfile${userInfo.user.id}`}
      mutuateUpdateProfile={mutuateUpdateProfile}
      isPending={isPending}
    />
  );
};

const EditProfilDialogBox = ({
  handleClose,
  open,
  data,
  mutuateUpdateProfile,
  isPending,
}: {
  handleClose: () => void;
  open: boolean;
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    age: string;
    gender: Gender;
  };

  isPending: boolean;
  mutuateUpdateProfile: (formData: ProfileForm) => void;
}) => {
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState(data);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-slide-description"
      role="alertdialog"
      sx={{
        padding: theme.spacing(5),
      }}
    >
      <DialogTitle id="alert-dialog-title" sx={{ m: 0, p: 2 }}>
        {"Edit your profile"}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <TextField
            label="First Name"
            required
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{ width: "270px" }}
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          <TextField
            label="Last Name"
            required
            sx={{ width: "250px" }}
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
          <TextField
            label={error ? "Please enter proper email Id" : "Email"}
            required
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{ width: "270px" }}
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
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <TextField
            label="Age"
            sx={{ width: "270px" }}
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
          <TextField
            label="Phone No."
            sx={{ width: "250px" }}
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <Box>
            <Typography>Gender</Typography>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    disabled
                    checked={formData.gender === "MALE"}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        gender: "MALE",
                      })
                    }
                  />
                }
                label="Male"
              />
              <FormControlLabel
                required
                control={
                  <Checkbox
                    checked={formData.gender === "FEMALE"}
                    disabled
                    onChange={() =>
                      setFormData({
                        ...formData,
                        gender: "FEMALE",
                      })
                    }
                  />
                }
                label="Female"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.gender === "OTHERS"}
                    disabled
                    onChange={() =>
                      setFormData({
                        ...formData,
                        gender: "OTHERS",
                      })
                    }
                  />
                }
                label="Others"
              />
            </FormGroup>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ m: 0, p: 2 }}>
        <Button
          autoFocus
          loading={isPending}
          onClick={() => mutuateUpdateProfile(formData)}
        >
          Save
        </Button>
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
