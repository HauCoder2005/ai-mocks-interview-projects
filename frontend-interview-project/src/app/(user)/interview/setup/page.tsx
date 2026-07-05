"use client";
import { Suspense } from "react";
import { PageLoading } from "@/components/common/page-loading";
import { InterviewSetupForm } from "@/features/user/interview/components/interview-setup-form";
import styles from "@/features/user/interview/components/interview.module.css";

export default function InterviewSetupPage() {
  return (
    <div className={styles.page}>
      <Suspense fallback={<PageLoading />}>
        <InterviewSetupForm />
      </Suspense>
    </div>
  );
}
