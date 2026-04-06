interface IProject {
  _id: string;
  code: string;
  name: string;
  description?: string;
  owner_id: string;
  owner_name: string;
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
  createdAt: string;
  updatedAt: string;
}

interface IPayload {
  name: string;
  description?: string;
}

interface IParams {
  page?: number;
  limit?: number;
  keyword?: string;
}

export type { IProject, IMyProject, IPayload, IParams };