import { TableConfig, TableGitOperations } from "@/lib/git/types";
import { api } from "../../../convex/_generated/api";
import { usersGitOperations } from "@/lib/git/gitUsers";
import { userLinksGitOperations } from "@/lib/git/gitUserLinks";
import { userProjectsGitOperations } from "@/lib/git/gitProjects";

export const TABLE_OPERATIONS: Record<string, TableGitOperations> = {
  users: usersGitOperations,
  links: userLinksGitOperations,
  projects: userProjectsGitOperations,
};

export const TABLE_CONFIGS: Record<string, TableConfig> = {
  users: {
    name: "users",
    displayName: "Users",
    fields: ["name", "email", "title", "username", "phone"],
    queryFunction: api.functions.users.getCurrentUser,
    updateFunction: api.functions.users.updateUser,
    canUpdate: true,
    identifierField: "id",
  },
  links: {
    name: "userLinks",
    displayName: "User Links",
    fields: ["url", "label"],
    queryFunction: api.functions.userLinks.getUserLinks,
    createFunction: api.functions.userLinks.createUserLink,
    updateFunction: api.functions.userLinks.updateUserLink,
    deleteFunction: api.functions.userLinks.deleteUserLink,
    requiresUserId: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    identifierField: "_id",
  },
  projects: {
    name: "userProjects",
    displayName: "User Projects",
    fields: ["name", "description", "url", "github", "status", "techStack"],
    queryFunction: api.functions.projects.getProjects,
    createFunction: api.functions.projects.createProject,
    updateFunction: api.functions.projects.updateProject,
    deleteFunction: api.functions.projects.deleteProject,
    requiresUserId: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    identifierField: "_id",
  },
};
