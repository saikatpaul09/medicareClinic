import { useEffect, useState } from "react";
import useAuthStore from "../store";
import { apiClientWithAuth } from "../api/client";
import { REFRESH_TOKEN } from "../api/mutations";
import { Loader } from "./Loader";
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUserInfo, clearUserInfo } = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await apiClientWithAuth.post(REFRESH_TOKEN);
        if (response) {
          setUserInfo(response.data.data);
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        clearUserInfo();
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, [setUserInfo, clearUserInfo]);

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
};
