import { redirect } from "next/navigation";

import { appRoutes } from "@/lib/constants/app-routes";

export default function InterviewPage() {
  redirect(appRoutes.userInterviewSetup);
}
