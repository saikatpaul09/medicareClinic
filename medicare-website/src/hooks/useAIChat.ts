import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "../api/aiClient";
import type { AIResponse, ChatPayload } from "../types";

export const useAIChat = () =>
  useMutation<AIResponse, Error, ChatPayload>({
    mutationFn: sendMessage,
  });
