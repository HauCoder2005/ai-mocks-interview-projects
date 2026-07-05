import { Suspense } from "react";

import { PageLoading } from "@/components/common/page-loading";
import { UserInterviewPage } from "@/features/user/interview/components/user-interview-page";

export default function InterviewPracticePage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <UserInterviewPage />
    </Suspense>
  );
}
