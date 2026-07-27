import { HOSPITALS_API_ROUTE } from "../api/apiRoutes";
import { apiClient } from "../api/client";
import { useQuery } from "@tanstack/react-query";

export const useAllHospitalData = () => {
  return useQuery({
    queryKey: ["hospitalList"],
    queryFn: async () => {
      const response = await apiClient.post(HOSPITALS_API_ROUTE, {});
      return response.data;
    },
    staleTime: Infinity, // Keep data fresh
    gcTime: Infinity, // Keep data in memory
  });
};
