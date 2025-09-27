import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { BriefcaseBusiness, MapPin } from "lucide-react";
import { WorkExperience } from "@/modules/types";
import Loading from "@/components/Loading";

interface WorkExperienceViewProps {
  workExperiences?: WorkExperience[];
}

const WorkExperienceView = ({ workExperiences }: WorkExperienceViewProps) => {
  if (workExperiences === undefined) {
    return <Loading />;
  }

  const sortedExperiences = [...workExperiences].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  const getTypeColor = (type: string) => {
    const colors: Record<string, { bg: string; border: string }> = {
      "full-time": { bg: "#3b82f6", border: "#2563eb" },
      "part-time": { bg: "#8b5cf6", border: "#7c3aed" },
      contract: { bg: "#10b981", border: "#059669" },
      internship: { bg: "#f59e0b", border: "#d97706" },
      freelance: { bg: "#ec4899", border: "#db2777" },
      consulting: { bg: "#06b6d4", border: "#0891b2" },
      other: { bg: "#6b7280", border: "#4b5563" },
    };
    return colors[type] || colors.other;
  };

  // Format date range
  const formatDateRange = (startDate: string, endDate?: string) => {
    const formatDate = (date: string) => {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : "Present";
    return `${start} - ${end}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 px-8 pt-4">
        <h2 className="text-3xl font-bold text-orange-400 mb-2">
          Work Experience
        </h2>
        <p className="text-slate-400">
          My professional journey and career progression
        </p>
      </div>

      <VerticalTimeline lineColor="#e5e7eb">
        {sortedExperiences.map((exp) => {
          const colors = getTypeColor(exp.type);

          return (
            <VerticalTimelineElement
              key={exp._id}
              date={formatDateRange(exp.startDate, exp.endDate)}
              dateClassName="text-slate-200 !font-semibold"
              iconStyle={{
                background: colors.bg,
              }}
              icon={
                exp.logoUrl ? (
                  <div className="flex justify-center items-center w-full h-full">
                    <img
                      src={exp.logoUrl}
                      alt={exp.company}
                      className="size-[60%] object-contain"
                    />
                  </div>
                ) : (
                  <BriefcaseBusiness
                    className="size-[60%] text-white"
                    size={24}
                  />
                )
              }
              contentStyle={{
                borderBottom: `4px solid ${colors.border}`,
                boxShadow: "none",
                borderRadius: "8px",
                padding: "1rem 2rem",
                flex: "1",
                backgroundColor: "#1d293d",
              }}
              contentArrowStyle={{ borderRight: `7px solid ${colors.border}` }}
            >
              <div className="flex flex-col bg-slate-800">
                <div className="flex flex-col gap-0">
                  <p className="text-xl font-semibold text-gray-200">
                    {exp.position}
                  </p>
                  <p className="text-lg font-medium text-gray-400 !mt-0">
                    {exp.company}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white capitalize"
                    style={{ backgroundColor: colors.bg }}
                  >
                    {exp.type}
                  </span>
                  {exp.location && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                      <MapPin size={16} />{" "}
                      <span className="ml-1">{exp.location}</span>
                    </span>
                  )}
                </div>

                {exp.description && (
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {exp.description}
                  </p>
                )}

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="mt-6 mb-3">
                    <ul className="list-disc ml-5 space-y-1">
                      {exp.responsibilities.map((responsibility, index) => (
                        <li
                          key={index}
                          className="text-slate-400 text-sm leading-relaxed"
                        >
                          {responsibility}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </VerticalTimelineElement>
          );
        })}
      </VerticalTimeline>
    </div>
  );
};
export default WorkExperienceView;
