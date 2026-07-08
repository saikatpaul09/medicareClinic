import { Header } from "./components/Header";
import { HomePage, AdminDashBoardLayout, DoctorsList } from "./pages/";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, ProtectedRoute } from "./components";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { PatientList } from "./pages/admin-dashboard/PatientList";
import { AffiliatedHospitals } from "./pages/admin-dashboard/AffiliatedHospitals";
import { DashboardOverview } from "./pages/admin-dashboard/OverView";
import { DoctorSLots } from "./pages/admin-dashboard/DoctorSlots";
import { DoctorScheduleManager } from "./pages/admin-dashboard/DoctorScheduleManager";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/unauthorized"
              element={<h1>403 - Unauthorized Access</h1>}
            />
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <HomePage />
                </>
              }
            />
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/dashboard" element={<AdminDashBoardLayout />}>
                <Route
                  index={true}
                  path="/dashboard"
                  element={<DashboardOverview />}
                />
                <Route
                  path="/dashboard/doctors-list"
                  element={<DoctorsList />}
                />
                <Route
                  path="/dashboard/doctor-slots"
                  element={<DoctorSLots />}
                />
                <Route
                  path="/dashboard/doctor-slots/:doctorId"
                  element={<DoctorScheduleManager />}
                />
                <Route
                  path="/dashboard/patient-list"
                  element={<PatientList />}
                />
                <Route
                  path="/dashboard/hospital-list"
                  element={<AffiliatedHospitals />}
                />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/unauthorized" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
