import { MockTestDetailPage } from "@/features/mock-tests/components/mock-test-detail-page";

type MockTestDetailRoutePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MockTestDetailRoutePage({
  params,
}: MockTestDetailRoutePageProps) {
  const { slug } = await params;

  return <MockTestDetailPage slug={slug} />;
}
