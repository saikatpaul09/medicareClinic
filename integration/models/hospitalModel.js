import pool from "../config/db.js";
export const createHospitalService = async ({
  name,
  address,
  contactNumber,
  state,
  pin,
}) => {
  const query = `
    INSERT INTO hospitals (
      name,
      address,
      contact_number,
      state,
      pin
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const contact_number = contactNumber;
  const values = [name, address, contact_number, state, pin];

  const { rows } = await pool.query(query, values);

  return rows[0];
};
export const deleteHospitalService = async (hospitalId) => {
  const query = `
    DELETE FROM hospitals
    WHERE id = $1
    RETURNING id;
  `;
  const { rows } = await pool.query(query, [hospitalId]);
  return rows[0] || null;
};
export const updateHospitalService = async ({
  hospitalId,
  name,
  address,
  contactNumber,
  state,
  pin,
}) => {
  const updates = [];
  const values = [];
  let paramIndex = 1;

  if (name !== undefined) {
    updates.push(`name = $${paramIndex++}`);
    values.push(name);
  }

  if (address !== undefined) {
    updates.push(`address = $${paramIndex++}`);
    values.push(address);
  }

  if (contactNumber !== undefined) {
    updates.push(`contact_number = $${paramIndex++}`);
    values.push(contactNumber);
  }

  if (state !== undefined) {
    updates.push(`state = $${paramIndex++}`);
    values.push(state);
  }

  if (pin !== undefined) {
    updates.push(`pin = $${paramIndex++}`);
    values.push(pin);
  }

  if (updates.length === 0) {
    throw new Error("No fields provided for update");
  }

  values.push(hospitalId);

  const query = `
    UPDATE hospitals
    SET ${updates.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `;

  const { rows } = await pool.query(query, values);

  return rows[0];
};

export const getAllHospitalsService = async ({
  search,
  state,
  limit = 10,
  nextCursor,
}) => {
  const queryValues = [];
  const whereClauses = [];
  const countValues = [];
  const countClauses = [];
  if (search) {
    queryValues.push(`%${search.trim()}%`);
    countValues.push(`%${search.trim()}%`);
    whereClauses.push(`name ILIKE $${queryValues.length}`);
    countClauses.push(`name ILIKE $${queryValues.length}`);
  }

  if (state) {
    queryValues.push(state);
    countValues.push(state);
    whereClauses.push(`state = $${queryValues.length}`);
    countClauses.push(`state = $${queryValues.length}`);
  }

  if (nextCursor) {
    queryValues.push(nextCursor);

    whereClauses.push(`
      id > $${queryValues.length}
    `);
  }

  const whereQuery =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
  const countSqlQuery =
    countClauses.length > 0 ? `WHERE ${countClauses.join(" AND ")}` : "";
  queryValues.push(limit + 1);

  const query = `
    SELECT
      id,
      name,
      address,
      contact_number,
      state,
      pin,
      created_at,
      updated_at
    FROM hospitals
    ${whereQuery}
    ORDER BY id ASC
    LIMIT $${queryValues.length};
  `;
  const countQuery = `
  SELECT COUNT(*) AS total
  FROM hospitals
  ${countSqlQuery};
`;
  const { rows } = await pool.query(query, queryValues);
  const countResult = await pool.query(countQuery, countValues);
  const hasNextPage = rows.length > limit;
  const hospitals = hasNextPage ? rows.slice(0, limit) : rows;

  return {
    hospitals,
    nextCursor: hasNextPage ? hospitals[hospitals.length - 1].id : null,
    totalCount: countResult.rows[0].total,
    hasNextPage,
  };
};
