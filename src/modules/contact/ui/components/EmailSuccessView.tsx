import React from "react";
import { Button } from "@/components/ui/button";

interface EmailSuccessViewProps {
  onPress: () => void;
}

const EmailSuccessView = ({ onPress }: EmailSuccessViewProps) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900 p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-4">
          <h1 className="text-4xl font-light text-white">
            Thank you! <span className="text-2xl">🤘</span>
          </h1>
          <div className="space-y-2">
            <p className="text-gray-400 font-mono text-lg">
              Your message has been sent.
            </p>
            <p className="text-gray-400 font-mono text-lg">
              I will get back to you as soon as possible!
            </p>
          </div>
        </div>

        <Button
          onClick={onPress}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded font-mono transition-colors"
        >
          send-new-message
        </Button>
      </div>
    </div>
  );
};
export default EmailSuccessView;
