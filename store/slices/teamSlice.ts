import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Team, TeamMember } from "@/types/index";

interface TeamsState {
  teams: Team[];
  members: TeamMember[];
}

const initialState: TeamsState = {
  teams: [
    {
      id: 1,
      name: "Development Team",
      description: "Main development team",
      createdById: 1,
      createdAt: Date.now(),
    },
  ],
  members: [
    {
      id: 1,
      name: "John Doe",
      role: "Frontend Developer",
      capacity: 5,
      teamId: 1,
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Backend Developer",
      capacity: 4,
      teamId: 1,
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "UI/UX Designer",
      capacity: 3,
      teamId: 1,
    },
  ],
};

const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    createTeam: (
      state,
      action: PayloadAction<{
        name: string;
        description?: string;
        createdById: number;
      }>
    ) => {
      const newTeam: Team = {
        id: Date.now(),
        name: action.payload.name,
        description: action.payload.description,
        createdById: action.payload.createdById,
        createdAt: Date.now(),
      };
      state.teams.push(newTeam);
    },
    addMember: (
      state,
      action: PayloadAction<{
        name: string;
        role: string;
        capacity: number;
        teamId: number;
      }>
    ) => {
      const newMember: TeamMember = {
        id: Date.now(),
        name: action.payload.name,
        role: action.payload.role,
        capacity: action.payload.capacity,
        teamId: action.payload.teamId,
      };
      state.members.push(newMember);
    },
    updateMember: (
      state,
      action: PayloadAction<{
        id: number;
        name?: string;
        role?: string;
        capacity?: number;
      }>
    ) => {
      const member = state.members.find((m) => m.id === action.payload.id);
      if (member) {
        Object.assign(member, action.payload);
      }
    },
    deleteMember: (state, action: PayloadAction<number>) => {
      state.members = state.members.filter((m) => m.id !== action.payload);
    },
  },
});

export const { createTeam, addMember, updateMember, deleteMember } =
  teamsSlice.actions;
export default teamsSlice.reducer;
