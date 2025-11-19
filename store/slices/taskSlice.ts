// store/slices/taskSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task, TaskPriority, TaskStatus } from "@/types";

interface TasksState {
  tasks: Task[];
  loading: boolean;
  activityLog: ActivityLogEntry[];
}

interface ActivityLogEntry {
  id: string;
  timestamp: number;
  action: string;
  taskId: number;
  taskTitle: string;
  fromMemberId?: number | null;
  toMemberId?: number | null;
  details: string;
}

const initialState: TasksState = {
  tasks: [
    {
      id: 1,
      title: "Design Homepage",
      description: "Create modern homepage design with responsive layout",
      projectId: 1,
      assignedMemberId: 3,
      priority: "high",
      status: "in-progress",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: 2,
      title: "Setup API Endpoints",
      description: "Create REST API endpoints for user authentication",
      projectId: 2,
      assignedMemberId: 2,
      priority: "medium",
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: 3,
      title: "Fix Mobile Responsiveness",
      description: "Fix layout issues on mobile devices",
      projectId: 1,
      assignedMemberId: 1,
      priority: "medium",
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: 4,
      title: "Write Documentation",
      description: "Create user and technical documentation",
      projectId: 1,
      assignedMemberId: null,
      priority: "low",
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ],
  loading: false,
  activityLog: [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    createTask: (
      state,
      action: PayloadAction<{
        title: string;
        description?: string;
        projectId: number;
        assignedMemberId: number | null;
        priority: TaskPriority;
        status?: TaskStatus;
      }>
    ) => {
      const newTask: Task = {
        id: Date.now(),
        title: action.payload.title,
        description: action.payload.description,
        projectId: action.payload.projectId,
        assignedMemberId: action.payload.assignedMemberId,
        priority: action.payload.priority,
        status: action.payload.status || "pending",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      state.tasks.push(newTask);

      // Add to activity log
      state.activityLog.unshift({
        id: `log-${Date.now()}`,
        timestamp: Date.now(),
        action: "TASK_CREATED",
        taskId: newTask.id,
        taskTitle: newTask.title,
        details: `Task "${newTask.title}" created${
          action.payload.assignedMemberId
            ? ` and assigned to member ${action.payload.assignedMemberId}`
            : ""
        }`,
      });
    },

    updateTask: (
      state,
      action: PayloadAction<{
        id: number;
        title?: string;
        description?: string;
        assignedMemberId?: number | null;
        priority?: TaskPriority;
        status?: TaskStatus;
      }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        const oldAssignedMemberId = task.assignedMemberId;

        Object.assign(task, {
          ...action.payload,
          updatedAt: Date.now(),
        });

        // Log assignment changes
        if (
          action.payload.assignedMemberId !== undefined &&
          action.payload.assignedMemberId !== oldAssignedMemberId
        ) {
          state.activityLog.unshift({
            id: `log-${Date.now()}`,
            timestamp: Date.now(),
            action: "TASK_REASSIGNED",
            taskId: task.id,
            taskTitle: task.title,
            fromMemberId: oldAssignedMemberId,
            toMemberId: action.payload.assignedMemberId,
            details: `Task "${task.title}" reassigned from ${
              oldAssignedMemberId || "unassigned"
            } to ${action.payload.assignedMemberId || "unassigned"}`,
          });
        }

        // Log status changes
        if (action.payload.status && action.payload.status !== task.status) {
          state.activityLog.unshift({
            id: `log-${Date.now()}`,
            timestamp: Date.now(),
            action: "STATUS_CHANGED",
            taskId: task.id,
            taskTitle: task.title,
            details: `Task "${task.title}" status changed to ${action.payload.status}`,
          });
        }
      }
    },

    deleteTask: (state, action: PayloadAction<number>) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        // Add to activity log before deletion
        state.activityLog.unshift({
          id: `log-${Date.now()}`,
          timestamp: Date.now(),
          action: "TASK_DELETED",
          taskId: task.id,
          taskTitle: task.title,
          details: `Task "${task.title}" was deleted`,
        });
      }
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },

    reassignTask: (
      state,
      action: PayloadAction<{
        taskId: number;
        newMemberId: number | null;
      }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        const oldMemberId = task.assignedMemberId;
        task.assignedMemberId = action.payload.newMemberId;
        task.updatedAt = Date.now();

        // Log the reassignment
        state.activityLog.unshift({
          id: `log-${Date.now()}`,
          timestamp: Date.now(),
          action: "TASK_REASSIGNED",
          taskId: task.id,
          taskTitle: task.title,
          fromMemberId: oldMemberId,
          toMemberId: action.payload.newMemberId,
          details: `Task "${task.title}" reassigned from ${
            oldMemberId || "unassigned"
          } to ${action.payload.newMemberId || "unassigned"}`,
        });
      }
    },

    // New action for bulk reassignment
    reassignTasksAutomatically: (
      state,
      action: PayloadAction<{
        projectId?: number;
        teamId?: number;
      }>
    ) => {
      const { tasks, activityLog } = state;
      const { members } = action.payload as any; // You'll need to access members from teams state

      // This is a simplified version - you'll want to implement the full algorithm
      const reassignedTasks: Array<{
        taskId: number;
        fromMemberId: number | null;
        toMemberId: number;
      }> = [];

      // Basic implementation - move tasks from overloaded members to available ones
      tasks.forEach((task) => {
        if (task.assignedMemberId && task.priority !== "high") {
          const currentMember = members.find(
            (m: any) => m.id === task.assignedMemberId
          );
          if (currentMember) {
            const memberTasks = tasks.filter(
              (t) => t.assignedMemberId === currentMember.id
            ).length;
            if (memberTasks > currentMember.capacity) {
              // Find a member with available capacity
              const availableMember = members.find((m: any) => {
                const mTasks = tasks.filter(
                  (t) => t.assignedMemberId === m.id
                ).length;
                return mTasks < m.capacity;
              });

              if (availableMember) {
                const oldMemberId = task.assignedMemberId;
                task.assignedMemberId = availableMember.id;
                task.updatedAt = Date.now();

                reassignedTasks.push({
                  taskId: task.id,
                  fromMemberId: oldMemberId,
                  toMemberId: availableMember.id,
                });
              }
            }
          }
        }
      });

      // Log bulk reassignment
      if (reassignedTasks.length > 0) {
        activityLog.unshift({
          id: `log-${Date.now()}`,
          timestamp: Date.now(),
          action: "BULK_REASSIGNMENT",
          taskId: 0,
          taskTitle: "Multiple Tasks",
          details: `${reassignedTasks.length} tasks were automatically reassigned for better load balancing`,
        });
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // New action to clear activity log
    clearActivityLog: (state) => {
      state.activityLog = [];
    },
  },
});

export const {
  createTask,
  updateTask,
  deleteTask,
  reassignTask,
  reassignTasksAutomatically,
  setLoading,
  clearActivityLog,
} = tasksSlice.actions;

// Selectors
export const selectTasksByMember = (state: TasksState, memberId: number) => {
  return state.tasks.filter((task) => task.assignedMemberId === memberId);
};

export const selectMemberTaskCount = (state: TasksState, memberId: number) => {
  return state.tasks.filter((task) => task.assignedMemberId === memberId)
    .length;
};

export const selectOverloadedMembers = (state: TasksState, members: any[]) => {
  return members.filter((member) => {
    const taskCount = state.tasks.filter(
      (task) => task.assignedMemberId === member.id
    ).length;
    return taskCount > member.capacity;
  });
};

export const selectRecentActivity = (state: TasksState, limit: number = 10) => {
  return state.activityLog.slice(0, limit);
};

export default tasksSlice.reducer;
