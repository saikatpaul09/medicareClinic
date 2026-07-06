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
  // 1. Drop the old column
  pgm.dropColumn("users", "age");

  // 2. Add the new column
  pgm.addColumn("users", {
    date_of_birth: {
      type: "date",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.addColumn("users", {
    age: {
      type: "integer",
      notNull: false,
    },
  });
  pgm.dropColumn("users", "date_of_birth");
};
