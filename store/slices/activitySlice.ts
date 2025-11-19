import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActivityLog } from "@/types";

interface ActivityState {
  logs: ActivityLog[];
}

const initialState: ActivityState = {
  logs: [
    {
      id: 1,
      action: 'Task "Design Homepage" assigned to Mike Johnson',
      timestamp: Date.now() - 1000000,
      teamId: 1,
    },
    {
      id: 2,
      action: 'Task "Setup API Endpoints" created',
      timestamp: Date.now() - 2000000,
      teamId: 1,
    },
  ],
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    addActivityLog: (
      state,
      action: PayloadAction<{
        action: string;
        teamId?: number;
        projectId?: number;
        taskId?: number;
        details?: string;
      }>
    ) => {
      const newLog: ActivityLog = {
        id: Date.now(),
        action: action.payload.action,
        timestamp: Date.now(),
        teamId: action.payload.teamId || 0,
        projectId: action.payload.projectId,
        taskId: action.payload.taskId,
        details: action.payload.details,
      };
      state.logs.unshift(newLog);

      if (state.logs.length > 50) {
        state.logs = state.logs.slice(0, 50);
      }
    },

    logTaskCreated: (
      state,
      action: PayloadAction<{
        taskId: number;
        taskTitle: string;
        assignedTo?: string;
        projectId?: number;
        projectName?: string;
      }>
    ) => {
      const newLog: ActivityLog = {
        id: Date.now(),
        action: `Task "${action.payload.taskTitle}" created${
          action.payload.assignedTo
            ? ` and assigned to ${action.payload.assignedTo}`
            : ""
        }`,
        timestamp: Date.now(),
        taskId: action.payload.taskId,
        projectId: action.payload.projectId,
        details: `Task "${action.payload.taskTitle}" was created${
          action.payload.projectName
            ? ` in project "${action.payload.projectName}"`
            : ""
        }`,
      };
      state.logs.unshift(newLog);

      if (state.logs.length > 50) {
        state.logs = state.logs.slice(0, 50);
      }
    },

    logTaskUpdated: (
      state,
      action: PayloadAction<{
        taskId: number;
        taskTitle: string;
        changes: string[];
        projectId?: number;
        projectName?: string;
      }>
    ) => {
      const newLog: ActivityLog = {
        id: Date.now(),
        action: `Task "${action.payload.taskTitle}" updated`,
        timestamp: Date.now(),
        taskId: action.payload.taskId,
        projectId: action.payload.projectId,
        details: `Task "${
          action.payload.taskTitle
        }" was updated: ${action.payload.changes.join(", ")}${
          action.payload.projectName
            ? ` in project "${action.payload.projectName}"`
            : ""
        }`,
      };
      state.logs.unshift(newLog);

      if (state.logs.length > 50) {
        state.logs = state.logs.slice(0, 50);
      }
    },

    logTaskReassigned: (
      state,
      action: PayloadAction<{
        taskId: number;
        taskTitle: string;
        fromMember?: string;
        toMember?: string;
        projectId?: number;
        projectName?: string;
      }>
    ) => {
      const newLog: ActivityLog = {
        id: Date.now(),
        action: `Task "${action.payload.taskTitle}" reassigned`,
        timestamp: Date.now(),
        taskId: action.payload.taskId,
        projectId: action.payload.projectId,
        details: `Task "${action.payload.taskTitle}" reassigned from ${
          action.payload.fromMember || "Unassigned"
        } to ${action.payload.toMember || "Unassigned"}${
          action.payload.projectName
            ? ` in project "${action.payload.projectName}"`
            : ""
        }`,
      };
      state.logs.unshift(newLog);

      if (state.logs.length > 50) {
        state.logs = state.logs.slice(0, 50);
      }
    },

    logTaskDeleted: (
      state,
      action: PayloadAction<{
        taskId: number;
        taskTitle: string;
        projectId?: number;
        projectName?: string;
      }>
    ) => {
      const newLog: ActivityLog = {
        id: Date.now(),
        action: `Task "${action.payload.taskTitle}" deleted`,
        timestamp: Date.now(),
        taskId: action.payload.taskId,
        projectId: action.payload.projectId,
        details: `Task "${action.payload.taskTitle}" was deleted${
          action.payload.projectName
            ? ` from project "${action.payload.projectName}"`
            : ""
        }`,
      };
      state.logs.unshift(newLog);

      if (state.logs.length > 50) {
        state.logs = state.logs.slice(0, 50);
      }
    },

    logProjectCreated: (
      state,
      action: PayloadAction<{
        projectId: number;
        projectName: string;
        description?: string;
        teamId?: number;
        teamName?: string;
      }>
    ) => {
      const newLog: ActivityLog = {
        id: Date.now(),
        action: `Project "${action.payload.projectName}" created`,
        timestamp: Date.now(),
        projectId: action.payload.projectId,
        teamId: action.payload.teamId,
        details: `Project "${action.payload.projectName}" was created${
          action.payload.teamName
            ? ` for team "${action.payload.teamName}"`
            : ""
        }${
          action.payload.description ? `: ${action.payload.description}` : ""
        }`,
      };
      state.logs.unshift(newLog);

      if (state.logs.length > 50) {
        state.logs = state.logs.slice(0, 50);
      }
    },

    logProjectUpdated: (
      state,
      action: PayloadAction<{
        projectId: number;
        projectName: string;
        changes: string[];
        teamId?: number;
        teamName?: string;
      }>
    ) => {
      const newLog: ActivityLog = {
        id: Date.now(),
        action: `Project "${action.payload.projectName}" updated`,
        timestamp: Date.now(),
        projectId: action.payload.projectId,
        teamId: action.payload.teamId,
        details: `Project "${
          action.payload.projectName
        }" was updated: ${action.payload.changes.join(", ")}${
          action.payload.teamName ? ` in team "${action.payload.teamName}"` : ""
        }`,
      };
      state.logs.unshift(newLog);

      if (state.logs.length > 50) {
        state.logs = state.logs.slice(0, 50);
      }
    },

    logProjectDeleted: (
      state,
      action: PayloadAction<{
        projectId: number;
        projectName: string;
        teamId?: number;
        teamName?: string;
      }>
    ) => {
      const newLog: ActivityLog = {
        id: Date.now(),
        action: `Project "${action.payload.projectName}" deleted`,
        timestamp: Date.now(),
        projectId: action.payload.projectId,
        teamId: action.payload.teamId,
        details: `Project "${action.payload.projectName}" was deleted${
          action.payload.teamName
            ? ` from team "${action.payload.teamName}"`
            : ""
        }`,
      };
      state.logs.unshift(newLog);

      if (state.logs.length > 50) {
        state.logs = state.logs.slice(0, 50);
      }
    },

    logTeamCreated: (
      state,
      action: PayloadAction<{
        teamId: number;
        teamName: string;
        description?: string;
      }>
    ) => {
      const newLog: ActivityLog = {
        id: Date.now(),
        action: `Team "${action.payload.teamName}" created`,
        timestamp: Date.now(),
        teamId: action.payload.teamId,
        details: `Team "${action.payload.teamName}" was created${
          action.payload.description ? `: ${action.payload.description}` : ""
        }`,
      };
      state.logs.unshift(newLog);

      if (state.logs.length > 50) {
        state.logs = state.logs.slice(0, 50);
      }
    },

    logTeamUpdated: (
      state,
      action: PayloadAction<{
        teamId: number;
        teamName: string;
        changes: string[];
      }>
    ) => {
      const newLog: ActivityLog = {
        id: Date.now(),
        action: `Team "${action.payload.teamName}" updated`,
        timestamp: Date.now(),
        teamId: action.payload.teamId,
        details: `Team "${
          action.payload.teamName
        }" was updated: ${action.payload.changes.join(", ")}`,
      };
      state.logs.unshift(newLog);

      if (state.logs.length > 50) {
        state.logs = state.logs.slice(0, 50);
      }
    },

    logTeamDeleted: (
      state,
      action: PayloadAction<{
        teamId: number;
        teamName: string;
      }>
    ) => {
      const newLog: ActivityLog = {
        id: Date.now(),
        action: `Team "${action.payload.teamName}" deleted`,
        timestamp: Date.now(),
        teamId: action.payload.teamId,
        details: `Team "${action.payload.teamName}" was deleted`,
      };
      state.logs.unshift(newLog);

      if (state.logs.length > 50) {
        state.logs = state.logs.slice(0, 50);
      }
    },

    logMemberAdded: (
      state,
      action: PayloadAction<{
        memberId: number;
        memberName: string;
        role: string;
        capacity: number;
        teamId: number;
        teamName?: string;
      }>
    ) => {
      const newLog: ActivityLog = {
        id: Date.now(),
        action: `Member "${action.payload.memberName}" added`,
        timestamp: Date.now(),
        teamId: action.payload.teamId,
        details: `Member "${action.payload.memberName}" was added as ${
          action.payload.role
        } with capacity ${action.payload.capacity}${
          action.payload.teamName ? ` to team "${action.payload.teamName}"` : ""
        }`,
      };
      state.logs.unshift(newLog);

      if (state.logs.length > 50) {
        state.logs = state.logs.slice(0, 50);
      }
    },

    logMemberUpdated: (
      state,
      action: PayloadAction<{
        memberId: number;
        memberName: string;
        changes: string[];
        teamId?: number;
        teamName?: string;
      }>
    ) => {
      const newLog: ActivityLog = {
        id: Date.now(),
        action: `Member "${action.payload.memberName}" updated`,
        timestamp: Date.now(),
        teamId: action.payload.teamId,
        details: `Member "${
          action.payload.memberName
        }" was updated: ${action.payload.changes.join(", ")}${
          action.payload.teamName ? ` in team "${action.payload.teamName}"` : ""
        }`,
      };
      state.logs.unshift(newLog);

      if (state.logs.length > 50) {
        state.logs = state.logs.slice(0, 50);
      }
    },

    logMemberDeleted: (
      state,
      action: PayloadAction<{
        memberId: number;
        memberName: string;
        teamId?: number;
        teamName?: string;
      }>
    ) => {
      const newLog: ActivityLog = {
        id: Date.now(),
        action: `Member "${action.payload.memberName}" removed`,
        timestamp: Date.now(),
        teamId: action.payload.teamId,
        details: `Member "${action.payload.memberName}" was removed${
          action.payload.teamName
            ? ` from team "${action.payload.teamName}"`
            : ""
        }`,
      };
      state.logs.unshift(newLog);

      if (state.logs.length > 50) {
        state.logs = state.logs.slice(0, 50);
      }
    },

    clearLogs: (state) => {
      state.logs = [];
    },
  },
});

export const {
  addActivityLog,
  logTaskCreated,
  logTaskUpdated,
  logTaskReassigned,
  logTaskDeleted,
  logProjectCreated,
  logProjectUpdated,
  logProjectDeleted,
  logTeamCreated,
  logTeamUpdated,
  logTeamDeleted,
  logMemberAdded,
  logMemberUpdated,
  logMemberDeleted,
  clearLogs,
} = activitySlice.actions;

export const selectRecentActivities = (
  state: { activity: ActivityState },
  limit: number = 10
) => {
  return state.activity.logs.slice(0, limit);
};

export const selectAllActivities = (state: { activity: ActivityState }) => {
  return state.activity.logs;
};

export default activitySlice.reducer;
