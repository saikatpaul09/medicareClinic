import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const Section = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Box sx={{ padding: "20px", textAlign: "center" }}>
      <Typography variant="h4">{title}</Typography>
      <Typography variant="body1">{description}</Typography>
    </Box>
  );
};
