import carousel1 from "./assets/carousel_1.png";
import carousel2 from "./assets/carousel_2.png";
import carousel3 from "./assets/carousel_3.png";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Face3OutlinedIcon from "@mui/icons-material/Face3Outlined";
import GirlIcon from "@mui/icons-material/Girl";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import PsychologyIcon from "@mui/icons-material/Psychology";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AirlineSeatFlatIcon from "@mui/icons-material/AirlineSeatFlat";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import { ForgotPassword, Login, SignUp, MyAccount } from "./components/index";

export const carouselItems = [
  { src: carousel3, alt: "Carousel Image 3" },
  { src: carousel2, alt: "Carousel Image 2" },
  { src: carousel1, alt: "Carousel Image 1" },
];

export const specialties = [
  { name: "Cardiology", icon: FavoriteBorderOutlinedIcon },
  { name: "Dermatology", icon: Face3OutlinedIcon },
  { name: "Obstetrics", icon: GirlIcon },
  { name: "Pediatrics", icon: ChildFriendlyIcon },
  { name: "Psychiatry", icon: PsychologyIcon },
  { name: "Radiology", icon: LocalHospitalIcon },
  { name: "Surgery", icon: AirlineSeatFlatIcon },
  { name: "Urology", icon: AirlineSeatFlatIcon },
  { name: "Neurology", icon: VaccinesIcon },
  { name: "Orthopedics", icon: LocalPharmacyIcon },
  { name: "General Practice", icon: BloodtypeIcon },
];

export const roles = {
  LOGIN: "LOGIN",
  SIGNUP: "SIGNUP",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
  PROFILE: "PROFILE",
};

export const sideBarContent = {
  LOGIN: { id: roles.LOGIN, title: "Sign In", component: Login },
  SIGNUP: { id: roles.SIGNUP, title: "Create Account", component: SignUp },
  FORGOT_PASSWORD: {
    id: roles.FORGOT_PASSWORD,
    title: "Reset Password",
    component: ForgotPassword,
  },
  PROFILE: {
    id: roles.PROFILE,
    title: "My Account",
    component: MyAccount,
  },
};
