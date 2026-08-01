import { apiClient } from "../api/client";
import type { ChatPayload } from "../types";
import { AI_ROUTE } from "./apiRoutes";

export const sendMessage = async (payload: ChatPayload) => {
  const { data } = await apiClient.post(AI_ROUTE, payload);

  return data;
};
