import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useAllHospitalData } from "../../hooks/useAllHospitalData";
import theme from "../../theme";
import { useNavigate } from "react-router";
import useViewStore from "../../store/useViewStore";

export const FetchProducts = ({
  searchString,
  data,
  resetInput,
}: {
  searchString: string;
  data: {
    id: number;
    firstName: string;
    lastName: string;
    specialization: string;
    hospital_id: string;
    experience: number;
    degree: string;
  }[];
  resetInput: () => void;
}) => {
  const { data: hospitalData } = useAllHospitalData();
  const navigate = useNavigate();
  const { setSearchView } = useViewStore((state) => state.view);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        left: 0,
        justifyContent: "center",
        position: "absolute",
        marginTop: "80px",
      }}
    >
      <Stack
        spacing={2}
        sx={{
          overflow: "auto",
          width: "550px",
          maxHeight: "380px",
          overflowY: "auto",
          scrollbarWidth: "none",
          scrollbarGutter: "stable",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "transparent",
            borderRadius: "4px",
          },
          "&:hover": {
            scrollbarWidth: "thin", // Firefox reveal
            "&::-webkit-scrollbar-thumb": {
              background: theme.palette.primary.light,
            },
          },
        }}
      >
        <Box sx={{ width: "545px" }}>
          {searchString &&
            data?.map((item) => {
              const hospitalObj = hospitalData?.data?.hospitals?.find(
                (hospital) => hospital.id === item.hospital_id,
              );
              const navigateString = `/doctor/Dr-${item.firstName}-${item.lastName}/${item.id}`;
              return (
                <Paper
                  key={item.id}
                  sx={{
                    textAlign: "left",
                    cursor: "pointer",
                    padding: "8px 16px",
                  }}
                  onClick={() => {
                    setSearchView(false);
                    navigate(navigateString);
                    resetInput();
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={6}
                    sx={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ flex: 1, alignItems: "center" }}
                    >
                      <Avatar
                        // src={item.profileImage}
                        alt={`${item.firstName} ${item.lastName}`}
                        sx={{
                          width: 52,
                          height: 52,
                          background: theme.palette.primary.light,
                        }}
                      >
                        {`${item.firstName?.[0]}${item.lastName?.[0]}`}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            lineHeight: 1.2,
                            fontWeight: 700,
                          }}
                        >
                          Dr. {item.firstName} {item.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {`${item?.experience?.toString().replace(/\.00$/, "")} years,${" "} 
                          ${
                            item?.specialization?.toLocaleLowerCase() ||
                            "General Physician"
                          }`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {hospitalObj?.name}
                        </Typography>
                      </Box>
                    </Stack>
                    <Chip
                      label="Doctor"
                      size="small"
                      color="primary"
                      sx={{
                        background: theme.palette.primary.light,
                        borderRadius: "20px",
                      }}
                    />
                  </Stack>
                </Paper>
              );
            })}
        </Box>
      </Stack>
    </Box>
  );
};
