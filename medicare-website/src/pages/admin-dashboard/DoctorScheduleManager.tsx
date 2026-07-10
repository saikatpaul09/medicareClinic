import { useState } from "react";
import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Button } from "../../components";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { DOCTOR_API_SLOT_ROUTE } from "../../api/apiRoutes";
import { apiClientWithAuth } from "../../api/client";

const DAYS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

export const DoctorScheduleManager = () => {
  const { doctorId } = useParams();
  const queryClient = useQueryClient();
  const [editedSchedules, setEditedSchedules] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fetchSchedules = async () => {
    try {
      const result = await apiClientWithAuth.get(
        `${DOCTOR_API_SLOT_ROUTE}/${doctorId}`,
      );
      if (result) {
        setEditedSchedules(result.data?.data?.data);
      }
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateSchedules = async ({ schedules }) => {
    try {
      const result = await apiClientWithAuth.put(
        `${DOCTOR_API_SLOT_ROUTE}/${doctorId}`,
        {
          schedules: schedules,
        },
      );

      return result.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { isLoading, isError } = useQuery({
    queryKey: ["doctor-schedules", doctorId],
    queryFn: fetchSchedules,
    enabled: !!doctorId,
  });

  const updateMutation = useMutation({
    mutationFn: updateSchedules,
    onSuccess: () => {
      setSaveSuccess(true);
      alert(`Slot scheduled successfully`);
      queryClient.invalidateQueries({
        queryKey: ["doctor-schedules", doctorId],
      });
    },
    onError: (error) => {
      alert(
        `Slot Update Failed! Please refresh and try again. ${error.message}`,
      );
    },
  });

  const addSlot = (dayOfWeek: number) => {
    setEditedSchedules((prev) => [
      ...prev,
      {
        day_of_week: dayOfWeek,
        start_time: "09:00",
        end_time: "10:00",
        is_available: true,
      },
    ]);
  };

  const updateSlot = (index, field, value) => {
    setEditedSchedules((prev) => {
      const copy = [...prev];

      copy[index] = {
        ...copy[index],
        [field]: value,
      };

      return copy;
    });
  };

  const removeSlot = (index) => {
    setEditedSchedules((prev) => prev?.filter((_, i) => i !== index));
  };

  const groupedSchedules = DAYS.map((day) => ({
    ...day,
    schedules:
      editedSchedules?.length > 0
        ? editedSchedules?.filter((slot) => slot.day_of_week === day.value)
        : [],
  }));

  if (isLoading) {
    return (
      <Stack
        sx={{ alignItems: "center", justifyContent: "center", paddingY: 6 }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  if (isError) {
    return <Alert severity="error">Failed to load schedules.</Alert>;
  }

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2,
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h5">Doctor Schedule</Typography>
        {saveSuccess && (
          <Alert severity="success">Schedule updated successfully.</Alert>
        )}
        {groupedSchedules.map((day) => (
          <Paper key={day.value} variant="outlined" sx={{ p: 2 }}>
            <Stack
              sx={{
                direction: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <Typography variant="h6">{day.label}</Typography>

              <Button
                startIcon={<AddIcon />}
                color="secondary"
                onClick={() => addSlot(day.value)}
              >
                Add Slot
              </Button>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              {day.schedules.length === 0 && (
                <Typography color="text.secondary">
                  No slots configured.
                </Typography>
              )}

              {day.schedules.map((slot) => {
                const actualIndex = editedSchedules.findIndex(
                  (s) => s === slot,
                );

                return (
                  <Grid
                    container
                    spacing={2}
                    key={slot.id ?? `${day.value}-${actualIndex}`}
                  >
                    <Grid
                      size={{
                        xs: 12,
                        md: 5,
                      }}
                    >
                      <TextField
                        fullWidth
                        type="time"
                        label="Start Time"
                        value={slot.start_time}
                        slotProps={{
                          inputLabel: { shrink: true },
                        }}
                        onChange={(e) =>
                          updateSlot(actualIndex, "start_time", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid
                      size={{
                        xs: 12,
                        md: 5,
                      }}
                    >
                      <TextField
                        fullWidth
                        type="time"
                        label="End Time"
                        value={slot.end_time}
                        slotProps={{
                          inputLabel: { shrink: true },
                        }}
                        onChange={(e) =>
                          updateSlot(actualIndex, "end_time", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid
                      size={{
                        xs: 12,
                        md: 2,
                      }}
                    >
                      <IconButton
                        color="error"
                        onClick={() => removeSlot(actualIndex)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                );
              })}
            </Stack>
          </Paper>
        ))}

        <Stack
          sx={{ direction: "row", justifyContent: "flex-end", width: "160px" }}
        >
          <Button
            variant="contained"
            color="secondary"
            disabled={updateMutation.isPending}
            onClick={() =>
              updateMutation.mutate({
                schedules: editedSchedules,
              })
            }
          >
            {updateMutation.isPending ? "Saving..." : "Save Schedule"}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};
