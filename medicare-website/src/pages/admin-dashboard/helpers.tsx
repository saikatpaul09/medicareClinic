export const doctorListMapper = ({ data, hospitalOptions }) => {
  return data?.map((doctor) => {
    const hospitalName =
      hospitalOptions &&
      hospitalOptions?.find(
        (hospital) => hospital.value === doctor.hospital_id,
      );
    return {
      key: doctor.id,
      id: doctor.id,
      hospitalName: hospitalName?.name,
      name: `${doctor.firstName} ${doctor.lastName}`,
      ...doctor,
    };
  });
};

export const patientListMapper = ({ data }) => {
  return data?.map((patient) => {
    return {
      key: patient.id,
      id: patient.id,
      name: `${patient.firstName} ${patient.lastName}`,
      ...patient,
    };
  });
};

export const hospitalListMapper = ({ data }) => {
  return data?.map((hospital) => {
    const formatState =
      hospital?.state
        ?.toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ") || "";
    return {
      key: hospital.id,
      id: hospital.id,
      ...hospital,
      state: formatState,
    };
  });
};
