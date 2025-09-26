import React from "react";
import { User } from "@/modules/types";
import Image from "next/image";

interface BioViewProps {
  user: User;
}

const BioView = ({ user }: BioViewProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full h-full flex-1 flex justify-center items-center p-8 ">
      <div className="relative flex items-start gap-0 max-w-4xl">
        {/* Profile Image or Initials - Behind */}
        <div className="relative flex-shrink-0">
          <div className="bg-slate-700 rounded-3xl p-8 pr-32">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.name}
                width={224}
                height={256}
                className="w-56 h-64 object-cover rounded-2xl"
              />
            ) : (
              <div className="w-56 h-64 rounded-2xl bg-gray-700 flex items-center justify-center">
                <span className="text-6xl font-bold text-gray-300">
                  {user.name ? getInitials(user.name) : "?"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bio Content - White Card Overlapping Image (In Front) */}
        <div className="bg-slate-400 rounded-3xl p-10 -ml-24 mt-16 shadow-lg flex-1 min-w-[400px] z-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {user.name || "Anonymous"}
          </h2>
          <h3 className="text-xl font-semibold mb-2">{user.title}</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            {user.bio
              ? user.bio.split("\n").map((paragraph, index) => (
                  <span key={index}>
                    {paragraph}
                    {index < user.bio!.split("\n").length - 1 && (
                      <>
                        <br />
                        <br />
                      </>
                    )}
                  </span>
                ))
              : "No bio available"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BioView;
