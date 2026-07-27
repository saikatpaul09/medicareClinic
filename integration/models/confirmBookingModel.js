import pool from "../config/db.js";

export const confirmBookingService = async ({
  paymentIntentId,
  doctorId,
  patientId,
  appointmentDatetime,
  paymentMethod,
  amount,
}) => {
  const client = await pool.connect();
  // 2. Idempotency check — handles double-click / refresh-after-success
  await client.query(`SELECT pg_advisory_xact_lock(hashtext($1))`, [
    paymentIntentId,
  ]);
  const existing = await pool.query(
    `SELECT appointment_id FROM transactions WHERE stripe_payment_intent_id = $1`,
    [paymentIntentId],
  );
  if (existing.rows.length > 0) {
    await client.query("ROLLBACK");
    return {
      appointmentId: existing.rows[0].appointment_id,
      alreadyProcessed: true,
    };
  }

  // 3. Create appointment + transaction atomically
  try {
    await client.query("BEGIN");

    const appointmentResult = await client.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_datetime, status)
       VALUES ($1, $2, $3, 'Scheduled')
       RETURNING id`,
      [patientId, doctorId, appointmentDatetime],
    );
    const appointmentId = appointmentResult.rows[0].id;

    const transactionResult = await client.query(
      `INSERT INTO transactions (appointment_id, amount, payment_method, payment_status, stripe_payment_intent_id)
       VALUES ($1, $2, $3,$4, $5)
       RETURNING id`,
      [
        appointmentId,
        amount / 100,
        paymentMethod || "card",
        "Confirmed",
        paymentIntentId,
      ],
    );

    await client.query("COMMIT");
    return { appointmentId, transactionId: transactionResult.rows[0].id };
  } catch (err) {
    await client.query("ROLLBACK");

    // Race condition: two requests both passed the pre-check above at once
    if (err.code === "23505") {
      const existingAfterRace = await pool.query(
        `SELECT appointment_id FROM transactions WHERE stripe_payment_intent_id = $1`,
        [paymentIntentId],
      );
      if (existingAfterRace.rows.length > 0) {
        return {
          appointmentId: existingAfterRace.rows[0].appointment_id,
          alreadyProcessed: true,
        };
      }
    }

    throw err;
  } finally {
    client.release();
  }
};

export const getAppointmentByPatientIdDetailsService = async (patientId) => {
  const result = await pool.query(
    `SELECT
       a.id,
       a.appointment_datetime,
       a.status,
       u."firstName" AS doctor_first_name,
       u."lastName"  AS doctor_last_name,
       doc.specialization,
       doc.degree_name,
       h.name AS hospital_name,
       t.amount,
       t.payment_status,
       t.payment_method
     FROM appointments a
     JOIN doctors doc ON doc.user_id = a.doctor_id
     JOIN users u ON u.id = doc.user_id
     JOIN hospitals h ON h.id = doc.hospital_id
     JOIN transactions t ON t.appointment_id = a.id
     WHERE a.patient_id = $1
     ORDER BY a.appointment_datetime DESC`,
    [patientId],
  );
  return result.rows || null;
};

export const getAppointmentDetailsByIdService = async (appointmentId) => {
  const result = await pool.query(
    `SELECT
       a.id,
       a.appointment_datetime,
       a.status,
       doc_user.first_name AS doctor_first_name,
       doc_user.last_name  AS doctor_last_name,
       doc.specialization,
       t.amount,
       t.payment_status,
       t.payment_method
     FROM appointments a
     JOIN users doc_user ON doc_user.id = a.doctor_id
     JOIN doctors doc ON doc.user_id = a.doctor_id  
     JOIN transactions t ON t.appointment_id = a.id
     WHERE a.id = $1`,
    [appointmentId],
  );
  return result.rows[0] || null;
};
