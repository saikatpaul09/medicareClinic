import { GET_ALL_HOSPITALS } from "../api/query";
import { apiClient } from "../api/client";
import { useQuery } from "@tanstack/react-query";

export const useAllHospitalData = () => {
  return useQuery({
    queryKey: ["hospitalList"],
    queryFn: async () => {
      const response = await apiClient.post(GET_ALL_HOSPITALS, {});
      return response.data;
    },
    staleTime: Infinity, // Keep data fresh
    gcTime: Infinity, // Keep data in memory
  });
};
