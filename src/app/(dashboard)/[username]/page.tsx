import { redirect } from "next/navigation";

interface DashboardPageProps {
  params: Promise<{ username: string }>;
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const { username } = await params;

  return redirect(`/${username}/home`);
};

export default DashboardPage;
