import crypto from "crypto";
export const createPaymentIntentService = async () => {
  const fakePaymentIntentId = `pi_test_${crypto.randomBytes(12).toString("hex")}`;
  const fakeClientSecret = `${fakePaymentIntentId}_secret_${crypto.randomBytes(8).toString("hex")}`;

  return {
    clientSecret: fakeClientSecret,
    paymentIntentId: fakePaymentIntentId,
  };
};
