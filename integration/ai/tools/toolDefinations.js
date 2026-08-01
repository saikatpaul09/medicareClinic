export default [
  {
    type: "function",

    name: "searchDoctors",

    description:
      "Search doctors using specialization, hospital, gender and consultation fee.",

    parameters: {
      type: "object",

      properties: {
        specialization: {
          type: "string",
        },

        gender: {
          type: "string",
        },

        hospital: {
          type: "string",
        },

        consultation_fee: {
          type: "number",
        },
      },

      required: [],
    },
  },
];
