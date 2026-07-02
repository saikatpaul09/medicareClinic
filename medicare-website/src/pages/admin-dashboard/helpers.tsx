export const doctorListMapper = (data) => {
  return data.map((doctor) => ({
    key: doctor.id,
    id: doctor.id,
    name: `${doctor.firstName} ${doctor.lastName}`,
    ...doctor,
  }));
};
