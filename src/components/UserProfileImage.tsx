import React from "react";
import { User } from "@/modules/types";
import Image from "next/image";

interface UserProfileImageProps {
  user: User;
}

const UserProfileImage = ({ user }: UserProfileImageProps) => {
  return (
    <div className="rounded-full bg-gray-700 hover:bg-gray-600 border border-gray-600 transition-colors flex items-center justify-center w-full h-full">
      {user.imageUrl ? (
        <Image
          src={user.imageUrl}
          alt="profile image"
          width={50}
          height={50}
          className="rounded-full object-cover w-full h-full"
        />
      ) : (
        <span className="lg:text-4xl text-white font-semibold text-2xl">
          {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
};

export default UserProfileImage;
