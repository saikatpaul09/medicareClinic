import { Header } from "./components/Header";
import { HomePage, AdminDashBoardLayout, DoctorsList } from "./pages/";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, ProtectedRoute } from "./components";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
const queryClient = new QueryClient();

function App() {
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
                  path="/dashboard/doctors-list"
                  element={<DoctorsList />}
                />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/unauthorized" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
