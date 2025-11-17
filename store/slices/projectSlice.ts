// store/slices/projectsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "@/types";

interface ProjectsState {
  projects: Project[];
}

const initialState: ProjectsState = {
  projects: [
    {
      id: 1,
      name: "Website Redesign",
      description: "Complete website redesign project",
      teamId: 1,
      createdById: 1,
      createdAt: Date.now(),
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "New mobile application",
      teamId: 1,
      createdById: 1,
      createdAt: Date.now(),
    },
  ],
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    createProject: (
      state,
      action: PayloadAction<{
        name: string;
        description?: string;
        teamId: number;
        createdById: number;
      }>
    ) => {
      const newProject: Project = {
        id: Date.now(),
        name: action.payload.name,
        description: action.payload.description,
        teamId: action.payload.teamId,
        createdById: action.payload.createdById,
        createdAt: Date.now(),
      };
      state.projects.push(newProject);
    },
    updateProject: (
      state,
      action: PayloadAction<{
        id: number;
        name?: string;
        description?: string;
      }>
    ) => {
      const project = state.projects.find((p) => p.id === action.payload.id);
      if (project) {
        Object.assign(project, action.payload);
      }
    },
    deleteProject: (state, action: PayloadAction<number>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
    },
  },
});

export const { createProject, updateProject, deleteProject } =
  projectsSlice.actions;
export default projectsSlice.reducer;
