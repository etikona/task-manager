import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task, TaskPriority, TaskStatus, TeamMember } from "@/types";

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
        const oldAssignedMemberId = task.assignedMemberId;
        const oldStatus = task.status;
        const oldPriority = task.priority;
        const oldTitle = task.title;

        console.log("Updating task:", {
          taskId: task.id,
          oldTitle,
          newTitle: action.payload.title,
          oldAssignedMemberId,
          newAssignedMemberId: action.payload.assignedMemberId,
          oldStatus,
          newStatus: action.payload.status,
          oldPriority,
          newPriority: action.payload.priority,
        });

        if (action.payload.title !== undefined)
          task.title = action.payload.title;
        if (action.payload.description !== undefined)
          task.description = action.payload.description;
        if (action.payload.assignedMemberId !== undefined)
          task.assignedMemberId = action.payload.assignedMemberId;
        if (action.payload.priority !== undefined)
          task.priority = action.payload.priority;
        if (action.payload.status !== undefined)
          task.status = action.payload.status;

        task.updatedAt = Date.now();
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
        const oldMemberId = task.assignedMemberId;
        task.assignedMemberId = action.payload.newMemberId;
        task.updatedAt = Date.now();
      }
    },

    reassignTasks: (
      state,
      action: PayloadAction<{
        members: TeamMember[];
        onReassignment?: (
          reassignments: Array<{
            taskId: number;
            taskTitle: string;
            fromMemberId: number | null;
            toMemberId: number;
            fromMemberName: string;
            toMemberName: string;
          }>
        ) => void;
      }>
    ) => {
      const { members, onReassignment } = action.payload;
      const reassignments: Array<{
        taskId: number;
        taskTitle: string;
        fromMemberId: number | null;
        toMemberId: number;
        fromMemberName: string;
        toMemberName: string;
      }> = [];

      members.forEach((member) => {
        const memberTasks = state.tasks.filter(
          (task) => task.assignedMemberId === member.id
        );

        if (memberTasks.length > member.capacity) {
          const tasksToReassign = memberTasks
            .filter((task) => task.priority !== "high")
            .slice(0, memberTasks.length - member.capacity);

          tasksToReassign.forEach((task) => {
            const availableMember = members.find((m) => {
              const mTasks = state.tasks.filter(
                (t) => t.assignedMemberId === m.id
              ).length;
              return mTasks < m.capacity && m.id !== member.id;
            });

            if (availableMember) {
              reassignments.push({
                taskId: task.id,
                taskTitle: task.title,
                fromMemberId: task.assignedMemberId,
                toMemberId: availableMember.id,
                fromMemberName: member.name,
                toMemberName: availableMember.name,
              });

              task.assignedMemberId = availableMember.id;
              task.updatedAt = Date.now();
            }
          });
        }
      });

      if (onReassignment && reassignments.length > 0) {
        onReassignment(reassignments);
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  createTask,
  updateTask,
  deleteTask,
  reassignTask,
  reassignTasks,
  setLoading,
} = tasksSlice.actions;

export const selectTasksByMember = (
  state: { tasks: TasksState },
  memberId: number
) => {
  return state.tasks.tasks.filter((task) => task.assignedMemberId === memberId);
};

export const selectMemberTaskCount = (
  state: { tasks: TasksState },
  memberId: number
) => {
  return state.tasks.tasks.filter((task) => task.assignedMemberId === memberId)
    .length;
};

export const selectOverloadedMembers = (
  state: { tasks: TasksState },
  members: TeamMember[]
) => {
  return members.filter((member) => {
    const taskCount = state.tasks.tasks.filter(
      (task) => task.assignedMemberId === member.id
    ).length;
    return taskCount > member.capacity;
  });
};

export default tasksSlice.reducer;
