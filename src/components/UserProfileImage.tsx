import React from "react";
import { User } from "@/modules/types";
import Image from "next/image";

interface UserProfileImageProps {
  user: User;
}

const UserProfileImage = ({ user }: UserProfileImageProps) => {
  return (
    <div className="rounded-full bg-gray-700 hover:bg-gray-600 border border-gray-600 p-0 transition-colors">
      {user.imageUrl ? (
        <Image
          src={user.imageUrl}
          alt="profile image"
          width={50}
          height={50}
          className="rounded-full object-cover size-full"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-white font-semibold">
          {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default UserProfileImage;
