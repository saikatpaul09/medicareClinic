import { getFilteredDoctorsListService } from "../../models/userModel.js";
import { normalizeSpecialization } from "./mappers/specializationMappers.js";

export const definition = {
  type: "function",

  function: {
    name: "searchDoctors",

    description: `Use this function whenever the user asks to:
          - find a doctor
            - search for a doctor
            - recommend a doctor
            - list doctors
            - look for a specialist
            - find a skin doctor
            - find a heart doctor
            - find a child doctor
            - find a brain doctor
              This function searches the Medicare Clinic database.
              Never answer doctor search requests from your own knowledge.
              Always use this function to retrieve doctors.`,

    parameters: {
      type: "object",

      properties: {
        name: {
          type: "string",
        },

        specialization: {
          type: "string",
        },

        gender: {
          type: "string",
          enum: ["MALE", "FEMALE", "OTHER"],
        },

        hospital_id: {
          type: "string",
        },

        consultation_fee: {
          type: "string",
          description: "Example: 500-1000",
        },

        experience: {
          type: "number",
          description: "Minimum years of experience",
        },
      },

      required: [],

      additionalProperties: false,
    },
  },
};

export const execute = async (args) => {
  console.log("Executing searchDoctors with args:", args);
  const filters = {
    name: args.name,
    specialization: normalizeSpecialization(args.specialization),
    gender: args.gender,
    experience: args.experience,
  };
  const doctors = await getFilteredDoctorsListService({
    filters,
    limit: 5,
  });
  return {
    type: "doctor_search",
    doctors: doctors.data.map((doctor) => ({
      id: doctor.id,
      slug: `Dr-${doctor.firstName}-${doctor.lastName}`,
      name: `Dr ${doctor.firstName} ${doctor.lastName}`,
      specialization: doctor.specialization,
      experience: doctor.experience,
      gender: doctor.gender,
      consultationFee: doctor.consultation_fee,
      institution: doctor.institution_name,
    })),
  };
};
