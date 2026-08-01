import { useState } from "react";
import { Box, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled = false }: Props) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    onSend(message);

    setMessage("");
  };

  return (
    <Box sx={{ display: "flex", gap: 2, mt: 2, width: "100%" }}>
      <TextField
        fullWidth
        placeholder="Ask anything..."
        value={message}
        disabled={disabled}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
      />

      <IconButton onClick={handleSend} disabled={disabled}>
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default ChatInput;
