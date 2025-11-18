// store/slices/projectsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "@/types";

interface ProjectsState {
  projects: Project[];
  loading: boolean;
}

const initialState: ProjectsState = {
  projects: [
    {
      id: 1,
      name: "Website Redesign",
      description: "Complete website redesign with modern UI/UX",
      teamId: 1,
      createdById: 1,
      createdAt: Date.now(),
      status: "active",
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "Build cross-platform mobile application",
      teamId: 1,
      createdById: 1,
      createdAt: Date.now(),
      status: "active",
    },
  ],
  loading: false,
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
        status?: string;
      }>
    ) => {
      const newProject: Project = {
        id: Date.now(),
        name: action.payload.name,
        description: action.payload.description,
        teamId: action.payload.teamId,
        createdById: action.payload.createdById,
        createdAt: Date.now(),
        status: action.payload.status || "active",
      };
      state.projects.push(newProject);
    },

    updateProject: (
      state,
      action: PayloadAction<{
        id: number;
        name?: string;
        description?: string;
        status?: string;
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

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { createProject, updateProject, deleteProject, setLoading } =
  projectsSlice.actions;
export default projectsSlice.reducer;
