// ai/tools/mappers/specializationMapper.js

export const SPECIALIZATION_MAP = {
  dermatologist: "DERMATOLOGY",
  dermatology: "DERMATOLOGY",
  skin: "DERMATOLOGY",
  "skin doctor": "DERMATOLOGY",
  "skin specialist": "DERMATOLOGY",
  "skin doctor": "DERMATOLOGY",
  cardiologist: "CARDIOLOGY",
  cardiology: "CARDIOLOGY",
  heart: "CARDIOLOGY",
  "heart specialist": "CARDIOLOGY",

  neurologist: "NEUROLOGY",
  neurology: "NEUROLOGY",

  pediatrician: "PEDIATRICS",
  pediatrics: "PEDIATRICS",
  child: "PEDIATRICS",

  psychiatrist: "PSYCHIATRY",
  psychiatry: "PSYCHIATRY",

  radiologist: "RADIOLOGY",
  radiology: "RADIOLOGY",

  surgeon: "SURGERY",
  surgery: "SURGERY",

  urologist: "UROLOGY",
  urology: "UROLOGY",

  orthopedist: "ORTHOPEDICS",
  orthopedic: "ORTHOPEDICS",
  orthopedics: "ORTHOPEDICS",
  gynecologist: "OBSTETRICS",
  gynecology: "OBSTETRICS",
  obstetrician: "OBSTETRICS",
  obstetrics: "OBSTETRICS",
  "general physician": "GENERAL_PRACTICE",
  "general doctor": "GENERAL_PRACTICE",
  "general practice": "GENERAL_PRACTICE",
};

export const normalizeSpecialization = (value) => {
  if (!value) return undefined;

  return SPECIALIZATION_MAP[value.trim().toLowerCase()];
};
