import pool from "../config/db.js";
import bcrypt from "bcrypt";

const MAX_LIMIT = 100;
export const getAllDoctorsListService = async ({
  filters = {},
  limit = 30,
  nextCursor,
  role,
}) => {
  const queryValues = ["DOCTOR"];
  const countValues = ["DOCTOR"];
  let whereClauses = ["u.role = $1"];
  let countClauses = ["u.role = $1"];
  const isAdmin = role === "ADMIN";
  const phoneColumn = isAdmin ? `u.phone` : `NULL AS phone`;
  const licenseColumn = isAdmin
    ? `ui.license_number`
    : `NULL AS license_number`;
  const dobColumn = isAdmin ? `u.date_of_birth` : `NULL AS date_of_birth`;
  const { name, email, status, license_number, specialization, hospital_id } =
    filters;
  // 1. Enforce MAX_LIMIT Guard
  let safeLimit = parseInt(limit, 10);
  if (isNaN(safeLimit) || safeLimit <= 0) {
    safeLimit = 10; // Default fallback
  } else if (safeLimit > MAX_LIMIT) {
    safeLimit = MAX_LIMIT; // Enforced upper bound
  }
  if (name) {
    const formattedSearch = `%${name.trim()}%`;
    queryValues.push(`%${formattedSearch}%`);
    countValues.push(`%${formattedSearch}%`);
    countClauses.push(
      `CONCAT_WS(' ', u."firstName", u."lastName") ILIKE $${countValues.length}`,
    );
    whereClauses.push(
      `CONCAT_WS(' ', u."firstName", u."lastName") ILIKE $${countValues.length}`,
    );
  }
  if (email) {
    queryValues.push(email);
    countValues.push(email);
    countClauses.push(`u.email = $${countValues.length}`);
    whereClauses.push(`u.email = $${queryValues.length}`);
  }
  if (status && isAdmin) {
    queryValues.push(status);
    countValues.push(status);
    countClauses.push(`ui.status = $${countValues.length}`);
    whereClauses.push(`ui.status = $${queryValues.length}`);
  }
  if (specialization) {
    queryValues.push(specialization);
    countValues.push(specialization);
    countClauses.push(`ui.specialization = $${countValues.length}`);
    whereClauses.push(`ui.specialization = $${queryValues.length}`);
  }
  if (license_number && isAdmin) {
    queryValues.push(license_number);
    countValues.push(license_number);
    countClauses.push(`ui.license_number = $${countValues.length}`);
    whereClauses.push(`ui.license_number = $${queryValues.length}`);
  }
  if (hospital_id) {
    queryValues.push(hospital_id);
    countValues.push(hospital_id);
    countClauses.push(`ui.hospital_id = $${countValues.length}`);
    whereClauses.push(`ui.hospital_id = $${queryValues.length}`);
  }
  // 2. Keyset Pagination (Cursor Logic)
  if (nextCursor) {
    const decoded = Buffer.from(nextCursor, "base64").toString("utf8");
    const decodedParse = JSON.parse(decoded);
    queryValues.push(decodedParse.createdAtLocal, decodedParse.id);
    // Secure row values comparison logic
    whereClauses.push(
      `(u."createdAt", u.id) < ($${queryValues.length - 1}::timestamptz, $${queryValues.length}::uuid)`,
    );
  }
  // Construct WHERE clause
  const whereSql =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
  const countSql =
    countClauses.length > 0 ? `WHERE ${countClauses.join(" AND ")}` : "";
  // Append Limit (+1 to fetch next token window)
  queryValues.push(safeLimit + 1);
  const limitIndex = queryValues.length;

  const query = `
    SELECT 
      u.id, 
      u.email, 
      u."firstName", 
      u."lastName", 
      ${phoneColumn},
      u.gender,
      ${dobColumn},
      u."createdAt",
      u."updatedAt",
      ui.hospital_id,
      ui.specialization,
      ui.consultation_fee,
      ui.experience,
      ui.thumbs_up,
      ui.institution_name,
      ui.description,
      ui.degree_name,
      ${licenseColumn},
      ui.status
    FROM "users" u 
    LEFT JOIN doctors ui ON u.id = ui.user_id ${whereSql} ORDER BY u."createdAt" DESC, u.id DESC
    LIMIT $${limitIndex};
  `;
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM "users" u 
    LEFT JOIN doctors ui ON u.id = ui.user_id ${countSql}
  `;

  const result = await pool.query(query, queryValues);
  const countResult = await pool.query(countQuery, countValues);
  const { rows } = result;
  const hasMore = rows.length > safeLimit;
  let newCursor = null;
  // Generate the next cursor using the last visible record on the page
  if (hasMore && rows.length > 0) {
    rows.pop(); // Remove the extra item used to check for more data
    const lastVisible = rows[rows.length - 1];
    const { createdAt, id } = lastVisible;
    const createdAtLocal = createdAt.toISOString();
    const payload = JSON.stringify({ createdAtLocal, id });
    newCursor = Buffer.from(payload).toString("base64");
  }

  return {
    data: rows,
    hasMore, // Boolean flag for frontend UI state management
    nextCursor: newCursor,
    totalCount: countResult.rows[0].total,
  };
};
export const getDoctorByIdService = async ({ doctorId, role }) => {
  const isAdmin = role === "ADMIN";
  const phoneColumn = isAdmin ? `u.phone` : `NULL AS phone`;
  const licenseColumn = isAdmin ? `d.license_number` : `NULL AS license_number`;
  const dobColumn = isAdmin ? `u.date_of_birth` : `NULL AS date_of_birth`;
  const query = `
    SELECT
      u.id,
      u.email,
      u."firstName",
      u."lastName",
      ${phoneColumn},
      u.gender,
      ${dobColumn},
      u."createdAt",
      u."updatedAt",
      d.hospital_id,
      d.specialization,
      d.consultation_fee,
      d.experience,
      d.thumbs_up,
      d.institution_name,
      d.description,
      d.degree_name,
      ${licenseColumn},
      d.status
    FROM "users" u
    LEFT JOIN doctors d
      ON u.id = d.user_id

    WHERE
      u.id = $1
      AND u.role = 'DOCTOR'

    LIMIT 1;
  `;
  const { rows } = await pool.query(query, [doctorId]);
  return rows[0] || null;
};
export const createDoctorService = async (doctorData) => {
  const client = await pool.connect();
  const {
    email,
    firstName,
    lastName,
    password,
    phone,
    gender,
    date_of_birth,
    hospital_id,
    experience,
    institution_name,
    description,
    degree_name,
    specialization,
    consultation_fee,
    license_number,
    status,
  } = doctorData;
  try {
    await client.query("BEGIN");
    // Check if email already exists
    const existingUser = await client.query(
      `SELECT id FROM users WHERE email = $1`,
      [email],
    );

    if (existingUser.rows.length > 0) {
      throw new Error("Doctor with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userQuery = `
      INSERT INTO users (
        email,
        "firstName",
        "lastName",
        password,
        phone,
        gender,
        date_of_birth,
        role
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8
      )
      RETURNING id;
    `;

    const userResult = await client.query(userQuery, [
      email,
      firstName,
      lastName,
      hashedPassword,
      phone,
      gender,
      date_of_birth,
      "DOCTOR",
    ]);

    const userId = userResult.rows[0].id;

    const doctorQuery = `
      INSERT INTO doctors (
        user_id,
        hospital_id,
        specialization,
        consultation_fee,
        license_number,
        status,
        experience,
        institution_name,
        description,
        degree_name
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
      )
      RETURNING *;
    `;

    const doctorResult = await client.query(doctorQuery, [
      userId,
      hospital_id,
      specialization,
      consultation_fee,
      license_number,
      status || "ACTIVE",
      experience,
      institution_name,
      description,
      degree_name,
    ]);

    await client.query("COMMIT");

    return {
      doctorId: userId,
      doctor: doctorResult.rows[0],
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const updateDoctorService = async (doctorData) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const {
      userId,
      email,
      firstName,
      lastName,
      phone,
      gender,
      date_of_birth,
      hospital_id,
      specialization,
      consultation_fee,
      license_number,
      status,
      experience,
      institution_name,
      description,
      degree_name,
    } = doctorData;

    await client.query(
      `
      UPDATE users
      SET
        email = COALESCE($1, email),
        "firstName" = COALESCE($2, "firstName"),
        "lastName" = COALESCE($3, "lastName"),
        phone = COALESCE($4, phone),
        gender = COALESCE($5, gender),
        date_of_birth = COALESCE($6, date_of_birth),
        "updatedAt" = NOW()
      WHERE id = $7
      `,
      [email, firstName, lastName, phone, gender, date_of_birth, userId],
    );

    const doctorProfile = await client.query(
      `
      SELECT id
      FROM doctors
      WHERE user_id = $1
      `,
      [userId],
    );

    if (doctorProfile.rowCount > 0) {
      await client.query(
        `
        UPDATE doctors
        SET
          hospital_id = COALESCE($1, hospital_id),
          specialization = COALESCE($2, specialization),
          consultation_fee = COALESCE($3, consultation_fee),
          license_number = COALESCE($4, license_number),
          status = COALESCE($5, status),
          experience= COALESCE($6, experience),
          institution_name= COALESCE($7, institution_name),
          description= COALESCE($8, description),
          degree_name= COALESCE($9, degree_name),
          updated_at = NOW()
          WHERE user_id = $10
        `,
        [
          hospital_id,
          specialization,
          consultation_fee,
          license_number,
          status,
          experience,
          institution_name,
          description,
          degree_name,
          userId,
        ],
      );
    } else {
      await client.query(
        `
        INSERT INTO doctors (
          user_id,
          hospital_id,
          specialization,
          consultation_fee,
          license_number,
          status
          experience,
          institution_name,
          description,
          degree_name,
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
        )
        `,
        [
          userId,
          hospital_id,
          specialization,
          consultation_fee,
          license_number,
          status || "ACTIVE",
          experience,
          institution_name,
          description,
          degree_name,
        ],
      );
    }

    await client.query("COMMIT");

    return {
      success: true,
      message: "Doctor updated successfully",
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const deleteDoctorService = async (userId) => {
  const result = await pool.query(
    `
    DELETE FROM users
    WHERE id = $1
      AND role = 'DOCTOR'
    RETURNING id;
    `,
    [userId],
  );
  if (result.rowCount === 0) {
    throw new Error("Doctor not found");
  }
  return result.rows[0];
};
export const getAllPatientListService = async ({
  filters = {},
  limit = 10,
  nextCursor,
}) => {
  const queryValues = ["PATIENT"];
  const countValues = ["PATIENT"];
  let whereClauses = ["u.role = $1"];
  let countClauses = ["u.role = $1"];
  const { name, email, gender, phone_number } = filters;
  // 1. Enforce MAX_LIMIT Guard
  let safeLimit = parseInt(limit, 10);
  if (isNaN(safeLimit) || safeLimit <= 0) {
    safeLimit = 10; // Default fallback
  } else if (safeLimit > MAX_LIMIT) {
    safeLimit = MAX_LIMIT; // Enforced upper bound
  }

  if (name) {
    const formattedSearch = `%${name.trim()}%`;
    queryValues.push(`%${formattedSearch}%`);
    countValues.push(`%${formattedSearch}%`);
    countClauses.push(
      `CONCAT_WS(' ', u."firstName", u."lastName") ILIKE $${countValues.length}`,
    );
    whereClauses.push(
      `CONCAT_WS(' ', u."firstName", u."lastName") ILIKE $${countValues.length}`,
    );
  }

  if (email) {
    queryValues.push(email);
    countValues.push(email);
    countClauses.push(`u.email = $${countValues.length}`);
    whereClauses.push(`u.email = $${queryValues.length}`);
  }
  if (phone_number) {
    queryValues.push(phone_number);
    countValues.push(phone_number);
    countClauses.push(`u.phone = $${countValues.length}`);
    whereClauses.push(`u.phone = $${queryValues.length}`);
  }
  if (gender) {
    queryValues.push(gender);
    countValues.push(gender);
    countClauses.push(`u.gender = $${countValues.length}`);
    whereClauses.push(`u.gender = $${queryValues.length}`);
  }
  // 2. Keyset Pagination (Cursor Logic)
  if (nextCursor) {
    const decoded = Buffer.from(nextCursor, "base64").toString("utf8");
    const decodedParse = JSON.parse(decoded);
    queryValues.push(decodedParse.createdAtLocal, decodedParse.id);
    // Secure row values comparison logic
    whereClauses.push(
      `(u."createdAt", u.id) < ($${queryValues.length - 1}::timestamptz, $${queryValues.length}::uuid)`,
    );
  }
  // Construct WHERE clause
  const whereSql =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
  const countSql =
    countClauses.length > 0 ? `WHERE ${countClauses.join(" AND ")}` : "";
  // Append Limit (+1 to fetch next token window)
  queryValues.push(safeLimit + 1);
  const limitIndex = queryValues.length;

  const query = `
    SELECT 
      u.id, 
      u.email, 
      u."firstName", 
      u."lastName", 
      u.phone,
      u.gender,
      u.date_of_birth,
      u."createdAt",
      u."updatedAt" FROM "users" u 
     ${whereSql} ORDER BY u."createdAt" DESC, u.id DESC
    LIMIT $${limitIndex};
  `;
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM "users" u 
     ${countSql}
  `;

  const result = await pool.query(query, queryValues);
  const countResult = await pool.query(countQuery, countValues);
  const { rows } = result;
  const hasMore = rows.length > safeLimit;
  let newCursor = null;
  // Generate the next cursor using the last visible record on the page
  if (hasMore && rows.length > 0) {
    rows.pop(); // Remove the extra item used to check for more data
    const lastVisible = rows[rows.length - 1];
    const { createdAt, id } = lastVisible;
    const createdAtLocal = createdAt.toLocaleString();
    const payload = JSON.stringify({ createdAtLocal, id });
    newCursor = Buffer.from(payload).toString("base64");
  }

  return {
    data: rows,
    hasMore, // Boolean flag for frontend UI state management
    nextCursor: newCursor,
    totalCount: countResult.rows[0].total,
  };
};

export const createAdminPatientService = async (patientData) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const {
      email,
      firstName,
      lastName,
      password,
      phone,
      gender,
      date_of_birth,
    } = patientData;

    // Check if email already exists
    const existingUser = await client.query(
      `SELECT id FROM users WHERE email = $1`,
      [email],
    );
    if (existingUser.rows.length > 0) {
      throw new Error("Patient with this email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await client.query(
      `
      INSERT INTO users (
        email,
        "firstName",
        "lastName",
        password,
        phone,
        gender,
        date_of_birth,
        role,
        "createdAt",
        "updatedAt"
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,
        NOW(),
        NOW()
      )
      RETURNING
        id,
        email,
        "firstName",
        "lastName",
        phone,
        gender,
        date_of_birth,
        "createdAt",
        "updatedAt";
      `,
      [
        email,
        firstName,
        lastName,
        hashedPassword,
        phone,
        gender,
        date_of_birth,
        "PATIENT",
      ],
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const updateAdminPatientService = async (patientData) => {
  const { userId, email, firstName, lastName, phone, gender, date_of_birth } =
    patientData;
  const fields = [];
  const values = [];
  let index = 1;

  if (email !== undefined) {
    fields.push(`email = $${index++}`);
    values.push(email);
  }

  if (firstName !== undefined) {
    fields.push(`"firstName" = $${index++}`);
    values.push(firstName);
  }

  if (lastName !== undefined) {
    fields.push(`"lastName" = $${index++}`);
    values.push(lastName);
  }

  if (phone !== undefined) {
    fields.push(`phone = $${index++}`);
    values.push(phone);
  }

  if (gender !== undefined) {
    fields.push(`gender = $${index++}`);
    values.push(gender);
  }

  if (date_of_birth !== undefined) {
    fields.push(`date_of_birth = $${index++}`);
    values.push(date_of_birth);
  }

  fields.push(`"updatedAt" = NOW()`);
  values.push(userId);
  const query = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = $${index}
      AND role = 'PATIENT'
    RETURNING
      id,
      email,
      "firstName",
      "lastName",
      phone,
      gender,
      date_of_birth,
      role,
      "createdAt",
      "updatedAt";
  `;

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new Error("Patient not found");
  }

  return result.rows[0];
};

export const deleteAdminPatientService = async (userId) => {
  const result = await pool.query(
    `
    DELETE FROM users
    WHERE id = $1
      AND role = 'PATIENT'
    RETURNING id;
    `,
    [userId],
  );

  if (result.rows.length === 0) {
    throw new Error("Patient not found");
  }

  return true;
};

export const fetchDashboardOverViewService = async () => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM users WHERE role = 'DOCTOR') AS total_doctors,
      (SELECT COUNT(*) FROM users WHERE role = 'PATIENT') AS total_patients,
      (SELECT COUNT(*) FROM hospitals) AS total_hospitals,
      (SELECT COUNT(*) FROM appointments) AS total_appointments;
  `;
  const { rows } = await pool.query(query);
  return {
    totalDoctors: Number(rows[0].total_doctors),
    totalPatients: Number(rows[0].total_patients),
    totalHospitals: Number(rows[0].total_hospitals),
    totalAppointments: Number(rows[0].total_appointments),
  };
};

export const getDoctorSchedulesService = async (doctorId) => {
  const query = `
    SELECT
      id,
      doctor_id,
      day_of_week,
      start_time,
      end_time,
      is_available
    FROM schedules
    WHERE doctor_id = $1
    ORDER BY day_of_week, start_time;
  `;
  const { rows } = await pool.query(query, [doctorId]);
  return rows;
};

export const updateDoctorSchedulesService = async (doctorId, schedules) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `
      DELETE FROM schedules
      WHERE doctor_id = $1
      `,
      [doctorId],
    );

    for (const slot of schedules) {
      await client.query(
        `
        INSERT INTO schedules (
          doctor_id,
          day_of_week,
          start_time,
          end_time,
          is_available
        )
        VALUES ($1,$2,$3,$4,$5)
        `,
        [
          doctorId,
          slot.day_of_week,
          slot.start_time,
          slot.end_time,
          slot.is_available ?? true,
        ],
      );
    }

    await client.query("COMMIT");

    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
