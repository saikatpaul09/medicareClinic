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
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { HOSPITAL_API_ROUTE } from "../../api/apiRoutes.ts";
import { apiClientWithAuth } from "../../api/client";
import { indianStates } from "../../constants";

export const EditOrAddHospitalForm = ({
  mode,
  handleClose,
  open,
  hospitalData,
}: {
  mode: string | null;
  handleClose: () => void;
  open: boolean;
  hospitalData: {
    id: string;
    name: string;
    pin: string;
    address: string;
    state: string;
    contact_number: string;
  };
}) => {
  const [error, setError] = useState({
    name: "",
    state: "",
    address: "",
    pin: "",
    contact_number: "",
  });

  const [formData, setFormData] = useState({
    name: hospitalData?.name || "",
    state: hospitalData?.state || "",
    address: hospitalData?.address || "",
    contact_number: hospitalData?.contact_number || "",
    pin: hospitalData?.pin || "",
  });
  const disabled =
    !formData.name ||
    !formData.state ||
    !formData.address ||
    !formData.pin ||
    !formData.contact_number;
  const queryClient = useQueryClient();
  const { mutate: updateOrAddHospital, isPending } = useMutation({
    mutationKey: ["updateOrAddHospital"],
    mutationFn: async () => {
      const methodType = mode === "edit" ? "put" : "post";
      const response = await apiClientWithAuth[methodType](HOSPITAL_API_ROUTE, {
        ...(mode === "edit" && {
          hospitalId: hospitalData.id,
        }),
        name: formData?.name,
        address: formData?.address,
        state: formData?.state,
        pin: Number(formData?.pin),
        contactNumber: formData?.contact_number,
      });
      return response.data;
    },
    onSuccess: () => {
      alert(
        `${mode === "edit" ? "Hospital detail updated" : "New hospital added"} successfully`,
      );
      queryClient.invalidateQueries({
        queryKey: ["hospitalList"],
        exact: false,
      });
      handleClose();
    },
    onError: (error) => {
      alert(`Update Failed! Please refresh and try again. ${error.message}`);
    },
  });
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
        {mode === "edit" ? "Update Hospital" : "Add New Hospital"}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <TextField
            label="Hospital Name"
            required
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!error.name}
            sx={{ width: "235px" }}
            onBlur={() => {
              if (!formData.name) {
                setError({ ...error, name: "Hospital name is required." });
              } else {
                setError({
                  ...error,
                  name: "",
                });
              }
            }}
            color="secondary"
            value={formData?.name}
            onChange={(e) => {
              if (e.target.value && error.name) {
                setError({
                  ...error,
                  name: "",
                });
              }
              setFormData({ ...formData, name: e.target.value });
            }}
          />

          <TextField
            label="Address"
            required
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!error.address}
            sx={{ width: "235px" }}
            onBlur={() => {
              if (!formData.address) {
                setError({
                  ...error,
                  address: "Hospital address is required.",
                });
              } else {
                setError({
                  ...error,
                  address: "",
                });
              }
            }}
            color="secondary"
            value={formData?.address}
            onChange={(e) => {
              if (e.target.value && error.address) {
                setError({
                  ...error,
                  address: "",
                });
              }
              setFormData({ ...formData, address: e.target.value });
            }}
          />
          <TextField
            label="Pin Code"
            required
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            error={!!error.pin}
            sx={{ width: "235px" }}
            onBlur={() => {
              if (!formData.pin) {
                setError({ ...error, pin: "Hospital pin is required." });
              } else {
                setError({
                  ...error,
                  pin: "",
                });
              }
            }}
            color="secondary"
            value={formData?.pin}
            onChange={(e) => {
              if (e.target.value && error.pin) {
                setError({
                  ...error,
                  pin: "",
                });
              }
              setFormData({ ...formData, pin: e.target.value });
            }}
          />
          <TextField
            label="Contact"
            required
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!error.contact_number}
            sx={{ width: "235px" }}
            onBlur={() => {
              if (!formData.contact_number) {
                setError({
                  ...error,
                  contact_number: "contact number is required.",
                });
              } else {
                setError({
                  ...error,
                  contact_number: "",
                });
              }
            }}
            color="secondary"
            value={formData?.contact_number}
            onChange={(e) => {
              if (e.target.value && error.contact_number) {
                setError({
                  ...error,
                  contact_number: "",
                });
              }
              setFormData({ ...formData, contact_number: e.target.value });
            }}
          />
          <Autocomplete
            sx={{ width: 230, marginTop: "6px" }}
            color="secondary"
            options={indianStates}
            value={
              indianStates.filter((state) => state.value === formData.state)[0]
            }
            onChange={(_, value) =>
              setFormData({
                ...formData,
                state: value.value,
              })
            }
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label="Choose State"
                variant="outlined"
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ marginBottom: "20px", marginRight: "20px" }}>
        <Button
          autoFocus
          color="secondary"
          sx={{ minWidth: "90px" }}
          loading={isPending}
          {...(mode === "add" ? { startIcon: <AddIcon /> } : {})}
          onClick={() => updateOrAddHospital()}
          disabled={!!disabled}
        >
          {mode === "edit" ? "Save" : "Add Hospital"}
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
