import { MessageProps } from "@/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessage?: boolean;
  messages?: Array<MessageProps>;
}
