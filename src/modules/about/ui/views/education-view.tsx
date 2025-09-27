import React from "react";
import { Education } from "@/modules/types";
import Image from "next/image";
import { Award, BookOpen, Calendar, GraduationCap, MapPin } from "lucide-react";
import Loading from "@/components/Loading";

interface EducationViewProps {
  educations?: Education[];
}

const EducationView = ({ educations }: EducationViewProps) => {
  const getEducationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "high-school": "High School",
      university: "University",
      certification: "Certification",
      bootcamp: "Bootcamp",
      "online-course": "Online Course",
    };
    return labels[type] || type;
  };

  const formatYearRange = (education: Education) => {
    if (!education.startYear && !education.endYear) return null;

    const start = education.startYear || "Unknown";
    const end = education.endYear || "Present";
    return `${start} - ${end}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDescription = (description?: string) => {
    if (!description) return null;

    const paragraphs = description.split(/\\n|\n/);

    return paragraphs.map((paragraph, index, array) => (
      <React.Fragment key={index}>
        {paragraph}
        {index < array.length - 1 && (
          <>
            <br />
            <br />
          </>
        )}
      </React.Fragment>
    ));
  };

  const sortedEducations = educations
    ? [...educations].sort((a, b) => {
        if (!a.endYear) return -1;
        if (!b.endYear) return 1;

        return b.endYear - a.endYear;
      })
    : [];

  if (educations === undefined) {
    return <Loading />;
  }

  if (!educations || educations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">No education records found</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-start p-8 lg:p-16">
      <div className="max-w-4xl w-full space-y-12">
        {sortedEducations.map((education) => (
          <div key={education._id} className="w-full">
            {/* Header Section with Logo */}
            <div className="flex flex-row gap-6 items-start sm:items-center mb-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                {education.logoUrl ? (
                  <Image
                    src={education.logoUrl}
                    alt={education.institution}
                    width={80}
                    height={80}
                    className="size-24 lg:size-20 object-contain rounded bg-slate-200 p-1"
                  />
                ) : (
                  <div className="size-24 lg:size-20 rounded-lg bg-slate-700 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-300">
                      {getInitials(education.institution)}
                    </span>
                  </div>
                )}
              </div>

              {/* Institution Info */}
              <div className="flex-1 flex flex-col xl:flex-row gap-2 xl:w-full xl:justify-between items-start">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <h1 className="text-xl lg:text-3xl font-bold text-white mb-1">
                      {education.institution}
                    </h1>
                    <p className="text-orange-400 text-sm font-medium">
                      {getEducationTypeLabel(education.type)}
                    </p>
                  </div>
                </div>

                {formatYearRange(education) && (
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <Calendar size={14} />
                    {formatYearRange(education)}
                  </span>
                )}
              </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-slate-800 rounded-xl p-6 lg:p-8 space-y-6 grid grid-cols-1 lg:grid-cols-2">
              <div className="flex flex-col gap-6 col-span-1">
                {/* Degree & Field */}
                {(education.degree || education.field) && (
                  <div className="flex items-start gap-3">
                    <GraduationCap
                      className="text-orange-400 mt-0.5"
                      size={20}
                    />
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        {education.degree || "Degree"}
                      </h3>
                      {education.field && (
                        <p className="text-gray-400 text-sm">
                          {education.field}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Location */}
                {education.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="text-orange-400 mt-0.5" size={20} />
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        Location
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {education.location}
                      </p>
                    </div>
                  </div>
                )}

                {/* Grade/GPA */}
                {(education.grade || education.gpa) && (
                  <div className="flex items-start gap-3">
                    <Award className="text-orange-400 mt-0.5" size={20} />
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        Academic Performance
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {education.grade && education.grade}
                        {education.grade && education.gpa && " • "}
                        {education.gpa && `GPA: ${education.gpa.toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Details */}
              {education.details && (
                <div className="flex items-start gap-3">
                  <BookOpen className="text-orange-400 mt-0.5" size={20} />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">
                      My Journey
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm">
                      {formatDescription(education.details)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline Indicator */}
            <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
              <div className="h-px flex-1 bg-gray-700"></div>
              <span>Education Record</span>
              <div className="h-px flex-1 bg-gray-700"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationView;
