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
  pgm.createIndex("users", "gender", {
    name: "idx_users_gender",
  });
  pgm.createIndex("doctors", "consultation_fee", {
    name: "idx_doctors_consultation_fee",
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropIndex("users", "gender", {
    name: "idx_users_gender",
  });
  pgm.dropIndex("doctors", "consultation_fee", {
    name: "idx_doctors_consultation_fee",
  });
};
