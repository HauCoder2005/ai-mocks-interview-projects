import { MockTestResultPage } from "@/features/mock-tests/components/mock-test-result-page";

type MockTestResultRoutePageProps = {
  params: Promise<{ attemptId: string }>;
};

export default async function MockTestResultRoutePage({
  params,
}: MockTestResultRoutePageProps) {
  const { attemptId } = await params;

  return <MockTestResultPage attemptId={attemptId} />;
}
