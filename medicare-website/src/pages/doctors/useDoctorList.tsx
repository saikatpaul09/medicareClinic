import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { type DoctorFilters, type DoctorsResponse } from "./types";
import { DOCTORS_API_ROUTE } from "../../api/apiRoutes";

interface FetchDoctorsParams {
  pageParam?: string | null;
  filters: DoctorFilters;
}

const fetchDoctors = async ({
  pageParam,
  filters,
}: FetchDoctorsParams): Promise<DoctorsResponse> => {
  const response = await apiClient.get(DOCTORS_API_ROUTE, {
    params: {
      ...filters,
      nextCursor: pageParam,
    },
  });

  return response.data.data;
};

export const useDoctorsList = (filters: DoctorFilters) => {
  return useInfiniteQuery({
    queryKey: ["filtered-doctors", filters],

    queryFn: ({ pageParam }) =>
      fetchDoctors({
        pageParam,
        filters,
      }),

    initialPageParam: null as string | null,

    getNextPageParam: (lastPage: DoctorsResponse) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,

    staleTime: 60 * 1000,

    placeholderData: (previousData) => previousData,
  });
};
