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

export const EDUCATION_TYPES = [
  "high-school",
  "college",
  "university",
  "certification",
  "bootcamp",
  "online-course",
] as const;
