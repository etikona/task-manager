import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { reassignTasks } from "@/store/slices/taskSlice";
import { logTaskReassigned } from "@/store/slices/activitySlice";

export const useTaskReassignment = () => {
  const dispatch = useAppDispatch();
  const { members } = useAppSelector((state) => state.teams);
  const { projects } = useAppSelector((state) => state.projects);
  const { tasks } = useAppSelector((state) => state.tasks);

  const handleReassignTasks = () => {
    dispatch(
      reassignTasks({
        members,
        onReassignment: (reassignments) => {
          // Log each reassignment to activity
          reassignments.forEach((reassignment) => {
            const task = tasks.find((t) => t.id === reassignment.taskId);
            const project = projects.find((p) => p.id === task?.projectId);

            dispatch(
              logTaskReassigned({
                taskId: reassignment.taskId,
                taskTitle: reassignment.taskTitle,
                fromMember: reassignment.fromMemberName,
                toMember: reassignment.toMemberName,
                projectId: project?.id,
                projectName: project?.name,
              })
            );
          });
        },
      })
    );

    return reassignments.length;
  };

  return { handleReassignTasks };
};
