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
  pgm.alterColumn("appointments", "appointment_datetime", {
    type: "timestamptz",
  });
  pgm.alterColumn("appointments", "created_at", {
    type: "timestamptz",
  });
  pgm.alterColumn("appointments", "updated_at", {
    type: "timestamptz",
  });

  // transactions table
  pgm.alterColumn("transactions", "transaction_date", {
    type: "timestamptz",
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.alterColumn("transactions", "transaction_date", {
    type: "timestamp",
  });
  pgm.alterColumn("appointments", "updated_at", {
    type: "timestamp",
  });
  pgm.alterColumn("appointments", "created_at", {
    type: "timestamp",
  });
  pgm.alterColumn("appointments", "appointment_datetime", {
    type: "timestamp",
  });
};
