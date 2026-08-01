import pool from "../config/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
export const createUserService = async (payload, filteredValues) => {
  const { email, password } = payload;
  const keys = Object.keys(filteredValues).filter(
    (key) => filteredValues[key] !== undefined && filteredValues[key] !== "",
  );
  if (keys.length === 0) {
    throw new Error(
      "One or more fields provided is null or invalid for update",
    );
  }
  const setAssignments = keys.map((_, index) => `$${index + 1}`);
  const hashedPassword = await bcrypt.hash(password, 10);
  const userCheck = await pool.query("SELECT * from users WHERE email = $1", [
    email,
  ]);
  if (userCheck.rows.length > 0) {
    throw new Error("Email already in use");
  }
  const dynamicKeys = keys.map((key) => `"${key}"`).join(", ");
  const query = `INSERT INTO users (${dynamicKeys}) VALUES (${setAssignments.join(", ")}) RETURNING id`;
  const values = [
    ...keys.map((key) =>
      key === "password" ? hashedPassword : filteredValues[key],
    ),
  ];
  const result = await pool.query(query, values);
  return result.rows[0].id;
};

export const authenticateUserService = async (email, password) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [email];
  const result = await pool.query(query, values);
  if (result.rows.length === 0) {
    throw new Error("User not found");
  }
  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  return user;
};

export const refreshTokenService = async (refreshToken) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const query = `SELECT u.role, u.email, u."firstName", u."lastName", t.* FROM users_refresh_tokens t INNER JOIN users u ON t.user_id = u.id WHERE t.token_hash = $1 AND t.is_revoked = FALSE AND t.expires_at > NOW()`;
  const values = [hashedToken];
  const result = await pool.query(query, values);
  if (!result) {
    throw new Error("error in fetching refresh token");
  }
  return result.rows[0];
};

export const saveTokenUserService = async (user, hashToken) => {
  const expiryDate = new Date(
    Date.now() + parseInt(process.env.JWT_REFRESH_SECRET_EXPIRY),
  );
  const query =
    "INSERT INTO users_refresh_tokens (user_id, token_hash, expires_at) values ($1, $2, $3)";
  const values = [user.id, hashToken, expiryDate];
  const result = await pool.query(query, values);
  if (!result) {
    throw new Error("Token not saved");
  }
};

export const getUserByIdService = async (userId) => {
  const query =
    'SELECT id, "firstName", "lastName", "email", "role" FROM users WHERE id = $1';
  const values = [userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const tokenLogoutService = async (refreshToken, userId) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const result = await pool.query(
    "DELETE FROM users_refresh_tokens WHERE user_id = $1 AND is_revoked = false AND token_hash = $2 RETURNING *",
    [userId, hashedToken],
  );
  if (!result) {
    throw new Error("invalid refresh token or user Id");
  }
  return result.rows;
};

export const getPatientDataService = async (userId) => {
  const query =
    'SELECT id, "firstName", "lastName", phone, email, role, gender, date_of_birth FROM users WHERE id = $1 AND role = $2';
  const values = [userId, "PATIENT"];
  const result = await pool.query(query, values);
  if (!result) {
    throw new Error("User doesn't exist");
  }
  return result.rows[0];
};

export const updatePatientProfileDetails = async (userId, updateFields) => {
  const keys = Object.keys(updateFields).filter(
    (key) => updateFields[key] !== undefined && updateFields[key] !== "",
  );
  if (keys.length === 0) {
    throw new Error(
      "One or more fields provided is null or invalid for update",
    );
  }
  //Build the "column = $X" assignments dynamically
  //Note: Parameter index needs to account for the userId parameter
  const setAssignments = keys.map((key, index) => `"${key}" = $${index + 2}`);
  const query = `
    UPDATE users 
    SET ${setAssignments.join(", ")} 
    WHERE id = $1 
    RETURNING id, "firstName", "lastName", "email", phone, gender, date_of_birth;
  `;
  // 4. Map the matching values to pass into the query
  const values = [userId, ...keys.map((key) => updateFields[key])];
  // 5. Execute using the connection pool
  const result = await pool.query(query, values);
  if (!result) {
    throw new Error("User update not done");
  }
  return result.rows[0];
};

export const getFilteredDoctorsListService = async ({
  filters = {},
  nextCursor,
  limit = 5,
}) => {
  const queryValues = ["DOCTOR"];
  const countValues = ["DOCTOR"];
  let whereClauses = ["u.role = $1"];
  let countClauses = ["u.role = $1"];
  // Filters sourced directly from the URL query string
  const {
    name,
    specialization,
    hospital_id,
    gender,
    consultation_fee,
    experience,
  } = filters;
  let safeLimit = parseInt(limit, 10);

  if (name) {
    queryValues.push(`%${name.trim()}%`);
    countValues.push(`%${name.trim()}%`);

    whereClauses.push(
      `CONCAT_WS(' ', u."firstName", u."lastName") ILIKE $${queryValues.length}`,
    );

    countClauses.push(
      `CONCAT_WS(' ', u."firstName", u."lastName") ILIKE $${countValues.length}`,
    );
  }
  if (specialization) {
    queryValues.push(specialization);
    countValues.push(specialization);
    countClauses.push(`ui.specialization = $${countValues.length}`);
    whereClauses.push(`ui.specialization = $${queryValues.length}`);
  }

  if (hospital_id) {
    queryValues.push(hospital_id);
    countValues.push(hospital_id);
    countClauses.push(`ui.hospital_id = $${countValues.length}`);
    whereClauses.push(`ui.hospital_id = $${queryValues.length}`);
  }

  if (gender) {
    queryValues.push(gender);
    countValues.push(gender);
    countClauses.push(`u.gender = $${countValues.length}`);
    whereClauses.push(`u.gender = $${queryValues.length}`);
  }

  if (consultation_fee) {
    const [min, max] = filters.consultation_fee.split("-").map(Number);
    const feeMin = parseFloat(min);
    const feeMax = parseFloat(max);

    if (min !== undefined && min !== "" && !isNaN(feeMin)) {
      queryValues.push(feeMin);
      countValues.push(feeMin);
      countClauses.push(`ui.consultation_fee >= $${countValues.length}`);
      whereClauses.push(`ui.consultation_fee >= $${queryValues.length}`);
    }

    if (max !== undefined && max !== "" && !isNaN(feeMax)) {
      queryValues.push(feeMax);
      countValues.push(feeMax);
      countClauses.push(`ui.consultation_fee <= $${countValues.length}`);
      whereClauses.push(`ui.consultation_fee <= $${queryValues.length}`);
    }
  }

  if (experience !== undefined && experience !== "") {
    const exp = parseInt(experience, 10);
    if (!isNaN(exp)) {
      queryValues.push(exp);
      countValues.push(exp);
      countClauses.push(`ui.experience >= $${countValues.length}`);
      whereClauses.push(`ui.experience >= $${queryValues.length}`);
    }
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
      u."firstName", 
      u."lastName", 
      u.gender,
      u."createdAt",
      ui.hospital_id,
      ui.specialization,
      ui.consultation_fee,
      ui.experience,
      ui.thumbs_up,
      ui.institution_name,
      ui.description,
      ui.degree_name
    FROM "users" u 
    inner JOIN doctors ui ON u.id = ui.user_id ${whereSql} ORDER BY u."createdAt" DESC, u.id DESC
    LIMIT $${limitIndex};
  `;
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM "users" u 
    inner JOIN doctors ui ON u.id = ui.user_id ${countSql}
  `;
  const result = await pool.query(query, queryValues);
  const countResult = await pool.query(countQuery, countValues);
  const { rows } = result;
  const hasMore = rows.length > safeLimit;
  let newCursor = null;
  if (hasMore && rows.length > 0) {
    rows.pop();
    const lastVisible = rows[rows.length - 1];
    const { createdAt, id } = lastVisible;
    const createdAtLocal = createdAt.toISOString();
    const payload = JSON.stringify({ createdAtLocal, id });
    newCursor = Buffer.from(payload).toString("base64");
  }
  const data = rows.map(({ createdAt, ...rest }) => rest);
  return {
    data,
    hasMore, // Boolean flag for frontend UI state management
    nextCursor: newCursor,
    totalCount: countResult.rows[0].total,
  };
};
