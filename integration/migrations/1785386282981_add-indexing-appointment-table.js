/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createIndex("appointments", ["appointment_datetime", "id"], {
    name: "idx_appointments_datetime_cursor",
  });

  pgm.createIndex("appointments", ["doctor_id", "appointment_datetime", "id"], {
    name: "idx_appointments_doctor_datetime",
  });

  pgm.createIndex("appointments", ["status", "appointment_datetime", "id"], {
    name: "idx_appointments_status_datetime",
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropIndex("appointments", ["appointment_datetime", "id"], {
    name: "idx_appointments_datetime_cursor",
  });

  pgm.dropIndex("appointments", ["doctor_id", "appointment_datetime", "id"], {
    name: "idx_appointments_doctor_datetime",
  });

  pgm.dropIndex("appointments", ["status", "appointment_datetime", "id"], {
    name: "idx_appointments_status_datetime",
  });
};
