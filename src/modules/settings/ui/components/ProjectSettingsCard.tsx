import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderGit2,
  Edit,
  Trash2,
  ExternalLink,
  Code2,
  Image as ImageIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Project } from "@/modules/types";
import { FaGithub } from "react-icons/fa";

interface ProjectSettingsCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectSettingsCard = ({
  project,
  onEdit,
  onDelete,
}: ProjectSettingsCardProps) => {
  return (
    <Card className="bg-slate-900 border-gray-700 hover:border-orange-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 py-3">
      <CardContent className="p-4 sm:p-6">
        {/* Header with Image and Project Info */}
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          {project.imageUrls && project.imageUrls.length > 0 ? (
            <div className="relative size-12 sm:size-14 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
              <Image
                src={project.imageUrls[0]}
                alt={project.name}
                width={500}
                height={500}
                className="object-cover size-full"
              />
            </div>
          ) : (
            <div className="size-12 sm:size-14 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
              <FolderGit2 className="h-6 w-6 text-gray-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-white truncate">
              {project.name}
            </h3>
            {project.slug && (
              <p className="text-xs sm:text-sm text-gray-400 truncate">
                /{project.slug}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons and Links Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1">
            {project.url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(project.url, "_blank")}
                className="text-gray-400 hover:text-orange-400 hover:bg-gray-800 h-8 w-8 p-0"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            {project.githubUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(project.githubUrl, "_blank")}
                className="text-gray-400 hover:text-orange-400 hover:bg-gray-800 h-8 w-8 p-0"
              >
                <FaGithub className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(project)}
              className="text-gray-400 hover:text-orange-400 hover:bg-gray-800 h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(project._id)}
              className="text-gray-400 hover:text-red-400 hover:bg-gray-800 h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <div className="mb-4">
            <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">
              {project.description}
            </p>
          </div>
        )}

        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Code2 className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-xs sm:text-sm font-medium text-gray-300">
                Tech Stack
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, index) => (
                <Badge
                  key={index}
                  className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs"
                  variant="outline"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {project.features && project.features.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Key Features
            </p>
            <ul className="space-y-1">
              {project.features.slice(0, 3).map((feature, index) => (
                <li
                  key={index}
                  className="text-gray-400 text-xs sm:text-sm flex items-start"
                >
                  <span className="text-orange-400 mr-2">•</span>
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
            {project.features.length > 3 && (
              <p className="text-xs text-gray-500 mt-2">
                +{project.features.length - 3} more features
              </p>
            )}
          </div>
        )}

        {/* Image Count Indicator */}
        {project.imageUrls && project.imageUrls.length > 1 && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
              <ImageIcon className="h-3.5 w-3.5" />
              <span>{project.imageUrls.length} images</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectSettingsCard;
