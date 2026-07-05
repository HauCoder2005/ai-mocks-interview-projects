"use client";

import { useParams } from "next/navigation";

import { InterviewChatSession } from "@/features/user/interview/components/interview-chat-session";

export default function InterviewSessionPage() {
  const params = useParams<{ sessionId: string }>();

  return <InterviewChatSession sessionId={params.sessionId} />;
}
