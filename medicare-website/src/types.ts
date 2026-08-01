export type SideBarRole =
  | ""
  | "LOGIN"
  | "SIGNUP"
  | "FORGOT_PASSWORD"
  | "PROFILE";

export interface DoctorResult {
  id: string;
  slug: string;
  name: string;
  specialization: string;
  experience: number;
  consultationFee: number;
  institution: string;
}

export interface AIResponse {
  success: boolean;
  reply: string;
  data?: {
    doctor_search?: {
      type: "doctor_search";
      doctors: DoctorResult[];
    };
  };
}

export interface ChatMessageType {
  id: string;
  sender: "user" | "assistant";
  text: string;
  doctors?: DoctorResult[];
}
export type AIRole = "user" | "assistant";
export interface ChatPayload {
  message: string;
  history: {
    role: AIRole;
    content: string;
  }[];
}
