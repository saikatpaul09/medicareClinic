import logo from "../assets/medicare_icon.png";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { AutocompleteSearchBar } from "./auto-complete/AutoComplete";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import theme from "../theme";
import { Button } from "./button/Button";
import useAuthStore from "../store";
import { SideBar } from "./SideBar";
import { roles } from "../constants";
import type { SideBarRole } from "../types";

export const Header = () => {
  const sideBarRole = useAuthStore((state) => state.login.sideBarRole);
  const openPopup = useAuthStore((state) => state.login.openPopup);
  const userInfo = useAuthStore((state) => state.login.userInfo);

  return (
    <header style={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
      <Box
        sx={{
          marginTop: "8px",
        }}
      >
        <Grid container>
          <Grid size={{ sm: 1 }}>
            <img src={logo} width={90} height={90} alt="Medicare Logo" />
          </Grid>
          <Grid size={{ xs: 3, sm: 3 }} sx={{ marginTop: "20px" }}>
            <FormControl
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
            </FormControl>
          </Grid>
          <Grid size={{ md: 6, xs: 6, sm: 5 }}>
            <Box sx={{ width: "80%", marginTop: "20px" }}>
              <AutocompleteSearchBar
                list={[
                  {
                    id: 1,
                    name: "Dr. John Doe",
                    designation: "Cardiologist",
                  },
                  {
                    id: 2,
                    name: "Dr. Neu Doe",
                    designation: "Cardiologist",
                  },
                ]}
                onChange={(e) => console.log(e)}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 2, sm: 2 }}>
            <Button
              variant={userInfo ? "text" : "contained"}
              color="primary"
              onClick={() =>
                openPopup(
                  userInfo
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
                width: "120px",
              }}
            >
              {userInfo ? (
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
  );
};
