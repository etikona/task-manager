// store/slices/tasksSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task, TaskPriority, TaskStatus } from "@/types";

interface TasksState {
  tasks: Task[];
  loading: boolean;
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
        Object.assign(task, {
          ...action.payload,
          updatedAt: Date.now(),
        });
      }
    },

    deleteTask: (state, action: PayloadAction<number>) => {
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
        task.assignedMemberId = action.payload.newMemberId;
        task.updatedAt = Date.now();
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { createTask, updateTask, deleteTask, reassignTask, setLoading } =
  tasksSlice.actions;
export default tasksSlice.reducer;
