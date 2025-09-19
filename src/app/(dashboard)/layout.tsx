import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen bg-black p-8">
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 font-mono border border-gray-700 rounded-lg overflow-hidden h-full flex flex-col">
        <NavBar />
        <main className="flex-1 flex items-center justify-between overflow-y-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
