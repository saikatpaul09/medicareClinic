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
  pgm.addColumn("doctors", {
    degree_name: { type: "varchar(300)", notNull: true, default: "MBBS" },
    description: { type: "text" },
    insitution_name: { type: "varchar(300)" },
    experience: { type: "numeric(4,2)" },
    thumbs_up: { type: "smallint" },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropColumn("doctors", [
    "degree_name",
    "description",
    "insitution_name",
    "experience",
    "thumbs_up",
  ]);
};
