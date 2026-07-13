import { MockTestDetailPage } from "@/features/mock-tests";

type MockTestDetailRoutePageProps = {
  params: Promise<{ id: string }>;
};

export default async function MockTestDetailRoutePage({
  params,
}: MockTestDetailRoutePageProps) {
  const { id } = await params;

  return <MockTestDetailPage id={id} />;
}
