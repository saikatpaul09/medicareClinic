import { useMemo, useRef } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DoctorCard from "./DoctorCard";
import DoctorsFilters from "./DoctorsFilter";
import { useDoctorsList } from "./useDoctorList";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { useAllHospitalData } from "../../hooks/useAllHospitalData";
import { getHospitalOptions } from "../../constants";
import { useDoctorFilters } from "../../hooks/useDoctorFilters";
import type { DoctorFilters } from "./types";
export const DoctorsListPage = () => {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { filters, updateFilter, clearFilter, clearAllFilters } =
    useDoctorFilters();

  const { data: hospitalData } = useAllHospitalData();

  const hospitalOptions = useMemo(
    () =>
      getHospitalOptions({
        hospitals: hospitalData?.data?.hospitals || [],
      }),
    [hospitalData],
  );

  const activeFilters = Object.entries(filters).filter(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, value]) => value !== "",
  );
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
    error,
  } = useDoctorsList(filters);

  useInfiniteScroll(loadMoreRef, fetchNextPage, hasNextPage);
  const doctors = data?.pages?.flatMap((page) => page.doctors) ?? [];
  const totalCount = data?.pages?.[0]?.totalCount ?? 0;
  if (isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">
          {(error as Error)?.message || "Failed to fetch doctors"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <Grid container spacing={3}>
        {/* Filters Sidebar */}

        <Grid
          size={{
            xs: 12,
            md: 3,
          }}
        >
          <Paper
            elevation={1}
            sx={{
              p: 2,
              position: "sticky",
              top: 24,
              borderRadius: 3,
              maxHeight: "calc(100vh - 180px)",
              overflowY: "scroll",
            }}
          >
            <DoctorsFilters
              filters={filters}
              updateFilter={updateFilter}
              clearAllFilters={clearAllFilters}
              hospitalOptions={hospitalOptions}
            />
          </Paper>
        </Grid>

        {/* Doctors List */}

        <Grid
          size={{
            xs: 12,
            md: 9,
          }}
        >
          <Stack spacing={3}>
            {/* Header */}

            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Doctors
              </Typography>

              <Typography variant="body1" color="text.secondary">
                {totalCount} doctors found
              </Typography>
            </Box>

            {/* Active Filters */}

            {activeFilters.length > 0 && (
              <Stack
                direction="row"
                sx={{ spacing: 1, gap: 2, flexWrap: "wrap" }}
              >
                {activeFilters.map(([key, value]) => (
                  <Chip
                    key={key}
                    label={
                      key === "hospital_id"
                        ? hospitalData?.data?.hospitals?.find(
                            (hospital) => hospital.id === value,
                          )?.name
                        : String(value)
                    }
                    onDelete={() => clearFilter(key as keyof DoctorFilters)}
                  />
                ))}

                <Chip
                  color="primary"
                  variant="outlined"
                  label="Clear All"
                  onClick={clearAllFilters}
                />
              </Stack>
            )}

            {/* Loading */}

            {isLoading && (
              <Box sx={{ spacing: 1, gap: 2, flexWrap: "wrap" }}>
                <CircularProgress />
              </Box>
            )}

            {/* Empty State */}

            {!isLoading && doctors.length === 0 && (
              <Paper
                sx={{
                  p: 6,
                  textAlign: "center",
                  borderRadius: 3,
                }}
              >
                <Typography variant="h6">No doctors found</Typography>

                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Try changing the filters.
                </Typography>
              </Paper>
            )}

            {/* Doctor Cards */}

            {!isLoading &&
              doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}

            {/* Infinite Scroll Loader */}

            {isFetchingNextPage && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress />
              </Box>
            )}

            {/* Intersection Observer Target */}

            <Box
              ref={loadMoreRef}
              sx={{
                height: 20,
              }}
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};
