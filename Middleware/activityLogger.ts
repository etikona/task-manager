import { Middleware, AnyAction } from "@reduxjs/toolkit";
import {
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
} from "@/store/slices/activitySlice";

export const activityLogger: Middleware =
  (store) => (next) => (action: AnyAction) => {
    console.log("🔍 Activity Logger - Processing action:", action.type);

    const result = next(action);
    const state = store.getState();

    try {
      if (action.type === "tasks/createTask") {
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
              projectId,
            })
          );
          console.log("✅ Logged task creation");
        }
      }

      if (action.type === "tasks/updateTask") {
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
                taskId: action.payload.id,
                taskTitle: action.payload.title || task.title,
                changes,
                projectId: task.projectId,
              })
            );
            console.log("✅ Logged task update");
          }
        }
      }

      if (action.type === "tasks/deleteTask") {
        store.dispatch(
          logTaskDeleted({
            taskId: action.payload,
            taskTitle: `Task ${action.payload}`,
          })
        );
        console.log("✅ Logged task deletion");
      }

      if (action.type === "projects/createProject") {
        const { name, description, teamId } = action.payload;

        const projects = state.projects?.projects || [];
        const newProject = projects[projects.length - 1];

        if (newProject) {
          store.dispatch(
            logProjectCreated({
              projectId: newProject.id,
              projectName: name,
              description,
              teamId,
            })
          );
          console.log("✅ Logged project creation");
        }
      }

      if (action.type === "projects/updateProject") {
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
                projectId: action.payload.id,
                projectName: action.payload.name || project.name,
                changes,
                teamId: project.teamId,
              })
            );
            console.log("✅ Logged project update");
          }
        }
      }

      if (action.type === "projects/deleteProject") {
        store.dispatch(
          logProjectDeleted({
            projectId: action.payload,
            projectName: `Project ${action.payload}`,
          })
        );
        console.log("✅ Logged project deletion");
      }

      if (action.type === "teams/createTeam") {
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

      if (action.type === "teams/updateTeam") {
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
                teamId: action.payload.id,
                teamName: action.payload.name || team.name,
                changes,
              })
            );
            console.log("✅ Logged team update");
          }
        }
      }

      if (action.type === "teams/deleteTeam") {
        store.dispatch(
          logTeamDeleted({
            teamId: action.payload,
            teamName: `Team ${action.payload}`,
          })
        );
        console.log("✅ Logged team deletion");
      }

      if (action.type === "teams/addMember") {
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
              teamId,
            })
          );
          console.log("✅ Logged member addition");
        }
      }

      if (action.type === "teams/updateMember") {
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
                memberId: action.payload.id,
                memberName: action.payload.name || member.name,
                changes,
                teamId: member.teamId,
              })
            );
            console.log("✅ Logged member update");
          }
        }
      }

      if (action.type === "teams/deleteMember") {
        store.dispatch(
          logMemberDeleted({
            memberId: action.payload,
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
