import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessageType } from "../types";

interface AIChatStore {
  messages: ChatMessageType[];

  addMessage: (message: ChatMessageType) => void;

  clearChat: () => void;

  setMessages: (
    updater:
      | ChatMessageType[]
      | ((prev: ChatMessageType[]) => ChatMessageType[]),
  ) => void;
}

export const useAIChatStore = create<AIChatStore>()(
  persist(
    (set) => ({
      messages: [],

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      clearChat: () =>
        set({
          messages: [],
        }),

      setMessages: (updater) =>
        set((state) => ({
          messages:
            typeof updater === "function" ? updater(state.messages) : updater,
        })),
    }),
    {
      name: "ai-chat-storage",
    },
  ),
);
