import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, MapPin, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { WorkExperience } from "@/modules/types";

interface WorkExperienceCardProps {
  experience: WorkExperience;
  onEdit: (experience: WorkExperience) => void;
  onDelete: (id: string) => void;
}

const WorkExperienceCard = ({
  experience,
  onEdit,
  onDelete,
}: WorkExperienceCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const getTypeBadgeColor = (type: string) => {
    const colors = {
      "full-time": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "part-time": "bg-green-500/20 text-green-400 border-green-500/30",
      contract: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      internship: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      freelance: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      consulting: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      other: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  return (
    <Card className="bg-slate-900 border-gray-700 hover:border-orange-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
      <CardContent className="p-4 sm:p-6">
        {/* Header with Logo and Company Info */}
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          {experience.logoUrl ? (
            <div className="relative size-12 sm:size-14 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
              <Image
                src={experience.logoUrl}
                alt={experience.company}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="size-12 sm:size-14 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-6 w-6 text-gray-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-white truncate">
              {experience.position}
            </h3>
            <p className="text-sm sm:text-base text-orange-400 font-medium truncate">
              {experience.company}
            </p>
          </div>
        </div>

        {/* Action Buttons and Type Badge Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge
            className={`${getTypeBadgeColor(experience.type)} text-xs`}
            variant="outline"
          >
            {experience.type}
          </Badge>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(experience)}
              className="text-gray-400 hover:text-orange-400 hover:bg-gray-800 h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(experience._id)}
              className="text-gray-400 hover:text-red-400 hover:bg-gray-800 h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Date and Location */}
        <div className="flex flex-col space-y-2 mb-4 text-xs sm:text-sm text-gray-400">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {formatDate(experience.startDate)} -{" "}
              {experience.endDate ? formatDate(experience.endDate) : "Present"}
            </span>
          </div>
          {experience.location && (
            <div className="flex items-center">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{experience.location}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {experience.description && (
          <p className="text-gray-400 text-xs sm:text-sm mb-4 line-clamp-3">
            {experience.description}
          </p>
        )}

        {/* Responsibilities */}
        {experience.responsibilities &&
          experience.responsibilities.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">
                Key Responsibilities
              </p>
              <ul className="space-y-1">
                {experience.responsibilities.slice(0, 3).map((resp, idx) => (
                  <li
                    key={idx}
                    className="text-gray-400 text-xs sm:text-sm flex items-start"
                  >
                    <span className="text-orange-400 mr-2 flex-shrink-0">
                      •
                    </span>
                    <span className="line-clamp-1">{resp}</span>
                  </li>
                ))}
                {experience.responsibilities.length > 3 && (
                  <li className="text-gray-500 text-xs italic">
                    +{experience.responsibilities.length - 3} more
                  </li>
                )}
              </ul>
            </div>
          )}
      </CardContent>
    </Card>
  );
};

export default WorkExperienceCard;
