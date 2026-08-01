import { Box, Container, Typography } from "@mui/material";

import ChatWindow from "../components/ai/ChatWindow";
import ChatInput from "../components/ai/ChatInput";
import { useAIChat } from "../hooks/useAIChat";
import { useAIChatStore } from "../store/useAIChatStore";
import type { AIRole } from "../types";
import { Button } from "../components";

const AIAssistantPage = () => {
  const { mutateAsync, isPending } = useAIChat();

  const { messages, setMessages, clearChat } = useAIChatStore();

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // User message
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: "user",
        text,
      },
    ]);

    try {
      const history = messages.map((message) => ({
        role: (message.sender === "user" ? "user" : "assistant") as AIRole,

        content: message.text,
      }));
      const response = await mutateAsync({ message: text, history });

      // Assistant message
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "assistant",
          text: response.reply,
          doctors: response.data?.doctor_search?.doctors,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "assistant",
          text: "Sorry, something went wrong.",
        },
      ]);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          mt: 3,
        }}
      >
        <Typography variant="h5">AI Assistant</Typography>

        <Button variant="outlined" color={"error"} onClick={clearChat}>
          New Chat
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "400px",
        }}
      >
        <ChatWindow messages={messages} isLoading={isPending} />

        <ChatInput onSend={handleSend} disabled={isPending} />
      </Box>
    </Container>
  );
};

export default AIAssistantPage;
