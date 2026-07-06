import { MockTestAttemptPage } from "@/features/mock-tests/components/mock-test-attempt-page";

type MockTestAttemptRoutePageProps = {
  params: Promise<{ attemptId: string }>;
};

export default async function MockTestAttemptRoutePage({
  params,
}: MockTestAttemptRoutePageProps) {
  const { attemptId } = await params;

  return <MockTestAttemptPage attemptId={attemptId} />;
}
