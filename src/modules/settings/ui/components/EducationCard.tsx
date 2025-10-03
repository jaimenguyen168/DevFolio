import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Education } from "@/modules/types";
import { renderEducationTypeLabel } from "@/modules/settings/constants";

interface EducationCardProps {
  education: Education;
  onEdit: (education: Education) => void;
  onDelete: (id: string) => void;
}

const EducationCard = ({ education, onEdit, onDelete }: EducationCardProps) => {
  const getTypeBadgeColor = (type: string) => {
    const colors = {
      "high-school": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      college: "bg-green-500/20 text-green-400 border-green-500/30",
      university: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      certification: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      bootcamp: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      "online-course": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    };
    return colors[type as keyof typeof colors] || colors["university"];
  };

  return (
    <Card className="bg-slate-900 border-gray-700 hover:border-orange-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 py-3">
      <CardContent className="p-4 sm:p-6">
        {/* Header with Logo and Institution Info */}
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          {education.logoUrl ? (
            <div className="relative size-12 sm:size-14 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
              <Image
                src={education.logoUrl}
                alt={education.institution}
                width={500}
                height={500}
                className="object-cover size-full"
              />
            </div>
          ) : (
            <div className="size-12 sm:size-14 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="h-6 w-6 text-gray-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-white truncate">
              {education.institution}
            </h3>
            {education.degree && (
              <p className="text-sm sm:text-base text-orange-400 font-medium truncate">
                {education.degree}
              </p>
            )}
            {education.field && (
              <p className="text-xs sm:text-sm text-gray-400 truncate">
                {education.field}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons and Type Badge Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge
            className={`${getTypeBadgeColor(education.type)} text-xs`}
            variant="outline"
          >
            {renderEducationTypeLabel(education.type)}
          </Badge>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(education)}
              className="text-gray-400 hover:text-orange-400 hover:bg-gray-800 h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(education._id)}
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
              {education.startYear && `${education.startYear} - `}
              {education.endYear ? education.endYear : "Present"}
            </span>
          </div>
          {education.location && (
            <div className="flex items-center">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{education.location}</span>
            </div>
          )}
        </div>

        {/* Grade and GPA */}
        {(education.grade || education.gpa) && (
          <div className="flex items-center gap-4 mb-4 text-xs sm:text-sm">
            {education.grade && (
              <div className="flex items-center text-gray-400">
                <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 flex-shrink-0" />
                <span className="truncate">{education.grade}</span>
              </div>
            )}
            {education.gpa && (
              <div className="flex items-center text-gray-400">
                <span className="font-semibold text-orange-400 mr-1">GPA:</span>
                <span>{education.gpa.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        {/* Details */}
        {education.details && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-gray-400 text-xs sm:text-sm line-clamp-3">
              {education.details}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationCard;
