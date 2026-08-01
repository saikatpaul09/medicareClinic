import { Box, Paper, Typography } from "@mui/material";

import DoctorResults from "./DoctorResults";
import { type ChatMessageType } from "../../types";

interface Props {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Paper
        sx={{
          p: 2,
          maxWidth: "80%",
        }}
      >
        <Typography>{message.text}</Typography>

        {message.doctors && message.doctors.length > 0 && (
          <DoctorResults doctors={message.doctors} />
        )}
      </Paper>
    </Box>
  );
};

export default ChatMessage;
