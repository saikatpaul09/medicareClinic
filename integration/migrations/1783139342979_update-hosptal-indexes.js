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
  pgm.createIndex("hospitals", "state", {
    name: "hospital_state_index",
  });
  pgm.createIndex("hospitals", "name", {
    name: "hospital_name_index",
  });
  pgm.sql(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  pgm.sql(`
    CREATE TRIGGER trg_hospitals_updated_at
    BEFORE UPDATE ON hospitals
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
    DROP TRIGGER IF EXISTS trg_hospitals_updated_at ON hospitals;
  `);
  pgm.sql(`
    DROP FUNCTION IF EXISTS set_updated_at();
  `);
  pgm.dropIndex("hospitals", "name", {
    name: "hospital_name_index",
  });
  pgm.dropIndex("hospitals", "state", {
    name: "hospital_state_index",
  });
};
