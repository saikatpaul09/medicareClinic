import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { type DoctorFilters } from "../pages/doctors/types";

export const useDoctorFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: DoctorFilters = useMemo(
    () => ({
      specialization: searchParams.get("specialization") || "",

      hospital_id: searchParams.get("hospital_id") || "",

      gender: searchParams.get("gender") || "",

      consultation_fee: searchParams.get("consultation_fee") || "",

      experience: searchParams.get("experience")
        ? Number(searchParams.get("experience"))
        : "",
    }),
    [searchParams],
  );

  const updateFilter = (key: keyof DoctorFilters, value: string | number) => {
    const params = new URLSearchParams(searchParams);

    const currentValue = searchParams.get(key);

    if (String(currentValue) === String(value)) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }

    setSearchParams(params);
  };

  const clearFilter = (key: keyof DoctorFilters) => {
    const params = new URLSearchParams(searchParams);

    params.delete(key);

    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  return {
    filters,
    updateFilter,
    clearFilter,
    clearAllFilters,
  };
};
