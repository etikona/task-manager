// teams/[id]/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import {
  deleteTeam,
  updateTeam,
  deleteMember,
  updateMember,
} from "@/store/slices/teamSlice";
import {
  ArrowLeft,
  Users,
  Plus,
  Trash2,
  Edit,
  AlertTriangle,
  CheckCircle2,
  Target,
} from "lucide-react";
import EditMemberModal from "../../Components/Shared/EditMemberModal";

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = parseInt(params.id as string);

  const { teams, members } = useAppSelector((state) => state.teams);
  const { tasks } = useAppSelector((state) => state.tasks);
  const dispatch = useAppDispatch();

  const team = teams.find((t) => t.id === teamId);
  const teamMembers = members.filter((m) => m.teamId === teamId);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // Helper to get member's current task count
  const getMemberTaskCount = (memberId: number) => {
    return tasks.filter((task) => task.assignedMemberId === memberId).length;
  };

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Team not found
          </h2>
          <p className="text-gray-600 mb-6">
            The team you are looking for does not exist.
          </p>
          <Link
            href="/teams"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  const handleDeleteTeam = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this team? This will also delete all team members."
      )
    ) {
      dispatch(deleteTeam(teamId));
      router.push("/teams");
    }
  };

  const handleDeleteMember = (memberId: number) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      dispatch(deleteMember(memberId));
    }
  };

  const handleEditMember = (member: any) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const handleSaveMember = (updatedMember: any) => {
    dispatch(updateMember(updatedMember));
    setIsEditModalOpen(false);
    setSelectedMember(null);
  };

  const getTeamStats = () => {
    const totalCapacity = teamMembers.reduce(
      (sum, member) => sum + member.capacity,
      0
    );
    const totalAssignedTasks = teamMembers.reduce((sum, member) => {
      return sum + getMemberTaskCount(member.id);
    }, 0);
    const overloadedMembers = teamMembers.filter((member) => {
      const taskCount = getMemberTaskCount(member.id);
      return taskCount > member.capacity;
    });

    return {
      totalCapacity,
      totalAssignedTasks,
      overloadedMembers: overloadedMembers.length,
      utilization:
        totalCapacity > 0
          ? Math.round((totalAssignedTasks / totalCapacity) * 100)
          : 0,
    };
  };

  const stats = getTeamStats();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/teams"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Teams
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {team.name}
              </h1>
              {team.description && (
                <p className="text-gray-600 max-w-2xl">{team.description}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Link
                href={`/teams/${team.id}/add-member`}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Add Member
              </Link>
              <button
                onClick={handleDeleteTeam}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all duration-200"
              >
                <Trash2 className="w-5 h-5" />
                Delete Team
              </button>
            </div>
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-gray-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {teamMembers.length}
                </div>
                <div className="text-sm text-gray-600">Team Members</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-gray-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalCapacity}
                </div>
                <div className="text-sm text-gray-600">Total Capacity</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalAssignedTasks}
                </div>
                <div className="text-sm text-gray-600">Assigned Tasks</div>
              </div>
            </div>
          </div>

          <div
            className={`rounded-2xl shadow-sm border p-6 ${
              stats.overloadedMembers > 0
                ? "bg-red-50 border-red-200"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <AlertTriangle
                className={`w-6 h-6 ${
                  stats.overloadedMembers > 0 ? "text-red-600" : "text-gray-600"
                }`}
              />
              <div>
                <div
                  className={`text-2xl font-bold ${
                    stats.overloadedMembers > 0
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  {stats.overloadedMembers}
                </div>
                <div className="text-sm text-gray-600">Overloaded</div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Team Members
            </h2>
            <Link
              href={`/teams/${team.id}/add-member`}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </Link>
          </div>

          {teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No team members yet
              </h3>
              <p className="text-gray-600 mb-6">
                Add your first team member to get started
              </p>
              <Link
                href={`/teams/${team.id}/add-member`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                Add Member
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {teamMembers.map((member) => {
                const currentTasks = getMemberTaskCount(member.id);
                const isOverloaded = currentTasks > member.capacity;
                const isAtCapacity = currentTasks === member.capacity;

                return (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                      isOverloaded
                        ? "bg-red-50 border-red-200"
                        : "bg-gray-50 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-blue-600">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">
                            {member.name}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isOverloaded
                                ? "bg-red-100 text-red-800"
                                : isAtCapacity
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {currentTasks}/{member.capacity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {member.role}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">
                          Capacity
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {member.capacity}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-6">
                      <button
                        onClick={() => handleEditMember(member)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Capacity Warning */}
        {stats.overloadedMembers > 0 && (
          <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Capacity Warning
                </h3>
                <p className="text-red-700">
                  {stats.overloadedMembers} team member
                  {stats.overloadedMembers > 1 ? "s are" : " is"} currently
                  overloaded with tasks. Consider reassigning tasks or
                  increasing team capacity.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Member Modal */}
      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onSave={handleSaveMember}
      />
    </div>
  );
}
