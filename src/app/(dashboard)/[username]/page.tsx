import HomePage from "@/app/(dashboard)/[username]/home/page";

interface DashboardPageProps {
  params: Promise<{ username: string }>;
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  return <HomePage params={params} />;
};

export default DashboardPage;
