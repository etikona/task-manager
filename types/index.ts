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

export interface ActivityLog {
  id: number;
  action: string;
  timestamp: number;
  teamId?: number;
  projectId?: number;
  taskId?: number;
  details?: string;
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
  currentTasks: number;
}

export interface MemberWithLoad {
  member: TeamMember;
  currentTasks: number;
  availableCapacity: number;
  loadPercentage: number;
}
export interface Updates {
  name: string;
  description: string;
  status: string;
  teamId: number;
}
