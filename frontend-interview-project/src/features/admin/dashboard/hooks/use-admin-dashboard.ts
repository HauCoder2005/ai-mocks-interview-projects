"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  getAdminInterviewLevels,
  getAdminInterviewPositions,
  getAdminInterviewTechnologies,
  getAdminInterviewTopics,
} from "@/features/admin/interview-options/api/admin-interview-options.api";
import type { AdminInterviewOption } from "@/features/admin/interview-options/types";
import { getAdminQuestionBanks } from "@/features/admin/question-banks/api/admin-question-bank.api";
import type { AdminQuestionBank } from "@/features/admin/question-banks/types";
import { getAdminUsers, type AdminUser } from "@/features/admin/users/api/admin-users.api";

type AdminDashboardData = {
  positions: AdminInterviewOption[];
  levels: AdminInterviewOption[];
  technologies: AdminInterviewOption[];
  topics: AdminInterviewOption[];
  questionBanks: AdminQuestionBank[];
  users: AdminUser[];
};

const emptyData: AdminDashboardData = {
  positions: [],
  levels: [],
  technologies: [],
  topics: [],
  questionBanks: [],
  users: [],
};

function getQuestionType(question: AdminQuestionBank) {
  return question.type;
}

export function useAdminDashboard() {
  const query = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async (): Promise<AdminDashboardData> => {
      const [positions, levels, technologies, topics, questionBanks, users] =
        await Promise.all([
          getAdminInterviewPositions(),
          getAdminInterviewLevels(),
          getAdminInterviewTechnologies(),
          getAdminInterviewTopics(),
          getAdminQuestionBanks(),
          getAdminUsers().catch(() => {
            /*
             * TODO: Gắn API thống kê user khi backend hoàn thành endpoint.
             */
            return [];
          }),
        ]);

      return { positions, levels, technologies, topics, questionBanks, users };
    },
  });

  const data = query.data ?? emptyData;

  const summary = useMemo(() => {
    const totalMcqQuestions = data.questionBanks.filter(
      (question) => getQuestionType(question) === "MCQ",
    ).length;
    const totalTheoryQuestions = data.questionBanks.filter(
      (question) => getQuestionType(question) === "THEORY",
    ).length;
    const totalCodingQuestions = data.questionBanks.filter(
      (question) => getQuestionType(question) === "CODING",
    ).length;
    const totalCaseStudyQuestions = data.questionBanks.filter(
      (question) => getQuestionType(question) === "CASE_STUDY",
    ).length;

    return {
      totalPositions: data.positions.length,
      totalLevels: data.levels.length,
      totalTechnologies: data.technologies.length,
      totalTopics: data.topics.length,
      totalQuestionBanks: data.questionBanks.length,
      totalMcqQuestions,
      totalTheoryQuestions,
      totalCodingQuestions,
      totalCaseStudyQuestions,
      totalUsers: data.users.length,
      totalVisits: 0,
    };
  }, [data]);

  return {
    ...data,
    summary,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
