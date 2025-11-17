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
    addLog: (
      state,
      action: PayloadAction<{
        action: string;
        teamId: number;
      }>
    ) => {
      const newLog: ActivityLog = {
        id: Date.now(),
        action: action.payload.action,
        timestamp: Date.now(),
        teamId: action.payload.teamId,
      };
      state.logs.unshift(newLog);

      if (state.logs.length > 20) {
        state.logs = state.logs.slice(0, 20);
      }
    },
    clearLogs: (state) => {
      state.logs = [];
    },
  },
});

export const { addLog, clearLogs } = activitySlice.actions;
export default activitySlice.reducer;
