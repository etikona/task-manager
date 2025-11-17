// store/slices/tasksSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task, TaskPriority, TaskStatus, TeamMember } from "@/types";

interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: [
    {
      id: 1,
      title: "Design Homepage",
      description: "Create new homepage design",
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
      description: "Create backend API endpoints",
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
      description: "Fix issues on mobile devices",
      projectId: 1,
      assignedMemberId: 1,
      priority: "medium",
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ],
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

    // Auto-reassign tasks for a team
    reassignTeamTasks: (
      state,
      action: PayloadAction<{
        teamId: number;
        members: TeamMember[];
        projects: Array<{ id: number; teamId: number }>;
      }>
    ) => {
      const { teamId, members, projects } = action.payload;

      // Get team project IDs
      const teamProjectIds = projects
        .filter((project) => project.teamId === teamId)
        .map((project) => project.id);

      // Get all pending/in-progress tasks for the team
      const teamTasks = state.tasks.filter(
        (task) =>
          teamProjectIds.includes(task.projectId) && task.status !== "done"
      );

      // Implementation of reassignment algorithm
      members.forEach((member) => {
        const memberTasks = teamTasks.filter(
          (t) => t.assignedMemberId === member.id
        );
        const overload = memberTasks.length - member.capacity;

        if (overload > 0) {
          // Move low/medium priority tasks
          const movableTasks = memberTasks
            .filter((t) => t.priority !== "high")
            .slice(0, overload);

          movableTasks.forEach((task) => {
            // Find member with most capacity
            const availableMember = members
              .filter((m) => {
                const mTasks = teamTasks.filter(
                  (t) => t.assignedMemberId === m.id
                );
                return mTasks.length < m.capacity;
              })
              .sort((a, b) => {
                const aTasks = teamTasks.filter(
                  (t) => t.assignedMemberId === a.id
                ).length;
                const bTasks = teamTasks.filter(
                  (t) => t.assignedMemberId === b.id
                ).length;
                return b.capacity - bTasks - (a.capacity - aTasks); // Sort by most available capacity
              })[0];

            if (availableMember) {
              task.assignedMemberId = availableMember.id;
              task.updatedAt = Date.now();
            }
          });
        }
      });
    },
  },
});

export const {
  createTask,
  updateTask,
  deleteTask,
  reassignTask,
  reassignTeamTasks,
} = tasksSlice.actions;
export default tasksSlice.reducer;
