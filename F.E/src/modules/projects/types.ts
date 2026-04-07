interface IProject {
  _id: string;
  code: string;
  name: string;
  description?: string;
  owner_id: string;
  owner_name: string;
  expected_start_date?: string;
  expected_end_date?: string;
  status: "active" | "completed" | "on_hold" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

interface IMyProject {
  _id: string;
  code: string;
  name: string;
  description?: string;
  owner_id: string;
  owner_name: string;
  expected_start_date?: string;
  expected_end_date?: string;
  status: "active" | "completed" | "on_hold" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

interface IPayload {
  name: string;
  description?: string;
  expected_start_date?: string;
  expected_end_date?: string;
  status?: string;
}

interface IParams {
  page?: number;
  limit?: number;
  keyword?: string;
}

export type { IProject, IMyProject, IPayload, IParams };