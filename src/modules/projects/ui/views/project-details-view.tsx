"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTechInfo } from "@/modules/projects/lib/techStacks";
import { motion } from "motion/react";
import { fetchRepoInfo } from "@/modules/projects/lib/github";
import {
  ExternalLink,
  GitFork,
  Star,
  Code2,
  X,
  PanelRight,
  Info,
  Calendar,
  GitBranch,
  Activity,
  GitCommit,
  User,
  Hash,
  Globe,
  Clock,
  CheckCircle,
  Circle,
  ListChecks,
  ScrollText,
  Scroll,
  Eye,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { convertName, formatFullDate, formatRelativeTime } from "@/lib/utils";
import NotFoundView from "@/modules/auth/ui/views/not-found-view";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { calculateLanguagePercentages } from "@/lib/git/utils";
import { GitHubRepoData } from "@/app/api/github/route";
import Loading from "@/components/Loading";

interface ProjectDetailsViewProps {
  username: string;
  slug: string;
}

const ProjectDetailsView = ({ username, slug }: ProjectDetailsViewProps) => {
  const project = useQuery(api.functions.projects.getProjectBySlug, {
    slug,
  });

  const [repoData, setRepoData] = useState<GitHubRepoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (project?.githubUrl) {
      fetchRepoInfo(project.githubUrl)
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
  }, [project?.githubUrl]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (project === undefined || loading) {
    return <Loading />;
  }

  if (!project) {
    return <NotFoundView />;
  }

  const {
    name,
    description,
    techStack,
    githubUrl,
    imageUrls,
    url,
    features,
    futureFeatures,
    views,
  } = project;
  const adjustedName = convertName(name);
  const images = imageUrls || [];

  const SidebarContent = () => (
    <Accordion
      type="multiple"
      defaultValue={["info", "activity"]}
      className="w-full"
    >
      {/* Project Info Section */}
      <AccordionItem value="info" className="border-gray-700">
        <AccordionTrigger className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors hover:no-underline py-3.5 border-b border-gray-700 rounded-none px-4">
          <div className="flex items-center">
            <Info size={16} className="mr-2" /> _project-links
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 py-4">
          <div className="space-y-4 mx-4">
            {url && (
              <>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Live URL
                  </p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
                  >
                    <span className="truncate">{url}</span>
                    <ExternalLink
                      size={12}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </a>
                </div>
              </>
            )}

            {githubUrl && (
              <>
                <Separator className="bg-gray-700" />
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Repository
                  </p>
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 truncate block"
                  >
                    {githubUrl.replace("https://github.com/", "")}
                  </a>
                </div>
              </>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Repository Activity Section */}
      {repoData && (
        <AccordionItem value="activity" className="border-gray-700">
          <AccordionTrigger className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors hover:no-underline py-3.5 border-b border-gray-700 rounded-none px-4">
            <div className="flex items-center">
              <Activity size={16} className="mr-2" /> _repository-stats
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-4">
            <div className="space-y-3 mx-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Stars
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {repoData.stars || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Forks
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {repoData.forks || 0}
                  </p>
                </div>
              </div>

              {repoData.lastCommitDate && (
                <>
                  <Separator className="bg-gray-700" />
                  <div className="space-y-2 py-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Calendar size={14} className="mb-0.5" /> Last Updated
                    </p>
                    <p className="text-sm text-white ml-5.5">
                      {formatFullDate(repoData.lastCommitDate)}
                    </p>
                  </div>
                </>
              )}

              {repoData.language && (
                <>
                  <Separator className="bg-gray-700" />
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <GitBranch size={14} /> Primary Language
                    </p>
                    <p className="text-sm text-white ml-5.5">
                      {repoData.language}
                    </p>
                  </div>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );

  return (
    <div className="flex flex-col md:flex-row h-full relative w-full bg-slate-900 text-white">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-md z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Left Sidebar */}
      <div
        className={`
        md:w-[360px] md:border-r md:border-gray-700 md:flex md:flex-col md:h-full md:relative md:transform-none md:transition-none
        fixed top-0 left-0 h-full w-[360px] bg-slate-900 border-r border-gray-700 flex flex-col z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Mobile Close Button */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-700">
          <span className="text-white font-medium">_project-details</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-gray-400 hover:bg-gray-700 hover:text-white p-1"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full w-full">
        {/* Header */}
        <div className="items-center border-b border-gray-700 sticky top-0 bg-slate-900 z-10">
          <div className="px-4 py-3 flex items-center w-full md:w-fit justify-between md:justify-start gap-3 md:border-r md:border-gray-700">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="md:hidden text-gray-400 hover:bg-gray-700 hover:text-white p-1 mr-3"
              >
                <PanelRight size={20} />
              </Button>
              <span className="text-gray-400 text-sm">{adjustedName}</span>
            </div>

            <Link href={`/${username}/projects`}>
              <button className="text-gray-500 hover:text-white cursor-pointer">
                ×
              </button>
            </Link>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-12 py-8 lg:max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-3 mb-6">
                  {url && (
                    <Link href={url} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white gap-2"
                      >
                        <ExternalLink size={16} />
                        Live Demo
                      </Button>
                    </Link>
                  )}

                  {githubUrl && (
                    <Link
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white gap-2"
                      >
                        <FaGithub size={16} />
                        View Code
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex items-start justify-between">
                <p className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  {adjustedName}
                </p>

                <div className="flex items-center gap-2 py-1 px-2 rounded-md bg-gray-700  text-gray-300">
                  <Eye size={16} />
                  <p className="text-sm">{views}</p>
                </div>
              </div>

              <p className="text-gray-400 text-sm lg:text-base leading-relaxed max-w-3xl">
                {description}
              </p>
            </div>

            {/* Image Gallery */}
            {images.length > 0 && (
              <Card className="bg-slate-800 border-gray-700 mb-8 overflow-hidden py-0">
                <CardContent className="p-0">
                  {/* Main Image */}
                  <div className="relative h-[200px] lg:h-[380px] bg-gradient-to-tr from-slate-700 to-slate-800">
                    <Image
                      src={images[selectedImageIndex]}
                      alt={`${name} preview ${selectedImageIndex + 1}`}
                      width={1000}
                      height={1000}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* GitHub Stats Overlay */}
                    {githubUrl && repoData && (
                      <div className="absolute top-4 left-4 flex items-center gap-3">
                        <div className="rounded-full bg-indigo-200 backdrop-blur-sm flex items-center justify-center shadow-lg gap-2 py-1 px-3">
                          <Star size={16} className="fill-current" />
                          <span className="font-medium">
                            {repoData.stars || 0}
                          </span>
                        </div>
                        <div className="rounded-full bg-indigo-200 backdrop-blur-sm flex items-center justify-center shadow-lg gap-2 py-1 px-3">
                          <GitFork size={16} />
                          <span className="font-medium">
                            {repoData.forks || 0}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Strip */}
                  {images.length > 1 && (
                    <div className="flex gap-2 p-4 bg-slate-800 overflow-x-auto">
                      {images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImageIndex === index
                              ? "border-blue-400 ring-2 ring-blue-400/50"
                              : "border-gray-600 hover:border-gray-500"
                          }`}
                        >
                          <Image
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            width={100}
                            height={100}
                            className="object-cover w-full h-full"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tech Stack */}
            {techStack && techStack.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Code2 size={20} className="text-gray-400" />
                  <h2 className="text-xl font-semibold text-white">
                    Tech Stack
                  </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  {techStack.map((tech, index) => {
                    const techInfo = getTechInfo(tech);
                    const IconComponent = techInfo.icon;

                    return (
                      <motion.div
                        key={tech}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 px-3 py-1 rounded-lg bg-slate-800 border border-gray-700 hover:border-gray-600 transition-all group"
                      >
                        <IconComponent
                          size={16}
                          className="group-hover:scale-110 transition-transform"
                        />
                        <span className="font-medium text-sm text-gray-300 group-hover:text-white transition-colors">
                          {tech}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Features and Future Features Section - ADDED HERE */}
            {((features && features.length > 0) ||
              (futureFeatures && futureFeatures.length > 0)) && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <ListChecks size={20} className="text-gray-400" />
                  <h2 className="text-xl font-semibold text-white">
                    Project Features
                  </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-4">
                  {/* Current Features */}
                  {features && features.length > 0 && (
                    <Card className="bg-slate-800 border-gray-700 py-0">
                      <CardContent className="p-4">
                        <p className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                          <ScrollText
                            size={20}
                            className="text-orange-400 mr-2 flex-shrink-0"
                          />
                          Current Features
                        </p>
                        <ul className="space-y-2">
                          {features.map((feature, index) => (
                            <motion.li
                              key={index}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-start gap-2"
                            >
                              <CheckCircle
                                size={16}
                                className="text-orange-300 mt-0.5 flex-shrink-0"
                              />
                              <span className="text-sm text-gray-400">
                                {feature}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Future Features */}
                  {futureFeatures && futureFeatures.length > 0 && (
                    <Card className="bg-slate-800 border-gray-700 py-0">
                      <CardContent className="p-4">
                        <p className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                          <Scroll
                            size={20}
                            className="text-blue-400 mr-2 flex-shrink-0"
                          />
                          Planned Features
                        </p>
                        <ul className="space-y-2">
                          {futureFeatures.map((feature, index) => (
                            <motion.li
                              key={index}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-start gap-2"
                            >
                              <Circle
                                size={16}
                                className="text-blue-400 mt-0.5 flex-shrink-0"
                              />
                              <span className="text-sm text-gray-400">
                                {feature}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* GitHub Repository Info */}
            {repoData && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaGithub size={20} className="text-gray-500" />
                  <h2 className="text-xl font-semibold text-white">
                    Repository Information
                  </h2>
                </div>

                <div className="grid lg:grid-cols-3 gap-4">
                  {/* Last Commit */}
                  {repoData.lastCommit && (
                    <Card className="bg-slate-800 border-gray-700 py-0">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <GitCommit
                            size={20}
                            className="text-orange-400 flex-shrink-0"
                          />
                          <div className="flex flex-col gap-1 mt-0.5">
                            <p className="text-xs text-orange-400 uppercase tracking-wider font-semibold">
                              Last Commit
                            </p>
                            <p className="text-sm text-gray-300 line-clamp-1 mt-1">
                              {repoData.lastCommit}
                            </p>
                            {repoData.lastCommitAuthor && (
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <User size={12} />
                                {repoData.lastCommitAuthor}
                              </p>
                            )}
                            {repoData.lastCommitDate && (
                              <p className="text-xs text-gray-500">
                                {formatRelativeTime(repoData.lastCommitDate)}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Created Date */}
                  {repoData.createdAt && (
                    <Card className="bg-slate-800 border-gray-700 py-0">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Calendar
                            size={18}
                            className="text-orange-400 flex-shrink-0 mt-0"
                          />
                          <div className="flex flex-col gap-1 mt-0.5">
                            <p className="text-xs text-orange-400 uppercase tracking-wider font-semibold">
                              Created
                            </p>
                            <p className="text-sm text-gray-300 mt-1">
                              {new Date(repoData.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatRelativeTime(repoData.createdAt)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Last Updated */}
                  {repoData.updatedAt && (
                    <Card className="bg-slate-800 border-gray-700 py-0">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Clock size={18} className="text-orange-400" />
                          <div className="flex flex-col gap-1 mt-0.5">
                            <p className="text-xs text-orange-400 uppercase tracking-wider font-semibold">
                              Last Activity
                            </p>
                            <p className="text-sm text-gray-300 mt-1">
                              {new Date(repoData.updatedAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatRelativeTime(repoData.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Languages */}
                {repoData.languages &&
                  Object.keys(repoData.languages).length > 0 && (
                    <Card className="bg-slate-800 border-gray-700 mt-4 py-0">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Code2 size={18} className="text-orange-400" />
                          <p className="text-xs font-medium text-orange-400 uppercase tracking-wider">
                            Languages Used
                          </p>
                        </div>
                        <div className="space-y-2">
                          {calculateLanguagePercentages(repoData.languages).map(
                            (lang) => (
                              <div
                                key={lang.name}
                                className="flex items-center gap-3"
                              >
                                <span className="text-xs lg:text-sm text-gray-200 w-24">
                                  {lang.name}
                                </span>
                                <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-yellow-500 via-orange-400 to-orange-600"
                                    style={{ width: `${lang.percentage}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 w-12 text-right">
                                  {lang.percentage}%
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                {/* Topics */}
                {repoData.topics && repoData.topics.length > 0 && (
                  <Card className="bg-slate-800 border-gray-700 mt-4">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Hash size={18} className="text-cyan-400" />
                        <p className="text-sm font-medium text-white">Topics</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {repoData.topics.map((topic: string) => (
                          <span
                            key={topic}
                            className="px-3 py-1 bg-slate-700 text-cyan-400 rounded-full text-xs border border-cyan-400/20 hover:border-cyan-400/40 transition-colors"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Homepage */}
                {repoData.homepage && (
                  <Card className="bg-slate-800 border-gray-700 mt-4">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Globe size={18} className="text-indigo-400" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Project Homepage
                          </p>
                          <a
                            href={repoData.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
                          >
                            {repoData.homepage}
                            <ExternalLink
                              size={12}
                              className="group-hover:translate-x-0.5 transition-transform"
                            />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsView;
