import type { User } from "@/types/user";

export type WorkspaceMember = {
  id: string;
  workspaceId: string;
  userId: string;
  role: "owner" | "member";
  user: User;
  createdAt: string;
  updatedAt: string;
};
