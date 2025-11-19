import { TeamMember } from "@/types";
import { Task } from "@/types";

export const calculateMemberLoad = (
  member: TeamMember,
  tasks: Task[]
): number => {
  const memberTasks = tasks.filter(
    (task) => task.assignedMemberId === member.id
  ).length;
  return memberTasks;
};

export const getAvailableMembers = (
  members: TeamMember[],
  tasks: Task[]
): Array<{
  member: TeamMember;
  currentTasks: number;
  availableCapacity: number;
  loadPercentage: number;
}> => {
  return members.map((member) => {
    const currentTasks = calculateMemberLoad(member, tasks);
    const availableCapacity = Math.max(0, member.capacity - currentTasks);
    const loadPercentage =
      member.capacity > 0 ? (currentTasks / member.capacity) * 100 : 0;

    return {
      member,
      currentTasks,
      availableCapacity,
      loadPercentage,
    };
  });
};

export const findBestMember = (
  members: TeamMember[],
  tasks: Task[]
): TeamMember | null => {
  const availableMembers = getAvailableMembers(members, tasks);

  const membersWithCapacity = availableMembers.filter(
    (m) => m.availableCapacity > 0
  );

  if (membersWithCapacity.length > 0) {
    const sortedMembers = membersWithCapacity.sort(
      (a, b) => a.currentTasks - b.currentTasks
    );
    return sortedMembers[0].member;
  }

  const sortedByLoad = availableMembers.sort(
    (a, b) => a.loadPercentage - b.loadPercentage
  );
  return sortedByLoad[0]?.member || null;
};
