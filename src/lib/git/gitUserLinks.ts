import { GitState, TableGitOperations } from "@/lib/git/types";

const VALID_LABELS = ["github", "linkedin", "twitter", "email", "website"];

export const userLinksGitOperations: TableGitOperations = {
  add: async (
    args: string[],
    state: GitState,
    setState: (state: GitState) => void,
    data?: any,
  ): Promise<string> => {
    const validFields = ["url", "label"];

    if (args.length === 0) {
      return "Usage: git add field=value or git add -m linkId";
    }

    const firstArg = args[0];

    // Handle modification targeting: git add -m linkId
    if (firstArg === "-m") {
      if (args.length < 2) {
        return "Usage: git add -m linkId";
      }

      const recordId = args[1];
      return userLinksGitOperations.target(recordId, state, setState, data);
    }

    // Handle field assignment: git add field=value
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

    if (field === "label" && !VALID_LABELS.includes(cleanValue)) {
      return `Invalid label: "${cleanValue}". Valid labels: ${VALID_LABELS.join(", ")}`;
    }

    // Validate URL format (basic validation)
    if (field === "url" && !isValidUrl(cleanValue)) {
      return `Invalid URL format: "${cleanValue}". Please provide a valid URL (e.g., https://example.com)`;
    }

    setState({
      ...state,
      stagedChanges: {
        ...state.stagedChanges,
        [field]: cleanValue,
      },
    });

    const targetInfo = state.context.targetRecord
      ? ` for record ${state.context.targetRecord._id}`
      : "";

    return `Staged change: ${field} = "${cleanValue}"${targetInfo}`;
  },

  status: (state: GitState, data?: any): string => {
    const stagedKeys = Object.keys(state.stagedChanges);

    if (stagedKeys.length === 0) {
      return "No changes staged for commit.";
    }

    let status = "Changes staged for commit in User Links:\n";

    if (state.context.targetRecord) {
      status += `Target Record: ${state.context.targetRecord._id}\n`;
    }

    stagedKeys.forEach((key) => {
      let currentValue = "(empty)";

      if (state.context.targetRecord) {
        currentValue = state.context.targetRecord[key] || "(empty)";
      }

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
      let result = "";

      if (state.context.targetRecord && state.context.isModifying) {
        // Update existing link
        await mutations.updateUserLink({
          linkId: state.context.targetRecord._id,
          updates: state.stagedChanges,
        });
        result = `Updated user link ${state.context.targetRecord._id}`;
      } else {
        if (!state.stagedChanges.url || !state.stagedChanges.label) {
          const missing = [];
          if (!state.stagedChanges.url) missing.push("url");
          if (!state.stagedChanges.label) missing.push("label");
          return `Error: Missing required fields for creating new link: ${missing.join(", ")}. Both url and label are required.`;
        }

        if (!data?.currentUser) {
          return "Error: No user data available for creating link.";
        }

        await mutations.createUserLink({
          url: state.stagedChanges.url,
          label: state.stagedChanges.label,
        });
        result = "Created new user link";
      }

      // Clear staged changes and reset context
      setState({
        context: {
          ...state.context,
          targetRecord: undefined,
          isModifying: false,
        },
        stagedChanges: {},
      });

      const message =
        args.length > 0
          ? args.join(" ").replace(/^["']|["']$/g, "")
          : "Update user link";

      return `${result}: "${message}"
Updated fields: ${stagedKeys.join(", ")}`;
    } catch (error) {
      return `Error committing changes: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  },

  reset: (state: GitState, setState: (state: GitState) => void): string => {
    const stagedCount = Object.keys(state.stagedChanges).length;

    setState({
      context: {
        ...state.context,
        targetRecord: undefined,
        isModifying: false,
      },
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
      let currentValue = "(empty)";

      if (state.context.targetRecord) {
        currentValue = state.context.targetRecord[key] || "(empty)";
      }

      const newValue = state.stagedChanges[key];
      diff += `${key}:\n`;
      diff += `- ${currentValue}\n`;
      diff += `+ ${newValue}\n\n`;
    });

    return diff;
  },

  show: (data?: any): string => {
    const userLinks = data?.userLinks;

    if (!userLinks || userLinks.length === 0) {
      return `No user links found.

Available labels for new links: ${VALID_LABELS.join(", ")}`;
    }

    return `User Links:
${userLinks
  .map(
    (link: any, index: number) => `  [${link._id}] ${link.label}: ${link.url}`,
  )
  .join("\n")}

Available labels for new links: ${VALID_LABELS.join(", ")}`;
  },

  target: (
    recordId: string,
    state: GitState,
    setState: (state: GitState) => void,
    data?: any,
  ): string => {
    if (!recordId) {
      return "Usage: git add -m linkId";
    }

    const userLinks = data?.userLinks;

    if (!userLinks || userLinks.length === 0) {
      return "No user links available to target.";
    }

    const targetLink = userLinks.find((link: any) => link._id === recordId);
    if (!targetLink) {
      return `User link with ID ${recordId} not found.`;
    }

    setState({
      ...state,
      context: {
        ...state.context,
        targetRecord: targetLink,
        isModifying: true,
      },
    });

    return `Targeting user link: ${targetLink.label} (${targetLink.url})
Available actions:
  - git add field=value  (modify fields)
  - git rm               (delete this link)
Valid labels: ${VALID_LABELS.join(", ")}`;
  },

  rm: async (
    args: string[],
    state: GitState,
    setState: (state: GitState) => void,
    mutations: any,
    data?: any,
  ): Promise<string> => {
    if (!state.context.targetRecord || !state.context.isModifying) {
      return "No link targeted for deletion. Use 'git add -m linkId' to target a link first.";
    }

    const targetLink = state.context.targetRecord;

    // Check if this is a confirmation
    if (args.length > 0) {
      const confirmation = args[0].toLowerCase();

      if (confirmation === "yes" || confirmation === "y") {
        try {
          await mutations.deleteUserLink({
            linkId: targetLink._id,
          });

          // Clear the context after deletion
          setState({
            context: {
              ...state.context,
              targetRecord: undefined,
              isModifying: false,
            },
            stagedChanges: {},
          });

          return `Deleted user link: ${targetLink.label} (${targetLink.url})`;
        } catch (error) {
          return `Error deleting link: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
      } else if (confirmation === "no" || confirmation === "n") {
        return "Deletion cancelled.";
      } else {
        return `Invalid response. Please type 'git rm yes' to confirm deletion or 'git rm no' to cancel.`;
      }
    }

    // Initial deletion request - show confirmation prompt
    return `Are you sure you want to delete this link?
  Link: ${targetLink.label} (${targetLink.url})
  
Type 'git rm yes' to confirm deletion or 'git rm no' to cancel.`;
  },
};

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
    return urlPattern.test(url);
  }
}
