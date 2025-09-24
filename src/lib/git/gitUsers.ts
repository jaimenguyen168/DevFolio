import { GitState, TableGitOperations } from "@/lib/git/types";

export const usersGitOperations: TableGitOperations = {
  add: async (
    args: string[],
    state: GitState,
    setState: (state: GitState) => void,
    data?: any,
  ): Promise<string> => {
    const validFields = ["name", "email", "title", "username", "phone"];

    if (args.length === 0) {
      return "Usage: git add field=value";
    }

    const assignment = args.join(" ");
    const match = assignment.match(/^([^=]+)=(.+)$/);
    if (!match) {
      return "Invalid format. Use: git add field=value";
    }

    const [, field, value] = match;
    const cleanValue = value.replace(/^["']|["']$/g, "");

    if (!validFields.includes(field)) {
      return `Invalid field: ${field}. Valid fields: ${validFields.join(", ")}`;
    }

    setState({
      ...state,
      stagedChanges: {
        ...state.stagedChanges,
        [field]: cleanValue,
      },
    });

    return `Staged change: ${field} = "${cleanValue}"`;
  },

  status: (state: GitState, data?: any): string => {
    const stagedKeys = Object.keys(state.stagedChanges);

    if (stagedKeys.length === 0) {
      return "No changes staged for commit.";
    }

    let status = "Changes staged for commit in Users:\n";

    stagedKeys.forEach((key) => {
      const currentValue = data?.[key] || "(empty)";
      const newValue = state.stagedChanges[key];
      status += `  modified: ${key}\n`;
      status += `    ${currentValue} → ${newValue}\n`;
    });

    return status;
  },

  commit: async (
    args: string[],
    state: GitState,
    setState: (state: GitState) => void,
    mutations: any,
    data?: any,
  ): Promise<string> => {
    const stagedKeys = Object.keys(state.stagedChanges);

    if (stagedKeys.length === 0) {
      return "No changes staged for commit.";
    }

    try {
      await mutations.updateUser({ updates: state.stagedChanges });

      setState({
        ...state,
        stagedChanges: {},
      });

      const message =
        args.length > 0
          ? args.join(" ").replace(/^["']|["']$/g, "")
          : "Update user data";

      return `Updated user: "${message}"
Updated fields: ${stagedKeys.join(", ")}`;
    } catch (error) {
      return `Error committing changes: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  },

  reset: (state: GitState, setState: (state: GitState) => void): string => {
    const stagedCount = Object.keys(state.stagedChanges).length;

    setState({
      ...state,
      stagedChanges: {},
    });

    if (stagedCount === 0) {
      return "No staged changes to reset.";
    }

    return `Reset ${stagedCount} staged change(s).`;
  },

  diff: (state: GitState, data?: any): string => {
    const stagedKeys = Object.keys(state.stagedChanges);

    if (stagedKeys.length === 0) {
      return "No staged changes to diff.";
    }

    let diff = "Differences between current and staged:\n\n";

    stagedKeys.forEach((key) => {
      const currentValue = data?.[key] || "(empty)";
      const newValue = state.stagedChanges[key];
      diff += `${key}:\n`;
      diff += `- ${currentValue}\n`;
      diff += `+ ${newValue}\n\n`;
    });

    return diff;
  },

  show: (data?: any): string => {
    if (!data) {
      return "Error: No user data available";
    }

    return `Current User Data:
  name: "${data.name || "(not set)"}"
  email: "${data.email || "(not set)"}"
  username: "${data.username || "(not set)"}"
  title: "${data.title || "(not set)"}"
  phone: "${data.phone || "(not set)"}"`;
  },

  target: (
    recordId: string,
    state: GitState,
    setState: (state: GitState) => void,
    data?: any,
  ): string => {
    // Users table doesn't support record targeting (single user context)
    return "Users table doesn't support record targeting.";
  },
};
