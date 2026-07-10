import logo from "../assets/medicare_icon.png";
import Box from "@mui/material/Box";
//import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import Select from "@mui/material/Select";
import { SearchDoctors } from "./search-doctor/SearchDoctors";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import theme from "../theme";
import { Button } from "./button/Button";
import useAuthStore from "../store";
import { SideBar } from "./SideBar";
import { roles } from "../constants";
import type { SideBarRole } from "../types";
import useViewStore from "../store/useViewStore";
import { Outlet } from "react-router";

export const Header = () => {
  const sideBarRole = useAuthStore((state) => state.login.sideBarRole);
  const openPopup = useAuthStore((state) => state.login.openPopup);
  const userInfo = useAuthStore((state) => state.login.userInfo);
  const isSearchView = useViewStore((state) => state.view.isSearchView);
  const role = useAuthStore((state) => state.login.role);

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "#fff",
          borderBottom: !isSearchView
            ? `1px solid ${theme.palette.divider}`
            : "none",
          boxShadow: "0 2px 10px 0 rgba(0, 0, 0, .1)",
        }}
      >
        <Box
          sx={{
            marginTop: "8px",
            maxWidth: "100%",
          }}
        >
          <Grid container>
            <Grid size={{ sm: 1 }}>
              <img src={logo} width={90} height={90} alt="Medicare Logo" />
            </Grid>
            <Grid size={{ xs: 2.5, sm: 2.5 }} sx={{ marginTop: "20px" }}>
              {/* <FormControl
              fullWidth
              variant="standard"
              sx={{ width: "80%", maxWidth: "220px" }}
            >
              <InputLabel id="demo-simple-select-label">
                Select Location
              </InputLabel>
              <Select
                labelId="select-location"
                id="select-location"
                value={location}
                label="Location"
                // onChange={handleChange}
              >
                <MenuItem value={10}>Ten</MenuItem>
              </Select>
            </FormControl> */}
            </Grid>
            <Grid size={{ md: 6, xs: 6, sm: 5 }}>
              <Box sx={{ width: "80%", marginTop: "20px" }}>
                <SearchDoctors />
              </Box>
            </Grid>
            <Grid size={{ xs: 2, sm: 2 }}>
              <Button
                variant={userInfo && role === "PATIENT" ? "text" : "contained"}
                color="primary"
                onClick={() =>
                  openPopup(
                    userInfo && role === "PATIENT"
                      ? (roles.PROFILE as SideBarRole)
                      : (roles.LOGIN as SideBarRole),
                  )
                }
                sx={{
                  marginTop: "30px",
                  marginLeft: "60px",
                  display: "flex",
                  gap: "4px",
                  alignItems: "center",
                  height: "40px",
                  width: "100px",
                }}
              >
                {userInfo && role === "PATIENT" ? (
                  <>
                    <AccountCircleRoundedIcon
                      sx={{ width: "40px", height: "40px" }}
                    />
                  </>
                ) : (
                  <>
                    <PermIdentityIcon />
                    Login
                  </>
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
        {sideBarRole && <SideBar role={sideBarRole} />}
      </header>
      {!isSearchView && <Outlet />}
    </>
  );
};
