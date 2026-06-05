export type ClientStatus = "active" | "inactive" | "archived";

export type Client = {
  id: string;
  workspaceId: string;
  name: string;
  status: ClientStatus;
  contactName: string | null;
  contactEmail: string | null;
  companyWebsite: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClientPayload = {
  workspaceId: string;
  name: string;
  status: ClientStatus;
  contactName?: string | null;
  contactEmail?: string | null;
  companyWebsite?: string | null;
  notes?: string | null;
};
