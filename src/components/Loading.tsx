import React from "react";
import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex flex-1 items-center justify-center h-screen text-white">
      <Loader2 className="animate-spin" size={36} />
    </div>
  );
};
export default Loading;
