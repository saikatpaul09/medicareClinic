export const up = (pgm) => {
  // 1. Drop the old constraint
  pgm.dropConstraint("schedules", "schedules_doctor_id_fkey");

  // 2. Add the updated constraint
  pgm.addConstraint("schedules", "schedules_doctor_id_fkey", {
    foreignKeys: {
      columns: "doctor_id",
      references: "doctors(user_id)",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  });
};

export const down = (pgm) => {
  // Reverse the process to allow rollbacks
  pgm.dropConstraint("schedules", "schedules_doctor_id_fkey");

  // Re-create the original exact constraint status
  pgm.addConstraint("schedules", "schedules_doctor_id_fkey", {
    foreignKeys: {
      columns: "doctor_id",
      references: "doctors(user_id)",
    },
  });
};
