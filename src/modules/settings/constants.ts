import {
  BarChart3,
  BriefcaseBusiness,
  Edit3,
  FolderGit2,
  LibraryBig,
  LucideIcon,
  Mail,
  Settings,
  UserCircle,
  User,
} from "lucide-react";

type MenuItem = {
  key: string;
  label: string;
  icon: LucideIcon;
};

type MenuSection = {
  id: string;
  title: string;
  icon: LucideIcon;
  items: MenuItem[];
};

export const MENU_SECTIONS: MenuSection[] = [
  {
    id: "user",
    title: "_user-info",
    icon: User,
    items: [
      { key: "profile", label: "_profile.md", icon: UserCircle },
      { key: "customization", label: "_customization.md", icon: Settings },
      { key: "stats", label: "_stats.md", icon: BarChart3 },
    ],
  },
  {
    id: "edit",
    title: "_manage-user",
    icon: Edit3,
    items: [
      {
        key: "work-experience",
        label: "_work-experience.md",
        icon: BriefcaseBusiness,
      },
      { key: "education", label: "_education.md", icon: LibraryBig },
      { key: "projects", label: "_projects.md", icon: FolderGit2 },
      { key: "contact", label: "_contact.md", icon: Mail },
    ],
  },
];

export const WORK_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "freelance",
  "consulting",
  "other",
] as const;

export const renderWorkTypeLabel = (type: (typeof WORK_TYPES)[number]) => {
  switch (type) {
    case "full-time":
      return "Full-time";
    case "part-time":
      return "Part-time";
    case "contract":
      return "Contract";
    case "internship":
      return "Internship";
    case "freelance":
      return "Freelance";
    case "consulting":
      return "Consulting";
    case "other":
      return "Other";
    default:
      return "Unknown";
  }
};

export const EDUCATION_TYPES = [
  "high-school",
  "college",
  "university",
  "certification",
  "bootcamp",
  "online-course",
] as const;

export const renderEducationTypeLabel = (
  type: (typeof EDUCATION_TYPES)[number],
) => {
  switch (type) {
    case "high-school":
      return "High School";
    case "college":
      return "College";
    case "university":
      return "University";
    case "certification":
      return "Certification";
    case "bootcamp":
      return "Bootcamp";
    case "online-course":
      return "Online Course";
    default:
      return "Unknown";
  }
};
