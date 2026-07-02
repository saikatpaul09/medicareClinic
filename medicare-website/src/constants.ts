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
import { ForgotPassword, Login, SignUp, MyAccount } from "./components";

export const carouselItems = [
  { src: carousel3, alt: "Carousel Image 3" },
  { src: carousel2, alt: "Carousel Image 2" },
  { src: carousel1, alt: "Carousel Image 1" },
];

export const specialties = [
  { name: "Cardiology", value: "CARDIOLOGY", icon: FavoriteBorderOutlinedIcon },
  { name: "Dermatology", value: "DERMATOLOGY", icon: Face3OutlinedIcon },
  { name: "Obstetrics", value: "OBSTETRICS", icon: GirlIcon },
  { name: "Pediatrics", value: "PEDIATRICS", icon: ChildFriendlyIcon },
  { name: "Psychiatry", value: "PSYCHIATRY", icon: PsychologyIcon },
  { name: "Radiology", value: "RADIOLOGY", icon: LocalHospitalIcon },
  { name: "Surgery", value: "SURGERY", icon: AirlineSeatFlatIcon },
  { name: "Urology", value: "UROLOGY", icon: AirlineSeatFlatIcon },
  { name: "Neurology", value: "NEUROLOGY", icon: VaccinesIcon },
  { name: "Orthopedics", value: "ORTHOPEDICS", icon: LocalPharmacyIcon },
  { name: "General Practice", value: "GENERAL_PRACTICE", icon: BloodtypeIcon },
];
export const specialtiesList = specialties.map((specialty) => {
  return {
    label: specialty.name,
    value: specialty.value,
  };
});

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
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
