interface IMember {
  _id: string;
  project_id: string;
  email: string;
  role: "owner" | "member";
  createdAt: string;
  user?: {
    _id: string;
    username: string;
    name: string;
    avatar?: string;
  };
}

interface IPayload {
  project_id: string;
  email: string;
  role: "owner" | "member";
}

interface IParams {
  page?: number;
  limit?: number;
  keyword?: string;
}

export type { IMember, IPayload, IParams };
