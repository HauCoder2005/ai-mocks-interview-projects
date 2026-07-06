import { useCallback, useEffect, useState } from "react";

import { interviewOptionsService } from "@/lib/api/services/interview/interview-options/interview-options.service";
import {
  InterviewLevelDto,
  InterviewPositionDto,
  InterviewTechnologyDto,
  InterviewTopicDto,
} from "@/lib/api/services/interview/interview-options/interview-options.dto";

function sortActiveOptions<T extends { isActive: boolean; displayOrder: number }>(
  items: T[],
) {
  return items
    .filter((item) => item.isActive)
    .sort((firstItem, secondItem) => firstItem.displayOrder - secondItem.displayOrder);
}

export function useInterviewOptions() {
  const [levels, setLevels] = useState<InterviewLevelDto[]>([]);
  const [positions, setPositions] = useState<InterviewPositionDto[]>([]);
  const [technologies, setTechnologies] = useState<InterviewTechnologyDto[]>([]);
  const [topics, setTopics] = useState<InterviewTopicDto[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDataInterviewOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const [
        levelsResponse,
        positionsResponse,
        technologiesResponse,
        topicsResponse,
      ] = await Promise.all([
        interviewOptionsService.getInterviewLevels(),
        interviewOptionsService.getInterviewPositions(),
        interviewOptionsService.getInterviewTechnologies(),
        interviewOptionsService.getInterviewTopics(),
      ]);

      setLevels(sortActiveOptions(levelsResponse.data));
      setPositions(sortActiveOptions(positionsResponse.data));
      setTechnologies(sortActiveOptions(technologiesResponse.data));
      setTopics(sortActiveOptions(topicsResponse.data));
    } catch (error) {
      setLevels([]);
      setPositions([]);
      setTechnologies([]);
      setTopics([]);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể tải dữ liệu phỏng vấn.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      fetchDataInterviewOptions();
    });
  }, [fetchDataInterviewOptions]);

  return {
    levels,
    positions,
    technologies,
    topics,
    isLoading,
    errorMessage,
    fetchDataInterviewOptions,
  };
}
