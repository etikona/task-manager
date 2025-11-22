"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@/hooks/redux";
import { Plus, Users, Calendar, ArrowRight, MoreVertical } from "lucide-react";

const TeamsPage = () => {
  const { teams, members } = useAppSelector((state) => state.teams);
  const { tasks } = useAppSelector((state) => state.tasks);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  const getTeamMembers = (teamId: number) => {
    return members.filter((member) => member.teamId === teamId);
  };

  const getMemberTaskCount = (memberId: number) => {
    return tasks.filter((task) => task.assignedMemberId === memberId).length;
  };

  const getOverloadedMembers = (teamId: number) => {
    const teamMembers = getTeamMembers(teamId);
    return teamMembers.filter((member) => {
      const taskCount = getMemberTaskCount(member.id);
      return taskCount > member.capacity;
    }).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
            <p className="text-gray-600 mt-2">Manage your teams and members</p>
          </div>
          <Link
            href="/teams/create"
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Create Team
          </Link>
        </div>

        {teams.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No teams yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first team to get started
            </p>
            <Link
              href="/teams/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Create Team
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => {
              const teamMembers = getTeamMembers(team.id);
              const overloadedCount = getOverloadedMembers(team.id);

              return (
                <div
                  key={team.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {team.name}
                      </h3>
                      {team.description && (
                        <p className="text-gray-600 text-sm mb-4">
                          {team.description}
                        </p>
                      )}
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Users className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-gray-900">
                        {teamMembers.length}
                      </div>
                      <div className="text-xs text-gray-600">Members</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                      <div
                        className={`text-2xl font-bold ${
                          overloadedCount > 0 ? "text-red-600" : "text-gray-900"
                        }`}
                      >
                        {overloadedCount}
                      </div>
                      <div className="text-xs text-gray-600">Overloaded</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Members
                    </h4>
                    <div className="space-y-2">
                      {teamMembers.slice(0, 3).map((member) => {
                        const currentTasks = getMemberTaskCount(member.id);
                        return (
                          <div
                            key={member.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-gray-900">{member.name}</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                currentTasks > member.capacity
                                  ? "bg-red-100 text-red-800"
                                  : currentTasks === member.capacity
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {currentTasks}/{member.capacity}
                            </span>
                          </div>
                        );
                      })}
                      {teamMembers.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{teamMembers.length - 3} more members
                        </div>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/teams/${team.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                  >
                    View Team
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;
