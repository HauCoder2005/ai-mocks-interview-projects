import { apiRequest } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/api-endpoints";
import type { AdminInterviewOption } from "@/features/admin/interview-options/types";

export type CreateAdminInterviewOptionPayload = {
  name: string;
  code?: string;
  slug?: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
};

export type UpdateAdminInterviewOptionPayload = Partial<CreateAdminInterviewOptionPayload>;

const interviewMasterData = apiEndpoints.admin.interviewMasterData;

const endpointByType = {
  position: interviewMasterData.positions,
  level: interviewMasterData.levels,
  technology: interviewMasterData.technologies,
  topic: interviewMasterData.topics,
};

export function getAdminInterviewPositions() {
  return apiRequest<AdminInterviewOption[]>({
    method: "GET",
    url: interviewMasterData.positions.list,
  });
}

export function createAdminInterviewPosition(payload: CreateAdminInterviewOptionPayload) {
  return apiRequest<AdminInterviewOption>({
    method: "POST",
    url: interviewMasterData.positions.create,
    data: payload,
  });
}

export function updateAdminInterviewPosition(
  id: string,
  payload: UpdateAdminInterviewOptionPayload,
) {
  return apiRequest<AdminInterviewOption>({
    method: "PATCH",
    url: interviewMasterData.positions.update(id),
    data: payload,
  });
}

export function activateAdminInterviewPosition(id: string) {
  return apiRequest<AdminInterviewOption>({
    method: "PATCH",
    url: interviewMasterData.positions.activate(id),
  });
}

export function deactivateAdminInterviewPosition(id: string) {
  return apiRequest<AdminInterviewOption>({
    method: "PATCH",
    url: interviewMasterData.positions.deactivate(id),
  });
}

export function deleteAdminInterviewPosition(id: string) {
  return deactivateAdminInterviewPosition(id);
}

export function getAdminInterviewLevels() {
  return apiRequest<AdminInterviewOption[]>({
    method: "GET",
    url: interviewMasterData.levels.list,
  });
}

export function createAdminInterviewLevel(payload: CreateAdminInterviewOptionPayload) {
  return apiRequest<AdminInterviewOption>({
    method: "POST",
    url: interviewMasterData.levels.create,
    data: payload,
  });
}

export function updateAdminInterviewLevel(id: string, payload: UpdateAdminInterviewOptionPayload) {
  return apiRequest<AdminInterviewOption>({
    method: "PATCH",
    url: interviewMasterData.levels.update(id),
    data: payload,
  });
}

export function activateAdminInterviewLevel(id: string) {
  return apiRequest<AdminInterviewOption>({
    method: "PATCH",
    url: interviewMasterData.levels.activate(id),
  });
}

export function deactivateAdminInterviewLevel(id: string) {
  return apiRequest<AdminInterviewOption>({
    method: "PATCH",
    url: interviewMasterData.levels.deactivate(id),
  });
}

export function deleteAdminInterviewLevel(id: string) {
  return deactivateAdminInterviewLevel(id);
}

export function getAdminInterviewTechnologies() {
  return apiRequest<AdminInterviewOption[]>({
    method: "GET",
    url: interviewMasterData.technologies.list,
  });
}

export function createAdminInterviewTechnology(payload: CreateAdminInterviewOptionPayload) {
  return apiRequest<AdminInterviewOption>({
    method: "POST",
    url: interviewMasterData.technologies.create,
    data: payload,
  });
}

export function updateAdminInterviewTechnology(
  id: string,
  payload: UpdateAdminInterviewOptionPayload,
) {
  return apiRequest<AdminInterviewOption>({
    method: "PATCH",
    url: interviewMasterData.technologies.update(id),
    data: payload,
  });
}

export function activateAdminInterviewTechnology(id: string) {
  return apiRequest<AdminInterviewOption>({
    method: "PATCH",
    url: interviewMasterData.technologies.activate(id),
  });
}

export function deactivateAdminInterviewTechnology(id: string) {
  return apiRequest<AdminInterviewOption>({
    method: "PATCH",
    url: interviewMasterData.technologies.deactivate(id),
  });
}

export function deleteAdminInterviewTechnology(id: string) {
  return deactivateAdminInterviewTechnology(id);
}

export function getAdminInterviewTopics() {
  return apiRequest<AdminInterviewOption[]>({
    method: "GET",
    url: interviewMasterData.topics.list,
  });
}

export function createAdminInterviewTopic(payload: CreateAdminInterviewOptionPayload) {
  return apiRequest<AdminInterviewOption>({
    method: "POST",
    url: interviewMasterData.topics.create,
    data: payload,
  });
}

export function updateAdminInterviewTopic(id: string, payload: UpdateAdminInterviewOptionPayload) {
  return apiRequest<AdminInterviewOption>({
    method: "PATCH",
    url: interviewMasterData.topics.update(id),
    data: payload,
  });
}

export function activateAdminInterviewTopic(id: string) {
  return apiRequest<AdminInterviewOption>({
    method: "PATCH",
    url: interviewMasterData.topics.activate(id),
  });
}

export function deactivateAdminInterviewTopic(id: string) {
  return apiRequest<AdminInterviewOption>({
    method: "PATCH",
    url: interviewMasterData.topics.deactivate(id),
  });
}

export function deleteAdminInterviewTopic(id: string) {
  return deactivateAdminInterviewTopic(id);
}

export const adminInterviewOptionsApi = {
  list(type: AdminInterviewOption["type"]) {
    return apiRequest<AdminInterviewOption[]>({
      method: "GET",
      url: endpointByType[type].list,
    });
  },
};
