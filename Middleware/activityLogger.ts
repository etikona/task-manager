import {
  logTaskCreated,
  logTaskUpdated,
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
} from "@/store/slices/activitySlice";
import { Middleware } from "@reduxjs/toolkit";

// Type Guards
interface CreateTaskAction {
  type: "tasks/createTask";
  payload: {
    title: string;
    assignedMemberId?: string;
    projectId: string;
  };
}

interface UpdateTaskAction {
  type: "tasks/updateTask";
  payload: {
    id: string;
    title?: string;
    status?: string;
    priority?: string;
    assignedMemberId?: string;
  };
}

interface DeleteTaskAction {
  type: "tasks/deleteTask";
  payload: string;
}

interface CreateProjectAction {
  type: "projects/createProject";
  payload: {
    name: string;
    description?: string;
    teamId?: string;
  };
}

interface UpdateProjectAction {
  type: "projects/updateProject";
  payload: {
    id: string;
    name?: string;
    description?: string;
    status?: string;
  };
}

interface DeleteProjectAction {
  type: "projects/deleteProject";
  payload: string;
}

interface CreateTeamAction {
  type: "teams/createTeam";
  payload: {
    name: string;
    description?: string;
  };
}

interface UpdateTeamAction {
  type: "teams/updateTeam";
  payload: {
    id: string;
    name?: string;
    description?: string;
  };
}

interface DeleteTeamAction {
  type: "teams/deleteTeam";
  payload: string;
}

interface AddMemberAction {
  type: "teams/addMember";
  payload: {
    name: string;
    role?: string;
    capacity?: number;
    teamId?: string;
  };
}

interface UpdateMemberAction {
  type: "teams/updateMember";
  payload: {
    id: string;
    name?: string;
    role?: string;
    capacity?: number;
  };
}

interface DeleteMemberAction {
  type: "teams/deleteMember";
  payload: string;
}

// Type Guard Functions
function isCreateTaskAction(action: any): action is CreateTaskAction {
  return (
    action.type === "tasks/createTask" &&
    action.payload &&
    typeof action.payload.title === "string" &&
    typeof action.payload.projectId === "string"
  );
}

function isUpdateTaskAction(action: any): action is UpdateTaskAction {
  return (
    action.type === "tasks/updateTask" &&
    action.payload &&
    typeof action.payload.id === "string"
  );
}

function isDeleteTaskAction(action: any): action is DeleteTaskAction {
  return (
    action.type === "tasks/deleteTask" && typeof action.payload === "string"
  );
}

function isCreateProjectAction(action: any): action is CreateProjectAction {
  return (
    action.type === "projects/createProject" &&
    action.payload &&
    typeof action.payload.name === "string"
  );
}

function isUpdateProjectAction(action: any): action is UpdateProjectAction {
  return (
    action.type === "projects/updateProject" &&
    action.payload &&
    typeof action.payload.id === "string"
  );
}

function isDeleteProjectAction(action: any): action is DeleteProjectAction {
  return (
    action.type === "projects/deleteProject" &&
    typeof action.payload === "string"
  );
}

function isCreateTeamAction(action: any): action is CreateTeamAction {
  return (
    action.type === "teams/createTeam" &&
    action.payload &&
    typeof action.payload.name === "string"
  );
}

function isUpdateTeamAction(action: any): action is UpdateTeamAction {
  return (
    action.type === "teams/updateTeam" &&
    action.payload &&
    typeof action.payload.id === "string"
  );
}

function isDeleteTeamAction(action: any): action is DeleteTeamAction {
  return (
    action.type === "teams/deleteTeam" && typeof action.payload === "string"
  );
}

function isAddMemberAction(action: any): action is AddMemberAction {
  return (
    action.type === "teams/addMember" &&
    action.payload &&
    typeof action.payload.name === "string"
  );
}

function isUpdateMemberAction(action: any): action is UpdateMemberAction {
  return (
    action.type === "teams/updateMember" &&
    action.payload &&
    typeof action.payload.id === "string"
  );
}

function isDeleteMemberAction(action: any): action is DeleteMemberAction {
  return (
    action.type === "teams/deleteMember" && typeof action.payload === "string"
  );
}

export const activityLogger: Middleware = (store) => (next) => (action) => {
  if (typeof action !== "object" || action === null || !("type" in action)) {
    return next(action);
  }

  console.log("🔍 Activity Logger - Processing action:", action.type);

  const result = next(action);
  const state = store.getState();

  try {
    // Task Actions
    if (isCreateTaskAction(action)) {
      const { title, assignedMemberId, projectId } = action.payload;

      const tasks = state.tasks?.tasks || [];
      const newTask = tasks[tasks.length - 1];

      if (newTask) {
        store.dispatch(
          logTaskCreated({
            taskId: newTask.id,
            taskTitle: title,
            assignedTo: assignedMemberId
              ? `Member ${assignedMemberId}`
              : undefined,
            projectId: parseInt(projectId, 10),
          })
        );
        console.log("✅ Logged task creation");
      }
    }

    if (isUpdateTaskAction(action)) {
      const task = state.tasks?.tasks?.find(
        (t: any) => t.id === action.payload.id
      );
      if (task) {
        const changes = [];

        if (
          action.payload.title !== undefined &&
          action.payload.title !== task.title
        ) {
          changes.push("title updated");
        }
        if (
          action.payload.status !== undefined &&
          action.payload.status !== task.status
        ) {
          changes.push(`status changed to ${action.payload.status}`);
        }
        if (
          action.payload.priority !== undefined &&
          action.payload.priority !== task.priority
        ) {
          changes.push(`priority changed to ${action.payload.priority}`);
        }
        if (
          action.payload.assignedMemberId !== undefined &&
          action.payload.assignedMemberId !== task.assignedMemberId
        ) {
          changes.push(
            `reassigned to member ${action.payload.assignedMemberId}`
          );
        }

        if (changes.length > 0) {
          store.dispatch(
            logTaskUpdated({
              taskId: parseInt(action.payload.id, 10),
              taskTitle: action.payload.title || task.title,
              changes,
              projectId: task.projectId,
            })
          );
          console.log("✅ Logged task update");
        }
      }
    }

    if (isDeleteTaskAction(action)) {
      store.dispatch(
        logTaskDeleted({
          taskId: parseInt(action.payload, 10),
          taskTitle: `Task ${action.payload}`,
        })
      );
      console.log("✅ Logged task deletion");
    }

    // Project Actions
    if (isCreateProjectAction(action)) {
      const { name, description, teamId } = action.payload;

      const projects = state.projects?.projects || [];
      const newProject = projects[projects.length - 1];

      if (newProject) {
        store.dispatch(
          logProjectCreated({
            projectId: newProject.id,
            projectName: name,
            description,
            teamId: teamId ? parseInt(teamId, 10) : undefined,
          })
        );
        console.log("✅ Logged project creation");
      }
    }

    if (isUpdateProjectAction(action)) {
      const project = state.projects?.projects?.find(
        (p: any) => p.id === action.payload.id
      );
      if (project) {
        const changes = [];

        if (
          action.payload.name !== undefined &&
          action.payload.name !== project.name
        ) {
          changes.push("name updated");
        }
        if (
          action.payload.description !== undefined &&
          action.payload.description !== project.description
        ) {
          changes.push("description updated");
        }
        if (
          action.payload.status !== undefined &&
          action.payload.status !== project.status
        ) {
          changes.push(`status changed to ${action.payload.status}`);
        }

        if (changes.length > 0) {
          store.dispatch(
            logProjectUpdated({
              projectId: parseInt(action.payload.id, 10),
              projectName: action.payload.name || project.name,
              changes,
              teamId: project.teamId,
            })
          );
          console.log("✅ Logged project update");
        }
      }
    }

    if (isDeleteProjectAction(action)) {
      store.dispatch(
        logProjectDeleted({
          projectId: parseInt(action.payload, 10),
          projectName: `Project ${action.payload}`,
        })
      );
      console.log("✅ Logged project deletion");
    }

    // Team Actions
    if (isCreateTeamAction(action)) {
      const { name, description } = action.payload;

      const teams = state.teams?.teams || [];
      const newTeam = teams[teams.length - 1];

      if (newTeam) {
        store.dispatch(
          logTeamCreated({
            teamId: newTeam.id,
            teamName: name,
            description,
          })
        );
        console.log("✅ Logged team creation");
      }
    }

    if (isUpdateTeamAction(action)) {
      const team = state.teams?.teams?.find(
        (t: any) => t.id === action.payload.id
      );
      if (team) {
        const changes = [];

        if (
          action.payload.name !== undefined &&
          action.payload.name !== team.name
        ) {
          changes.push("name updated");
        }
        if (
          action.payload.description !== undefined &&
          action.payload.description !== team.description
        ) {
          changes.push("description updated");
        }

        if (changes.length > 0) {
          store.dispatch(
            logTeamUpdated({
              teamId: parseInt(action.payload.id, 10),
              teamName: action.payload.name || team.name,
              changes,
            })
          );
          console.log("✅ Logged team update");
        }
      }
    }

    if (isDeleteTeamAction(action)) {
      store.dispatch(
        logTeamDeleted({
          teamId: parseInt(action.payload, 10),
          teamName: `Team ${action.payload}`,
        })
      );
      console.log("✅ Logged team deletion");
    }

    // Member Actions
    if (isAddMemberAction(action)) {
      const { name, role, capacity, teamId } = action.payload;

      const members = state.teams?.members || [];
      const newMember = members[members.length - 1];

      if (newMember) {
        store.dispatch(
          logMemberAdded({
            memberId: newMember.id,
            memberName: name,
            role,
            capacity,
            teamId: teamId ? parseInt(teamId, 10) : undefined,
          })
        );
        console.log("✅ Logged member addition");
      }
    }

    if (isUpdateMemberAction(action)) {
      const member = state.teams?.members?.find(
        (m: any) => m.id === action.payload.id
      );
      if (member) {
        const changes = [];

        if (
          action.payload.name !== undefined &&
          action.payload.name !== member.name
        ) {
          changes.push("name updated");
        }
        if (
          action.payload.role !== undefined &&
          action.payload.role !== member.role
        ) {
          changes.push(`role changed to ${action.payload.role}`);
        }
        if (
          action.payload.capacity !== undefined &&
          action.payload.capacity !== member.capacity
        ) {
          changes.push(`capacity changed to ${action.payload.capacity}`);
        }

        if (changes.length > 0) {
          store.dispatch(
            logMemberUpdated({
              memberId: parseInt(action.payload.id, 10),
              memberName: action.payload.name || member.name,
              changes,
              teamId: member.teamId,
            })
          );
          console.log("✅ Logged member update");
        }
      }
    }

    if (isDeleteMemberAction(action)) {
      store.dispatch(
        logMemberDeleted({
          memberId: parseInt(action.payload, 10),
          memberName: `Member ${action.payload}`,
        })
      );
      console.log("✅ Logged member deletion");
    }
  } catch (error) {
    console.error("❌ Error in activity logger:", error);
  }

  console.log(
    "🔍 Activity count after processing:",
    state.activity?.logs?.length || 0
  );
  return result;
};
