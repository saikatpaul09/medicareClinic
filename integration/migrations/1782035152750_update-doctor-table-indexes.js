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
  pgm.createTable("hospitals", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: { type: "varchar(255)", notNull: true },
    address: { type: "text", notNull: true },
    contact_number: { type: "varchar(20)", notNull: true },
    created_at: { type: "timestamptz", default: pgm.func("current_timestamp") },
  });
  pgm.createTable("doctors", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
      unique: true,
    },
    hospital_id: {
      type: "uuid",
      notNull: true,
      references: '"hospitals"',
      onDelete: "CASCADE",
      unique: true,
    },
    status: { type: "doctor_status", notNull: true, default: "INACTIVE" },
    specialization: { type: "varchar(100)", notNull: true },
    consultation_fee: { type: "decimal(10,2)", notNull: true, default: 0.0 },
    license_number: { type: "varchar(50)", notNull: true, unique: true },
  });
  pgm.createTable("schedules", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    doctor_id: {
      type: "uuid",
      notNull: true,
      references: '"doctors"',
      onDelete: "CASCADE",
    },
    day_of_week: { type: "smallint", notNull: true }, // 1 (Mon) to 7 (Sun)
    start_time: { type: "time", notNull: true },
    end_time: { type: "time", notNull: true },
    is_available: { type: "boolean", notNull: true, default: true },
  });
  // 6. Appointments Table
  pgm.createTable("appointments", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    patient_id: {
      type: "uuid",
      notNull: true,
      references: '"users"',
      onDelete: "RESTRICT",
    },
    doctor_id: {
      type: "uuid",
      notNull: true,
      references: '"users"',
      onDelete: "RESTRICT",
    },
    appointment_datetime: { type: "timestamp", notNull: true },
    status: { type: "appointment_status", notNull: true, default: "Scheduled" },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
  // 7. Transactions Table
  pgm.createTable("transactions", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    appointment_id: {
      type: "uuid",
      notNull: true,
      references: '"appointments"',
      onDelete: "RESTRICT",
      unique: true,
    },
    amount: { type: "decimal(10,2)", notNull: true },
    payment_method: { type: "varchar(50)" },
    payment_status: {
      type: "payment_status",
      notNull: true,
      default: "Pending",
    },
    transaction_date: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // 8. Performance and Conflict Prevention Indexes

  pgm.createIndex("schedules", ["doctor_id", "day_of_week"], {
    name: "schedule_doctor_index",
  });

  //users index

  pgm.createExtension("pg_trgm", { ifNotExists: true });
  pgm.createIndex(
    "users",
    [
      { name: "email", opclass: "gin_trgm_ops" }, // Must be grouped with the column name
    ],
    {
      name: "users_email_trgm_idx",
      method: "gin",
    },
  );

  pgm.createIndex(
    "users",
    [
      { name: "firstName", opclass: "gin_trgm_ops" }, // Must be grouped with the column name
    ],
    {
      name: "users_firstName_trgm_idx",
      method: "gin",
    },
  );
  pgm.createIndex(
    "users",
    [
      { name: "lastName", opclass: "gin_trgm_ops" }, // Must be grouped with the column name
    ],
    {
      name: "users_lastName_trgm_idx",
      method: "gin",
    },
  );
  //doctors index
  pgm.createIndex("doctors", ["user_id"], {
    name: "doctorinfo_user_id_associated_index",
  });
  pgm.createIndex("doctors", ["status", "specialization", "hospital_id"], {
    name: "doctor_speciality_hospital_associated_index",
  });
  // Prevents double booking
  pgm.createIndex("appointments", ["doctor_id", "appointment_datetime"], {
    unique: true,
    name: "appointment_booking_index",
  });
  pgm.createIndex("appointments", "patient_id", {
    name: "patient_appointments_index",
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("doctors");
  pgm.dropTable("transactions");
  pgm.dropTable("appointments");
  pgm.dropTable("schedules");
  pgm.dropTable("hospitals");
  pgm.dropExtension("pg_trgm");
  pgm.dropIndex("schedules", ["doctor_id", "day_of_week"], {
    name: "schedule_doctor_index",
  });
  pgm.dropIndex("users", [], {
    name: "users_email_trgm_idx",
  });
  pgm.dropIndex("users", [], {
    name: "users_firstname_trgm_idx",
  });
  pgm.dropIndex("users", [], {
    name: "users_lastname_trgm_idx",
  });

  pgm.dropIndex("doctors", ["specialization", "hospital_id"], {
    name: "doctor_speciality_hospital_associated_index",
  });
  pgm.dropIndex("appointments", ["doctor_id", "appointment_datetime"], {
    name: "appointment_booking_index",
  });
  pgm.dropIndex("appointments", "patient_id", {
    name: "patient_appointments_index",
  });
};
