import { TableConfig, TableGitOperations } from "@/lib/git/types";
import { api } from "../../../convex/_generated/api";
import { usersGitOperations } from "@/lib/git/gitUsers";
import { userLinksGitOperations } from "@/lib/git/gitUserLinks";
import { useMutation } from "convex/react";

export const TABLE_OPERATIONS: Record<string, TableGitOperations> = {
  users: usersGitOperations,
  "user-links": userLinksGitOperations,
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
  "user-links": {
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
};
