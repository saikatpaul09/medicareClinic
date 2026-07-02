import pool from "../config/db.js";

const MAX_LIMIT = 100;
export const getAllDoctorsListService = async ({
  filters = {},
  limit = 10,
  nextCursor,
}) => {
  const queryValues = ["DOCTOR"];
  const countValues = ["DOCTOR"];
  let whereClauses = ["u.role = $1"];
  let countClauses = ["u.role = $1"];
  const {
    firstName,
    lastName,
    email,
    status,
    license_number,
    specialization,
    hospital_id,
  } = filters;
  // 1. Enforce MAX_LIMIT Guard
  let safeLimit = parseInt(limit, 10);
  if (isNaN(safeLimit) || safeLimit <= 0) {
    safeLimit = 10; // Default fallback
  } else if (safeLimit > MAX_LIMIT) {
    safeLimit = MAX_LIMIT; // Enforced upper bound
  }
  if (firstName) {
    queryValues.push(`%${firstName}%`);
    countValues.push(`%${firstName}%`);
    countClauses.push(`u."firstName" ILIKE $${countValues.length}`);
    whereClauses.push(`u."firstName" ILIKE $${queryValues.length}`); // Case-insensitive partial match
  }
  if (lastName) {
    queryValues.push(lastName);
    countValues.push(lastName);
    countClauses.push(`u."lastName" = $${countValues.length}`);
    whereClauses.push(`u."lastName" = $${queryValues.length}`);
  }
  if (email) {
    queryValues.push(email);
    countValues.push(email);
    countClauses.push(`u.email = $${countValues.length}`);
    whereClauses.push(`u.email = $${queryValues.length}`);
  }
  if (status) {
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
  if (license_number) {
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
      `(u."createdAt", u.id) < ($${queryValues.length - 1}::timestamp, $${queryValues.length}::uuid)`,
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
      u."createdAt",
      u."updatedAt",
      ui.id AS userinfo_id,
      ui.hospital_id,
      ui.specialization,
      ui.consultation_fee,
      ui.license_number,
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
  if (hasMore) {
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
