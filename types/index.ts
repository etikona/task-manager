export interface TeamMember {
  id: number;
  name: string;
  role: string;
  capacity: number;
  teamId: number;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  createdById: number;
  createdAt: number;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  teamId: number;
  createdById: number;
  createdAt: number;
  status?: "active" | "completed" | "on-hold" | "cancelled" | string;
}

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "in-progress" | "done";

export interface Task {
  id: number;
  title: string;
  description?: string;
  projectId: number;
  assignedMemberId: number | null;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: number;
  updatedAt: number;
}

// Updated Activity Log to match taskSlice implementation
export interface ActivityLog {
  id: string;
  timestamp: number;
  action:
    | "TASK_CREATED"
    | "TASK_UPDATED"
    | "TASK_DELETED"
    | "TASK_REASSIGNED"
    | "STATUS_CHANGED"
    | "BULK_REASSIGNMENT"
    | "PRIORITY_CHANGED";
  taskId: number;
  taskTitle: string;
  fromMemberId?: number | null;
  toMemberId?: number | null;
  details: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  capacity: number;
  teamId: number;
  currentTasks: number; // Add this field
}

export interface MemberWithLoad {
  member: TeamMember;
  currentTasks: number;
  availableCapacity: number;
  loadPercentage: number;
}
