interface IAssignee {
  _id: string;
  name: string;
  avatar?: string;
}

interface IChecklistItem {
  _id: string;
  title: string;
  is_completed: boolean;
  createdAt?: string;
}

interface IStatusHistory {
  _id: string;
  task_id: string;
  old_status: string;
  new_status: string;
  note?: string;
  changed_by: string;
  changed_name?: string;
  createdAt: string;
}

interface ITask {
  _id: string;
  project_id: string;
  parent_task_id?: string | null;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "blocked" | "done";
  status_note?: string | null;
  priority: "low" | "medium" | "high";
  priority_name?: string;
  start_date?: string;
  due_date?: string;
  created_by: string;
  created_name?: string;
  assignees: IAssignee[];
  subtask_count?: number;
  subtasks?: ITask[];
  children?: ITask[];
  createdAt: string;
  updatedAt?: string;
}

interface IPayload {
  project_id: string;
  parent_task_id?: string | null;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  start_date?: string;
  due_date?: string;
}

interface IParams {
  page?: number;
  limit?: number;
  keyword?: string;
  priority?: string;
}

export type { ITask, IAssignee, IPayload, IParams, IChecklistItem, IStatusHistory };
