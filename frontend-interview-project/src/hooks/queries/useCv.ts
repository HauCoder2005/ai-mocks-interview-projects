"use client";

import { useMutation } from "@tanstack/react-query";

import { axiosClient } from "@/src/lib/api/axiosClient";
import type { SuccessResponse } from "@/src/types/api";

type UploadCvPayload = {
  file: File;
};

export type UploadCvResponseData = {
  reviewId?: string;
  status?: string;
};

export type UploadCvResponse = SuccessResponse<UploadCvResponseData>;

export const useUploadCvMutation = () => {
  return useMutation<UploadCvResponse, Error, UploadCvPayload>({
    mutationFn: async ({ file }: UploadCvPayload) => {
      const formData = new FormData();
      formData.append("file", file);

      return axiosClient.post<UploadCvResponse, FormData>(
        "/cv-reviews/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    },
  });
};
