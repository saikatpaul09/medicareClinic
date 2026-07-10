import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

export const Loader = () => {
  return (
    <Backdrop open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
