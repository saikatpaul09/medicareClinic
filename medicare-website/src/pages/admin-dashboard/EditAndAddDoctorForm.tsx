import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import theme from "../../theme";
import { Button } from "../../components";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { EMAIL_REGEX, specialtiesList, statusOptions } from "../../constants";
import Autocomplete from "@mui/material/Autocomplete";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  CREATE_NEW_DOCTOR,
  UPDATE_DOCTOR,
  ADMIN_CREATE_NEW_PATIENT,
  ADMIN_UPDATE_PATIENT,
} from "../../api/mutations";
import { apiClientWithAuth } from "../../api/client";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { generatePassword } from "../../utils/helpers";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

type Profile = "DOCTOR" | "PATIENT";
export const EditOrAddDoctorForm = ({
  mode,
  handleClose,
  open,
  doctorData,
  hospitalOptions,
  profile = "DOCTOR",
}: {
  mode: string | null;
  handleClose: () => void;
  open: boolean;
  doctorData?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    date_of_birth: Dayjs;
    specialization: string;
    license_number: string;
    consultation_fee: string;
    hospital_id: string;
    status: string;
  } | null;
  profile: Profile;
  hospitalOptions?: { name: string; value: string }[];
}) => {
  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    gender: "",
    license_number: "",
    specialization: "",
    consultation_fee: "",
    date_of_birth: "",
  });
  const disabled =
    error.firstName ||
    error.lastName ||
    error.email ||
    error.password ||
    error.date_of_birth;
  const [toggle, setToggle] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    firstName: doctorData?.firstName || "",
    lastName: doctorData?.lastName || "",
    email: doctorData?.email || "",
    phone: doctorData?.phone || "",
    gender: doctorData?.gender || "",
    date_of_birth: doctorData?.date_of_birth
      ? dayjs(doctorData?.date_of_birth)
      : null,
    specialization: doctorData?.specialization || "",
    license_number: doctorData?.license_number || "",
    consultation_fee: doctorData?.consultation_fee || "",
    hospital_id: doctorData?.hospital_id || "",
    status: doctorData?.status || "ACTIVE",
  });

  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();
  const isDoctor = profile === "DOCTOR";
  const title =
    mode === "edit"
      ? isDoctor
        ? "Edit Doctor Profile"
        : "Edit Patient Profile"
      : isDoctor
        ? "Add a New Doctor"
        : "Add a New Patient";
  const successTitle =
    mode === "edit"
      ? isDoctor
        ? "Doctor details updated"
        : "Patient details updated"
      : isDoctor
        ? "New doctor added"
        : "New patient added";
  const { mutate: updateDoctorHandler, isPending } = useMutation({
    mutationKey: profile === "DOCTOR" ? ["updateDoctor"] : ["updatePatient"],
    mutationFn: async () => {
      const API =
        mode === "edit"
          ? profile === "DOCTOR"
            ? UPDATE_DOCTOR
            : ADMIN_UPDATE_PATIENT
          : profile === "DOCTOR"
            ? CREATE_NEW_DOCTOR
            : ADMIN_CREATE_NEW_PATIENT;
      const methodType = mode === "edit" ? "put" : "post";
      const response = await apiClientWithAuth[methodType](API, {
        ...(mode === "edit" && {
          userId: doctorData.id,
        }),
        ...(mode === "add" && {
          password: password,
        }),
        firstName: formData?.firstName,
        lastName: formData?.lastName,
        email: formData?.email,
        phone: formData?.phone,
        gender: formData?.gender,
        date_of_birth: dayjs(formData?.date_of_birth),
        ...(profile === "DOCTOR" && {
          specialization: formData?.specialization,
          license_number: formData?.license_number,
          consultation_fee: formData?.consultation_fee,
          hospital_id: formData?.hospital_id,
          status: formData?.status,
        }),
      });

      return response.data;
    },
    onSuccess: () => {
      alert(`${successTitle} successfully`);
      queryClient.invalidateQueries({
        queryKey: profile === "DOCTOR" ? ["doctorsList"] : ["patientList"],
        exact: false,
      });
      handleClose();
    },
    onError: (error) => {
      alert(`Update Failed! Please refresh and try again. ${error.message}`);
    },
  });
  const generatedPasswordHelper = () => {
    const password = generatePassword();
    setPassword(password);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-slide-description"
      role="alertdialog"
      fullWidth={true}
      sx={{
        padding: theme.spacing(5),
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "800px", // Custom width
          },
        },
      }}
    >
      <DialogTitle id="alert-dialog-title" sx={{ m: 0, p: 2, fontWeight: 500 }}>
        {title}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Typography variant="h6">Basic Details</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
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
            error={!!error.firstName}
            sx={{ width: "235px" }}
            onBlur={() => {
              if (!formData.firstName) {
                setError({ ...error, firstName: "First name is required." });
              } else {
                setError({
                  ...error,
                  firstName: "",
                });
              }
            }}
            color="secondary"
            value={formData?.firstName}
            onChange={(e) => {
              if (e.target.value && error.firstName) {
                setError({
                  ...error,
                  firstName: "",
                });
              }
              setFormData({ ...formData, firstName: e.target.value });
            }}
          />
          <TextField
            label="Last Name"
            required
            variant="outlined"
            color="secondary"
            fullWidth
            margin="normal"
            sx={{ width: "235px" }}
            error={!!error.lastName}
            value={formData?.lastName}
            onBlur={() => {
              if (!formData.lastName) {
                setError({ ...error, lastName: "First name is required." });
              } else {
                setError({
                  ...error,
                  lastName: "",
                });
              }
            }}
            onChange={(e) => {
              if (e.target.value && error.lastName) {
                setError({
                  ...error,
                  lastName: "",
                });
              }
              setFormData({ ...formData, lastName: e.target.value });
            }}
          />
          {mode === "add" && (
            <TextField
              label="Password"
              type={toggle ? "text" : "password"}
              sx={{ width: "235px" }}
              variant="outlined"
              fullWidth
              margin="normal"
              color="secondary"
              error={!!error.password}
              onBlur={() => {
                if (!password) {
                  setError({ ...error, password: "Password is required." });
                } else {
                  setError({
                    ...error,
                    password: "",
                  });
                }
              }}
              value={password}
              onChange={(e) => {
                if (e.target.value && error.password) {
                  setError({
                    ...error,
                    password: "",
                  });
                }
                setPassword(e.target.value);
              }}
              slotProps={{
                input: {
                  endAdornment: password && (
                    <>
                      <RemoveRedEyeOutlinedIcon
                        onClick={() => setToggle(!toggle)}
                        color={"action"}
                        sx={{
                          fontSize: "20px",
                          cursor: "pointer",
                        }}
                      />
                    </>
                  ),
                  startAdornment: (
                    <RestartAltRoundedIcon
                      onClick={generatedPasswordHelper}
                      color={"action"}
                      sx={{ fontSize: "20px", cursor: "pointer" }}
                    />
                  ),
                },
              }}
            />
          )}
          <TextField
            label={error ? "Please enter proper email Id" : "Email"}
            required
            variant="outlined"
            color="secondary"
            fullWidth
            margin="normal"
            sx={{ width: "235px" }}
            error={!!error.email}
            value={formData.email}
            onBlur={() => {
              // Trim whitespace to handle accidental trailing spaces
              const trimmedEmail = formData.email.trim();
              if (!trimmedEmail) {
                setError({ ...error, email: "Email is required." });
              } else if (!EMAIL_REGEX.test(trimmedEmail)) {
                setError({ ...error, email: "Valid Email is required." });
              } else {
                setError({ ...error, email: "" });
              }
            }}
            onChange={(e) => {
              if (e.target.value && error.email) {
                setError({
                  ...error,
                  email: "",
                });
              }
              setFormData({ ...formData, email: e.target.value });
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ marginTop: "10px" }}
              slotProps={{
                textField: {
                  color: "secondary",
                  error: !!error.date_of_birth,
                  onBlur: () => {
                    if (!formData.date_of_birth) {
                      setError({
                        ...error,
                        date_of_birth: "date of birth is required.",
                      });
                    } else {
                      setError({
                        ...error,
                        date_of_birth: "",
                      });
                    }
                  },
                },
              }}
              label="Date of Birth"
              value={formData.date_of_birth}
              onChange={(e) => {
                if (e) {
                  setError({
                    ...error,
                    date_of_birth: "",
                  });
                }
                setFormData({ ...formData, date_of_birth: e });
              }}
            />
          </LocalizationProvider>
          <TextField
            label="Phone No."
            sx={{ width: "230px" }}
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.phone}
            color="secondary"
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
                    disabled={mode === "edit" && !!doctorData.gender}
                    color="secondary"
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
                    disabled={mode === "edit" && !!doctorData.gender}
                    color="secondary"
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
                    disabled={mode === "edit" && !!doctorData.gender}
                    color="secondary"
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
        <Divider sx={{ marginTop: "10px" }} />
        {profile === "DOCTOR" && (
          <>
            <Typography variant="h6" sx={{ marginTop: "10px" }}>
              Doctor Info
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <Autocomplete
                sx={{ width: 230 }}
                color="secondary"
                options={specialtiesList}
                value={
                  specialtiesList.filter(
                    (speciality) =>
                      speciality.value === formData.specialization,
                  )[0]
                }
                onChange={(_, value) =>
                  setFormData({
                    ...formData,
                    specialization: value.value,
                  })
                }
                renderInput={(params) => (
                  <TextField
                    color="secondary"
                    {...params}
                    label="Specialization"
                    variant="outlined"
                  />
                )}
              />
              <TextField
                label="License No"
                sx={{ width: "230px" }}
                variant="outlined"
                fullWidth
                margin="normal"
                color="secondary"
                value={formData.license_number}
                onChange={(e) =>
                  setFormData({ ...formData, license_number: e.target.value })
                }
              />
              <TextField
                label="Consultation Fee"
                sx={{ width: "230px" }}
                variant="outlined"
                fullWidth
                margin="normal"
                color="secondary"
                type="number"
                onChange={(e) =>
                  setFormData({ ...formData, consultation_fee: e.target.value })
                }
                value={formData.consultation_fee}
                slotProps={{
                  input: {
                    endAdornment: (
                      <>
                        <CurrencyRupeeOutlinedIcon sx={{ fontSize: "16px" }} />
                      </>
                    ),
                  },
                }}
              />
              <Autocomplete
                sx={{ width: 260 }}
                color="secondary"
                options={statusOptions}
                getOptionLabel={(option) => option?.label}
                value={
                  statusOptions.filter(
                    (status) => status.value === formData.status,
                  )[0]
                }
                onChange={(_, value) =>
                  setFormData({
                    ...formData,
                    status: value.value,
                  })
                }
                renderInput={(params) => (
                  <TextField
                    color="secondary"
                    {...params}
                    label="Status"
                    variant="outlined"
                  />
                )}
              />
              <Autocomplete
                sx={{ width: 320 }}
                color="secondary"
                options={hospitalOptions}
                getOptionLabel={(option) => option?.name}
                value={
                  hospitalOptions.filter(
                    (hospital) => hospital.value === formData.hospital_id,
                  )[0]
                }
                onChange={(_, value) =>
                  setFormData({
                    ...formData,
                    hospital_id: value.value,
                  })
                }
                renderInput={(params) => (
                  <TextField
                    color="secondary"
                    {...params}
                    label="Hospital Associated with"
                    variant="outlined"
                  />
                )}
              />
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ marginBottom: "20px", marginRight: "20px" }}>
        <Button
          autoFocus
          color="secondary"
          sx={{ minWidth: "90px" }}
          loading={isPending}
          {...(mode === "add" ? { startIcon: <AddIcon /> } : {})}
          onClick={() => updateDoctorHandler()}
          disabled={!!disabled}
        >
          {mode === "edit"
            ? "Save"
            : profile === "DOCTOR"
              ? "Add Doctor"
              : "Add Patient"}
        </Button>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="secondary"
          sx={{ width: "90px" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
