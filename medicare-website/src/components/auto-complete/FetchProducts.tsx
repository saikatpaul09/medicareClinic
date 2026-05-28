import { Stack } from "@mui/system";
import { Paper, Box, Typography } from "@mui/material";

export const FetchProducts = ({
  searchstring,
  list,
}: {
  searchstring: string;
  list: {
    id: number;
    name: string;
    designation: string;
  }[];
}) => {
  // Create a new array, filteredList, using the array filter function to filter the dummy data based on input.
  const filteredList = list.filter((element) => {
    if (searchstring === "") {
      return element;
    } else {
      return element.name.toLowerCase().includes(searchstring);
    }
  });

  // Display the filtered product list.
  return (
    <Box>
      <Stack
        spacing={2}
        sx={{
          overflow: "auto",
          maxHeight: 500,
        }}
      >
        {filteredList.map((item) => (
          <Paper
            key={item.id}
            sx={{
              textAlign: "left",
            }}
          >
            <Typography>{item.name}</Typography>
            <Typography>{item.designation}</Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};
