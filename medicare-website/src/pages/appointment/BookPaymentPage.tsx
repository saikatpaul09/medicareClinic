import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import { apiClientWithAuth } from "../../api/client";
import {
  GET_PAYMENT_INTENT_ID,
  CONFIRM_BOOKING_API_ROUTE,
} from "../../api/apiRoutes";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Radio from "@mui/material/Radio";
import CircularProgress from "@mui/material/CircularProgress";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentsIcon from "@mui/icons-material/Payments";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import Alert from "@mui/material/Alert";

// ---------- Types ----------
interface BookPaymentState {
  doctorId: string;
  doctorName: string;
  specialization: string;
  hospitalName?: string;
  appointmentDate: string | Date;
  appointmentTime: string;
  fee: number;
  patientId: string;
}

type PaymentMethodId = "upi" | "card" | "netbanking" | "cash";

interface PaymentMethodOption {
  id: PaymentMethodId;
  label: string;
  subLabel: string;
  icon: React.ReactNode;
}

const PLATFORM_FEE = 15;

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "upi",
    label: "UPI",
    subLabel: "Google Pay, PhonePe, Paytm & more",
    icon: <QrCode2Icon color="action" />,
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    subLabel: "Visa, Mastercard, RuPay",
    icon: <CreditCardIcon color="action" />,
  },
  {
    id: "netbanking",
    label: "Net Banking",
    subLabel: "All major banks supported",
    icon: <AccountBalanceIcon color="action" />,
  },
  {
    id: "cash",
    label: "Pay at Clinic",
    subLabel: "Pay in person at the time of visit",
    icon: <PaymentsIcon color="action" />,
  },
];

// ---------- API types ----------
interface CreatePaymentIntentPayload {
  amount: number; // in the smallest currency unit (paise), matches Stripe-style APIs
  doctorId: string;
  patientId: string;
}

interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

interface ConfirmBookingPayload {
  paymentIntentId: string;
  doctorId: string;
  patientId: string;
  appointmentDatetime: string; // ISO string
  paymentMethod: PaymentMethodId;
  amount: number; // in paise, matches transactions.amount / 100 on the backend
}

interface ConfirmBookingResponse {
  appointmentId: string;
  transactionId?: string;
  alreadyProcessed?: boolean;
}

// ---------- API calls ----------
const createPaymentIntent = async (
  payload: CreatePaymentIntentPayload,
): Promise<CreatePaymentIntentResponse> => {
  const result = await apiClientWithAuth.post(GET_PAYMENT_INTENT_ID, payload);
  return result.data.data;
};

const confirmBooking = async (
  payload: ConfirmBookingPayload,
): Promise<ConfirmBookingResponse> => {
  const result = await apiClientWithAuth.post(
    CONFIRM_BOOKING_API_ROUTE,
    payload,
  );
  return result.data.data;
};

// ---------- Helpers ----------
const formatAppointmentDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Combines the selected day ("appointmentDate") with the picked slot label
// ("09:25 AM") into a single ISO datetime string for the backend.
const buildAppointmentDatetimeISO = (
  date: string | Date,
  timeLabel: string,
) => {
  const match = timeLabel.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  const base = new Date(date);
  if (!match) return base.toISOString();

  const [, hoursStr, minutesStr, period] = match;
  let hours = Number(hoursStr) % 12;
  if (period.toUpperCase() === "PM") hours += 12;

  base.setHours(hours, Number(minutesStr), 0, 0);
  return base.toISOString();
};

export const BookPaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const bookingDetails = state as BookPaymentState | null;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId | null>(
    null,
  );
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const consultationFee = bookingDetails?.fee ?? 0;
  const totalPayable = useMemo(
    () => consultationFee + PLATFORM_FEE,
    [consultationFee],
  );

  const createPaymentIntentMutation = useMutation({
    mutationFn: createPaymentIntent,
    onSuccess: () => {
      alert("Appointment Scheduled");
    },
  });

  const confirmBookingMutation = useMutation({
    mutationFn: confirmBooking,
  });

  const isProcessing =
    createPaymentIntentMutation.isPending || confirmBookingMutation.isPending;

  const handlePayNow = async () => {
    if (!selectedMethod || !bookingDetails) return;
    setPaymentError(null);

    try {
      // 1. Create a payment intent (in a real Stripe integration you'd then
      // confirm the clientSecret client-side with Stripe Elements before
      // moving on; this fake service returns immediately).
      const { paymentIntentId } = await createPaymentIntentMutation.mutateAsync(
        {
          amount: totalPayable * 100,
          doctorId: bookingDetails.doctorId,
          patientId: bookingDetails.patientId,
        },
      );

      // 2. Persist the appointment + transaction atomically on the backend.
      const appointmentDatetime = buildAppointmentDatetimeISO(
        bookingDetails.appointmentDate,
        bookingDetails.appointmentTime,
      );
      const confirmBooking = await confirmBookingMutation.mutateAsync({
        paymentIntentId,
        doctorId: bookingDetails.doctorId,
        patientId: bookingDetails.patientId,
        appointmentDatetime,
        paymentMethod: selectedMethod,
        amount: totalPayable * 100,
      });
      if (confirmBooking) {
        navigate("/my-appointments");
      }
    } catch (err) {
      console.log(err);
      setPaymentError(
        "We couldn't process your payment. Please try again, and avoid refreshing the page.",
      );
    }
  };

  // Guard against direct navigation without booking context
  if (!bookingDetails) {
    return (
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          p: { xs: 2, md: 3 },
          textAlign: "center",
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          No appointment selected
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Please pick a doctor and a time slot before proceeding to payment.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/doctors")}>
          Browse Doctors
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 3 } }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/doctors">
          Doctors
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href={`/doctor/${bookingDetails.doctorName
            .replace(/\./g, "") // remove dots
            .trim()
            .replace(/\s+/g, "-")}/${bookingDetails.doctorId}`}
        >
          {bookingDetails.doctorName}
        </Link>
        <Typography color="text.primary">Payment</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "7fr 5fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Left: Booking summary */}
        <Box>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Appointment Summary
              </Typography>

              <Stack direction="row" spacing={2}>
                <Avatar variant="rounded" sx={{ width: 72, height: 72 }}>
                  {bookingDetails.doctorName?.replace("Dr. ", "")?.[0]}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {bookingDetails.doctorName}
                  </Typography>
                  <Typography color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                    {bookingDetails.specialization}
                  </Typography>

                  {bookingDetails.hospitalName && (
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center", mb: 0.5 }}
                    >
                      <LocationOnIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {bookingDetails.hospitalName}
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <CalendarMonthIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {formatAppointmentDate(bookingDetails.appointmentDate)}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <AccessTimeIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {bookingDetails.appointmentTime}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Trust banner */}
          <Card
            variant="outlined"
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: "#f3f1fb",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <VerifiedUserIcon color="primary" />
            <Typography variant="body2" color="text.secondary">
              Your payment is secure and encrypted. You can reschedule or cancel
              up to 2 hours before your appointment.
            </Typography>
          </Card>
        </Box>

        {/* Right: Payment card */}
        <Box>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Payment Details
              </Typography>

              <Stack spacing={1} sx={{ mb: 2 }}>
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography color="text.secondary">
                    Consultation Fee
                  </Typography>
                  <Typography>₹{consultationFee}</Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Platform Fee</Typography>
                  <Typography>₹{PLATFORM_FEE}</Typography>
                </Stack>
                <Divider sx={{ my: 0.5 }} />
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    Total Payable
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>
                    ₹{totalPayable}
                  </Typography>
                </Stack>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Select Payment Method
              </Typography>

              <Stack spacing={1}>
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selectedMethod === method.id;
                  return (
                    <Card
                      key={method.id}
                      variant="outlined"
                      onClick={() => setSelectedMethod(method.id)}
                      sx={{
                        p: 1.25,
                        borderRadius: 2,
                        cursor: "pointer",
                        borderColor: isSelected ? "primary.main" : "divider",
                        bgcolor: isSelected ? "primary.50" : "transparent",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{ alignItems: "center" }}
                      >
                        <Radio
                          checked={isSelected}
                          size="small"
                          sx={{ p: 0 }}
                        />
                        {method.icon}
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 600 }}>
                            {method.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {method.subLabel}
                          </Typography>
                        </Box>
                      </Stack>
                    </Card>
                  );
                })}
              </Stack>

              {paymentError && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                  {paymentError}
                </Alert>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, borderRadius: 2, py: 1.5 }}
                disabled={!selectedMethod || isProcessing}
                onClick={handlePayNow}
              >
                {isProcessing ? (
                  <CircularProgress size={22} sx={{ color: "white" }} />
                ) : (
                  `Pay ₹${totalPayable}`
                )}
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};
