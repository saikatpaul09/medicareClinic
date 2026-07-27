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

export const consultaionFees = [
  { label: "500-1000", min: 500, max: 1000 },
  {
    label: "1000-1500",
    min: 100,
    max: 1500,
  },
  { label: "+1500", min: 1500 },
];
export const experienceOptions = [
  {
    label: +5,
    value: 5,
  },
  {
    label: +10,
    value: 10,
  },
  {
    label: +15,
    value: 15,
  },
];

export const genderOptions = [
  {
    label: "Male",
    value: "MALE",
  },
  {
    label: "Female",
    value: "FEMALE",
  },
  {
    label: "Others",
    value: "OTHERS",
  },
];
export const getHospitalOptions = ({
  hospitals,
}: {
  hospitals: { name: string; id: string }[];
}) => {
  if (!hospitals) {
    return [];
  }
  return hospitals.map((hospital) => {
    return {
      name: hospital.name,
      value: hospital.id,
    };
  });
};
export const statuses = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  ON_LEAVE: "ON_LEAVE",
};
export const statusOptions = Object.keys(statuses).map((key) => ({
  label: key
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase()),
  value: statuses[key],
}));
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
export const indianStates = [
  { label: "Andhra Pradesh", value: "ANDHRA_PRADESH" },
  { label: "Arunachal Pradesh", value: "ARUNACHAL_PRADESH" },
  { label: "Assam", value: "ASSAM" },
  { label: "Bihar", value: "BIHAR" },
  { label: "Chhattisgarh", value: "CHHATTISGARH" },
  { label: "Goa", value: "GOA" },
  { label: "Gujarat", value: "GUJARAT" },
  { label: "Haryana", value: "HARYANA" },
  { label: "Himachal Pradesh", value: "HIMACHAL_PRADESH" },
  { label: "Jharkhand", value: "JHARKHAND" },
  { label: "Karnataka", value: "KARNATAKA" },
  { label: "Kerala", value: "KERALA" },
  { label: "Madhya Pradesh", value: "MADHYA_PRADESH" },
  { label: "Maharashtra", value: "MAHARASHTRA" },
  { label: "Manipur", value: "MANIPUR" },
  { label: "Meghalaya", value: "MEGHALAYA" },
  { label: "Mizoram", value: "MIZORAM" },
  { label: "Nagaland", value: "NAGALAND" },
  { label: "Odisha", value: "ODISHA" },
  { label: "Punjab", value: "PUNJAB" },
  { label: "Rajasthan", value: "RAJASTHAN" },
  { label: "Sikkim", value: "SIKKIM" },
  { label: "Tamil Nadu", value: "TAMIL_NADU" },
  { label: "Telangana", value: "TELANGANA" },
  { label: "Tripura", value: "TRIPURA" },
  { label: "Uttar Pradesh", value: "UTTAR_PRADESH" },
  { label: "Uttarakhand", value: "UTTARAKHAND" },
  { label: "West Bengal", value: "WEST_BENGAL" },
];
