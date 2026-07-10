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
  pgm.createType("device_info_type", ["web", "mobile", "tablet", "other"]);
  pgm.createType("token_status", ["active", "revoked", "expired"]);
  pgm.createTable("users_refresh_tokens", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    device_info: {
      type: "varchar(255)",
    },
    token_hash: {
      type: "varchar(255)",
      unique: true,
      notNull: true,
    },
    expires_at: {
      type: "timestamp with time zone",
      notNull: true,
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("token_status");
  pgm.dropTable("device_info_type");
  pgm.dropTable("users_refresh_tokens");
};
