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
  pgm.createIndex("users", "email", {
    name: "users_email_unique_idx",
    unique: true,
  });
  pgm.createIndex("users", ["firstName", "lastName"], {
    name: "users_first_last_name_idx",
  });
  pgm.createIndex("users_refresh_tokens", ["token_hash"], {
    name: "users_refresh_unique_idx",
    unique: "true",
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropIndex("users", ["firstName", "lastName"], {
    name: "users_first_last_name_idx",
  });
  pgm.dropIndex("users", "email", {
    name: "users_email_unique_idx",
  });
  pgm.dropIndex("users", "token_hash", {
    name: "users_refresh_tokens",
  });
};
