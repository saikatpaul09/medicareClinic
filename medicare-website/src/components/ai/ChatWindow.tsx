import { Box, CircularProgress } from "@mui/material";

import ChatMessage from "./ChatMessage";
import { type ChatMessageType } from "../../types";

interface Props {
  messages: ChatMessageType[];
  isLoading: boolean;
}

const ChatWindow = ({ messages, isLoading }: Props) => {
  return (
    <Box
      sx={{
        minHeight: "400px",
        border: "1px solid #ddd",
        borderRadius: 2,
        p: 2,
        overflowY: "auto",
      }}
    >
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}

      {isLoading && <CircularProgress size={24} />}
    </Box>
  );
};

export default ChatWindow;
