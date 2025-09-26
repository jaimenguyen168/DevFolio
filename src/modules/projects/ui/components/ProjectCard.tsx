import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Project } from "@/modules/types";
import { Card, CardContent } from "@/components/ui/card";
import { getTechInfo } from "@/modules/projects/lib/techStacks";
import { motion } from "motion/react";
import { fetchRepoInfo } from "@/modules/projects/lib/github";
import { GitForkIcon, Loader2, Star } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { convertName } from "@/lib/utils";

const TECH_CUTOFF = 3;

interface ProjectCardProps {
  project: Project;
  onViewProject: () => void;
  delay?: number;
  index?: number;
}

const ProjectCard = ({
  project,
  onViewProject,
  delay = 0,
  index = 0,
}: ProjectCardProps) => {
  const { name, description, techStack, githubUrl, imageUrls } = project;

  const [repoData, setRepoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (githubUrl) {
      fetchRepoInfo(githubUrl)
        .then((data) => {
          setRepoData(data);
        })
        .catch((error) => {
          console.error("Failed to fetch repo info:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [githubUrl]);

  const mainImage = imageUrls?.[0];
  const adjustedName = convertName(name);

  if (loading) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
    >
      <div className="flex flex-col space-y-4 m-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-blue-400 font-medium">
              Project {index + 1}
            </span>
            <span className="text-gray-500">//</span>
            <span className="text-gray-400 line-clamp-1">{adjustedName}</span>
          </div>
        </div>

        <Card className="bg-slate-900 border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 animate-in slide-in-from-bottom-4 fade-in py-0">
          <CardContent className="p-0">
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-tr from-slate-700 to-slate-800">
              {/* Placeholder for now since image isn't in your data structure */}
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt="image background"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center">
                  <span className="text-gray-400 font-medium">{name}</span>
                </div>
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-black/60" />
              {githubUrl && repoData && (
                <Link
                  href={githubUrl}
                  className="absolute top-4 left-4 flex items-center space-x-2"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <button className="rounded-full bg-indigo-200 backdrop-blur-sm flex items-center justify-center shadow-lg transition-transform hover:scale-110 gap-2 py-0.5 px-2">
                    <FaGithub size={16} />
                    <span>{repoData.star || 0}</span>
                    <Star size={16} />
                  </button>
                </Link>
              )}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                {(techStack || []).slice(0, TECH_CUTOFF).map((tech, index) => {
                  const techInfo = getTechInfo(tech);
                  const IconComponent = techInfo.icon;
                  return (
                    <div
                      key={index}
                      className="size-7 rounded-full bg-indigo-200 backdrop-blur-sm flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                    >
                      <IconComponent size={16} />
                    </div>
                  );
                })}
                {techStack && techStack.length > TECH_CUTOFF && (
                  <div className="size-7 rounded-full bg-indigo-200 backdrop-blur-sm flex items-center justify-center shadow-lg text-xs font-semibold text-indigo-900">
                    +{techStack.length - 3}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-y-6">
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                {description}
              </p>

              <div className="flex items-center justify-between">
                <Button
                  onClick={onViewProject}
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-200 hover:shadow-md"
                >
                  view-project
                </Button>

                {githubUrl &&
                  (loading ? (
                    <div className="flex items-center justify-center w-12 h-6 text-gray-400 hover:bg-gray-700">
                      <Loader2 size={16} className="animate-spin" />
                    </div>
                  ) : (
                    repoData && (
                      <div className="flex items-center space-x-2 p-1 text-slate-500 hover:text-slate-400 transition-colors">
                        <GitForkIcon size={16} />
                        <span>{repoData.forks || 0}</span>
                      </div>
                    )
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
