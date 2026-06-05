import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import { FetchProducts } from "./FetchProducts";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

export const AutocompleteSearchBar = ({
  list,
  onChange,
}: {
  list: {
    id: number;
    name: string;
    designation: string;
  }[];
  onChange: (value: string) => void;
}) => {
  const [input, setInput] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value.toLowerCase());
    onChange(e.target.value);
  };

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
        onChange={handleInput}
        placeholder="Search for a doctor ..."
        slotProps={{
          input: {
            startAdornment: (
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
      {input && <FetchProducts searchstring={input} list={list} />}
    </Box>
  );
};
