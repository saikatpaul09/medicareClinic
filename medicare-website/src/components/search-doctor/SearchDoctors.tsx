import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { Loader } from "../Loader";
import { apiClient } from "../../api/client";
import { DOCTORS_API_ROUTE } from "../../api/apiRoutes";
import { useQuery } from "@tanstack/react-query";
import { FetchProducts } from "./FetchProducts";
import useViewStore from "../../store/useViewStore";
import IconButton from "@mui/material/IconButton";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
export const SearchDoctors = () => {
  const [input, setInput] = useState("");
  const { isSearchView, setSearchView } = useViewStore((state) => state.view);
  const getAllDoctorsList = async () => {
    try {
      const result = await apiClient.post(DOCTORS_API_ROUTE, {
        filters: { name: input },
      });
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };
  const { data, isLoading } = useQuery({
    queryKey: ["doctorsList", input],
    queryFn: getAllDoctorsList,
  });

  return (
    <Box
      className="App"
      sx={{
        marginLeft: "26px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TextField
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for a doctor ..."
        value={input}
        onFocus={() => setSearchView(true)}
        slotProps={{
          input: {
            endAdornment: isSearchView && (
              <IconButton
                onClick={() => {
                  setInput("");
                  setSearchView(false);
                }}
              >
                <CloseOutlinedIcon />
              </IconButton>
            ),
            startAdornment: isLoading ? (
              <Loader />
            ) : (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          width: "100%",
          margin: "10px auto",
          "& .MuiOutlinedInput-root": {
            height: "40px",
            "& fieldset": {
              borderRadius: "40px", // Custom border radius here
            },
          },
        }}
      />
      {isSearchView && (
        <FetchProducts
          resetInput={() => setInput("")}
          searchString={input}
          data={data?.data?.doctors}
        />
      )}
    </Box>
  );
};
