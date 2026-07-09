import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SchoolIcon from "@mui/icons-material/School";
import ChatIcon from "@mui/icons-material/Chat";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import { apiClient } from "../../api/client";
import { DOCTOR_API_ROUTE, DOCTOR_API_SLOT_ROUTE } from "../../api/apiRoutes";
import { useAllHospitalData } from "../../hooks/useAllHospitalData";

// ---------- Types ----------
interface DoctorData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  gender: string;
  date_of_birth: string | null;
  hospital_id: string;
  specialization: string;
  consultation_fee: number;
  experience: number;
  thumbs_up: number;
  institution_name: string;
  description: string;
  degree_name: string;
  license_number: string | null;
  status: string;
}

interface DoctorSchedule {
  id: string;
  doctor_id: string;
  day_of_week: number; // 1 = Monday ... 7 = Sunday
  start_time: string; // "HH:MM:SS"
  end_time: string; // "HH:MM:SS"
  is_available: boolean;
}

interface DaySlot {
  date: Date;
  dayLabel: string; // "Fri"
  dayNumber: number; // 10
  dayOfWeek: number; // 1-7
}

interface SlotGroup {
  scheduleId: string;
  label: string;
  slots: string[];
}

const SLOT_INTERVAL_MINUTES = 25;
const VISIBLE_DAYS_COUNT = 7;
const TOTAL_DAYS_AHEAD = 21;

// ---------- Helpers ----------
const jsDayToDayOfWeek = (jsDay: number) => (jsDay === 0 ? 7 : jsDay);

const buildUpcomingDays = (count: number): DaySlot[] => {
  const days: DaySlot[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date,
      dayLabel: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: date.getDate(),
      dayOfWeek: jsDayToDayOfWeek(date.getDay()),
    });
  }
  return days;
};

const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const minutesToLabel = (totalMinutes: number) => {
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
};

const generateTimeSlots = (startTime: string, endTime: string) => {
  const slots: string[] = [];
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  for (let t = start; t < end; t += SLOT_INTERVAL_MINUTES) {
    slots.push(minutesToLabel(t));
  }
  return slots;
};

// ---------- API calls ----------
const fetchDoctorById = async (
  doctorId?: string,
): Promise<DoctorData | null> => {
  const result = await apiClient.get(`${DOCTOR_API_ROUTE}/${doctorId}`);
  return result.data.data.doctor;
};

// Adjust this path to match your actual schedules endpoint if it differs
const fetchDoctorSchedules = async (
  doctorId?: string,
): Promise<DoctorSchedule[]> => {
  const result = await apiClient.get(`${DOCTOR_API_SLOT_ROUTE}/${doctorId}`);
  return result.data.data.data;
};

export const DoctorBookAppointmentPage = () => {
  const { doctorId } = useParams();

  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { data: hospitalData } = useAllHospitalData();

  const { data: doctor, isLoading: isDoctorLoading } = useQuery({
    queryKey: ["doctorsById", doctorId],
    queryFn: () => fetchDoctorById(doctorId),
    enabled: Boolean(doctorId),
  });

  const { data: schedules, isLoading: isScheduleLoading } = useQuery({
    queryKey: ["doctorSchedules", doctorId],
    queryFn: () => fetchDoctorSchedules(doctorId),
    enabled: Boolean(doctorId),
  });

  const upcomingDays = useMemo(() => buildUpcomingDays(TOTAL_DAYS_AHEAD), []);

  // map day_of_week -> ALL available schedule blocks for that day
  // (a single day can have multiple blocks, e.g. a morning and an evening shift)
  const schedulesByDayOfWeek = useMemo(() => {
    const map = new Map<number, DoctorSchedule[]>();
    (schedules ?? []).forEach((s) => {
      if (!s.is_available) return;
      const existing = map.get(s.day_of_week) ?? [];
      existing.push(s);
      map.set(s.day_of_week, existing);
    });
    // keep each day's blocks ordered by start time
    map.forEach((daySchedules) =>
      daySchedules.sort(
        (a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time),
      ),
    );
    return map;
  }, [schedules]);

  const visibleDays = upcomingDays.slice(
    visibleStartIndex,
    visibleStartIndex + VISIBLE_DAYS_COUNT,
  );

  const selectedDay = upcomingDays[selectedDateIndex];
  const selectedDaySchedules = useMemo(() => {
    return selectedDay
      ? (schedulesByDayOfWeek.get(selectedDay.dayOfWeek) ?? [])
      : [];
  }, [schedulesByDayOfWeek, selectedDay]);

  // generate slots per schedule block independently, so gaps between
  // blocks (e.g. 12pm-4pm) aren't bridged into one continuous range
  const slotGroupsForSelectedDay: SlotGroup[] = useMemo(() => {
    return selectedDaySchedules.map((schedule) => ({
      scheduleId: schedule.id,
      label: `${minutesToLabel(timeToMinutes(schedule.start_time))} - ${minutesToLabel(
        timeToMinutes(schedule.end_time),
      )}`,
      slots: generateTimeSlots(schedule.start_time, schedule.end_time),
    }));
  }, [selectedDaySchedules]);

  const handlePrevDays = () => {
    setVisibleStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextDays = () => {
    setVisibleStartIndex((prev) =>
      Math.min(upcomingDays.length - VISIBLE_DAYS_COUNT, prev + 1),
    );
  };

  const handleSelectDate = (indexInUpcoming: number) => {
    setSelectedDateIndex(indexInUpcoming);
    setSelectedTime(null);
  };

  const handleScheduleAppointment = () => {
    if (!selectedDay || !selectedTime) return;
    // TODO: wire up booking mutation
    console.log("Booking", {
      doctorId,
      date: selectedDay.date,
      time: selectedTime,
    });
  };
  const fullName = doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : "";
  const hospitalName = hospitalData?.data?.hospitals?.find(
    (hospital) => hospital?.id === doctor?.hospital_id,
  );
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 3 } }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/doctors">
          Doctors
        </Link>
        <Link underline="hover" color="inherit" href="#">
          {doctor?.specialization.charAt(0).toUpperCase() +
            doctor?.specialization.slice(1).toLowerCase()}
        </Link>
        <Typography color="text.primary"></Typography>
      </Breadcrumbs>

      {/* Page layout via CSS grid on sx, no MUI <Grid> component */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "7fr 5fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Left: Doctor info card */}
        <Box>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              {isDoctorLoading ? (
                <DoctorInfoSkeleton />
              ) : (
                doctor && (
                  <Stack direction="row" spacing={2}>
                    <Avatar variant="rounded" sx={{ width: 120, height: 120 }}>
                      {doctor.firstName?.[0]}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {fullName}
                      </Typography>
                      <Typography color="primary" sx={{ fontWeight: 600 }}>
                        {doctor?.specialization}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 1 }}>
                        {doctor?.experience?.toString().replace(/\.00$/, "")}+
                        years experience
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center", mb: 0.5 }}
                      >
                        <SchoolIcon fontSize="small" color="action" />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {doctor.degree_name}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center", mb: 2 }}
                      >
                        <ChatIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          English, Hindi
                        </Typography>
                      </Stack>

                      <Card
                        variant="outlined"
                        sx={{ p: 2, borderRadius: 2, bgcolor: "grey.50" }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ alignItems: "center" }}
                        >
                          <LocationOnIcon color="action" fontSize="small" />
                          <Typography sx={{ fontWeight: 600 }}>
                            {hospitalName?.name}
                          </Typography>
                        </Stack>
                        <Button size="small" sx={{ mt: 1, pl: 0 }}>
                          Get Directions
                        </Button>
                      </Card>
                    </Box>
                  </Stack>
                )
              )}
            </CardContent>
          </Card>

          {/* Recommend banner */}
          <Card
            variant="outlined"
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: "#f3f1fb",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography color="primary" sx={{ fontWeight: 600 }}>
              Recommend this doctor?
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<ThumbDownOffAltIcon />}
                size="small"
              >
                No
              </Button>
              <Button
                variant="outlined"
                startIcon={<ThumbUpOffAltIcon />}
                size="small"
              >
                Yes
              </Button>
            </Stack>
          </Card>
        </Box>

        {/* Right: Booking card */}
        <Box>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack
                direction="row"
                spacing={0}
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Clinic Visit
                </Typography>
                {doctor && (
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    ₹{doctor.consultation_fee}
                  </Typography>
                )}
              </Stack>

              {/* Date scroller */}
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ alignItems: "center", mb: 2 }}
              >
                <IconButton
                  size="small"
                  onClick={handlePrevDays}
                  disabled={visibleStartIndex === 0}
                >
                  <ChevronLeftIcon />
                </IconButton>

                <Box
                  sx={{
                    flex: 1,
                    display: "grid",
                    gridTemplateColumns: `repeat(${VISIBLE_DAYS_COUNT}, 1fr)`,
                    gap: 1,
                  }}
                >
                  {isScheduleLoading
                    ? Array.from({ length: VISIBLE_DAYS_COUNT }).map((_, i) => (
                        <Skeleton key={i} variant="rounded" height={56} />
                      ))
                    : visibleDays.map((day) => {
                        const upcomingIndex = upcomingDays.indexOf(day);
                        const isSelected = upcomingIndex === selectedDateIndex;
                        const hasAvailability = schedulesByDayOfWeek.has(
                          day.dayOfWeek,
                        );
                        return (
                          <Button
                            key={upcomingIndex}
                            onClick={() => handleSelectDate(upcomingIndex)}
                            disabled={!hasAvailability}
                            variant={isSelected ? "outlined" : "text"}
                            sx={{
                              minWidth: 0,
                              flexDirection: "column",
                              borderRadius: 2,
                              borderColor: isSelected
                                ? "primary.main"
                                : "transparent",
                              bgcolor: isSelected
                                ? "primary.50"
                                : "transparent",
                              color: "text.primary",
                              opacity: hasAvailability ? 1 : 0.4,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600 }}
                            >
                              {day.dayLabel}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 700 }}
                            >
                              {day.dayNumber}
                            </Typography>
                          </Button>
                        );
                      })}
                </Box>

                <IconButton
                  size="small"
                  onClick={handleNextDays}
                  disabled={
                    visibleStartIndex >=
                    upcomingDays.length - VISIBLE_DAYS_COUNT
                  }
                >
                  <ChevronRightIcon />
                </IconButton>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              {/* Time slots, grouped by schedule block */}
              {isScheduleLoading ? (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 1,
                  }}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={40} />
                  ))}
                </Box>
              ) : slotGroupsForSelectedDay.length === 0 ? (
                <Typography
                  color="text.secondary"
                  sx={{ py: 2, textAlign: "center" }}
                >
                  No slots available for this day.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {slotGroupsForSelectedDay.map((group) => (
                    <Box key={group.scheduleId}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 600, mb: 1, display: "block" }}
                      >
                        {group.label}
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, 1fr)",
                          gap: 1,
                        }}
                      >
                        {group.slots.map((slot) => {
                          const isSelected = slot === selectedTime;
                          return (
                            <Button
                              key={`${group.scheduleId}-${slot}`}
                              fullWidth
                              size="small"
                              variant={isSelected ? "contained" : "outlined"}
                              onClick={() => setSelectedTime(slot)}
                              sx={{ borderRadius: 1.5, py: 1 }}
                            >
                              {slot}
                            </Button>
                          );
                        })}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, borderRadius: 2, py: 1.5 }}
                disabled={!selectedTime}
                onClick={handleScheduleAppointment}
              >
                Schedule Appointment
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

const DoctorInfoSkeleton = () => (
  <Stack direction="row" spacing={2}>
    <Skeleton variant="rounded" width={120} height={120} />
    <Box sx={{ flex: 1 }}>
      <Skeleton width="60%" height={32} />
      <Skeleton width="40%" />
      <Skeleton width="30%" />
      <Skeleton width="50%" sx={{ mt: 1 }} />
      <Skeleton width="90%" height={80} sx={{ mt: 2 }} />
    </Box>
  </Stack>
);
