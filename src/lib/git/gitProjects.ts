import { GitState, TableGitOperations } from "@/lib/git/types";
import { TECH_STACKS } from "@/modules/about/constants";

const VALID_STATUSES = ["completed", "in-progress", "archived"];

export const userProjectsGitOperations: TableGitOperations = {
  add: async (
    args: string[],
    state: GitState,
    setState: (state: GitState) => void,
    data?: any,
  ): Promise<string> => {
    const validFields = [
      "name",
      "description",
      "url",
      "githubUrl",
      "status",
      "techStack",
      "image",
    ];

    if (args.length === 0) {
      return "Usage: git add field=value or git add -m projectId";
    }

    const firstArg = args[0];

    // Handle modification targeting: git add -m projectId
    if (firstArg === "-m") {
      if (args.length < 2) {
        return "Usage: git add -m projectId";
      }

      const recordId = args[1];
      return userProjectsGitOperations.target(recordId, state, setState, data);
    }

    // Handle field assignment: git add field=value
    const assignment = args.join(" ");
    const match = assignment.match(/^([^=]+)=(.+)$/);
    if (!match) {
      return "Invalid format. Use: git add field=value";
    }

    const [, field, value] = match;
    let cleanStringValue = value.replace(/^["']|["']$/g, "");

    if (!validFields.includes(field)) {
      return `Invalid field: ${field}. Valid fields: ${validFields.join(", ")}`;
    }

    let processedValue: string | string[];

    if (field === "techStack") {
      // Handle techStack as an array
      const techArray = cleanStringValue.split(",").map((tech) => tech.trim());
      const invalidTechs = techArray.filter(
        (tech) => !TECH_STACKS.includes(tech as any),
      );

      if (invalidTechs.length > 0) {
        return `Invalid technologies: ${invalidTechs.join(", ")}. 
Valid technologies: ${TECH_STACKS.join(", ")}`;
      }

      processedValue = techArray;
    } else if (field === "image") {
      // Handle image upload
      if (
        cleanStringValue.startsWith("http://") ||
        cleanStringValue.startsWith("https://")
      ) {
        // Direct URL provided
        processedValue = cleanStringValue;
      } else {
        // File path or base64 - mark for upload
        setState({
          ...state,
          stagedChanges: {
            ...state.stagedChanges,
            _imageUpload: cleanStringValue, // Store for later processing
          },
        });
        return `Image staged for upload: ${cleanStringValue}. Commit to upload the image.`;
      }
    } else {
      // All other fields are strings
      processedValue = cleanStringValue;

      // Field-specific validations for string fields
      if (field === "status" && !VALID_STATUSES.includes(processedValue)) {
        return `Invalid status: "${processedValue}". Valid statuses: ${VALID_STATUSES.join(", ")}`;
      }

      if (field === "url" && processedValue && !isValidUrl(processedValue)) {
        return `Invalid URL format: "${processedValue}". Please provide a valid URL (e.g., https://example.com)`;
      }

      if (
        field === "github" &&
        processedValue &&
        !isValidGitHubUrl(processedValue)
      ) {
        return `Invalid GitHub URL format: "${processedValue}". Please provide a valid GitHub URL (e.g., https://github.com/user/repo)`;
      }
    }

    setState({
      ...state,
      stagedChanges: {
        ...state.stagedChanges,
        [field]: processedValue,
      },
    });

    const targetInfo = state.context.targetRecord
      ? ` for project ${state.context.targetRecord._id}`
      : "";

    const displayValue =
      field === "techStack"
        ? `[${(processedValue as string[]).join(", ")}]`
        : `"${processedValue}"`;

    return `Staged change: ${field} = ${displayValue}${targetInfo}`;
  },

  status: (state: GitState, data?: any): string => {
    const stagedKeys = Object.keys(state.stagedChanges);

    if (stagedKeys.length === 0) {
      return "No changes staged for commit.";
    }

    let status = "Changes staged for commit in User Projects:\n";

    if (state.context.targetRecord) {
      status += `Target Project: ${state.context.targetRecord._id}\n`;
    }

    stagedKeys.forEach((key) => {
      let currentValue = "(empty)";

      if (state.context.targetRecord) {
        const recordValue = state.context.targetRecord[key];
        if (key === "techStack" && Array.isArray(recordValue)) {
          currentValue =
            recordValue.length > 0 ? `[${recordValue.join(", ")}]` : "(empty)";
        } else {
          currentValue = recordValue || "(empty)";
        }
      }

      const newValue = state.stagedChanges[key];
      const displayValue =
        key === "techStack" && Array.isArray(newValue)
          ? `[${newValue.join(", ")}]`
          : newValue;

      status += `  modified: ${key}\n`;
      status += `    ${currentValue} → ${displayValue}\n`;
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
      let commitData = { ...state.stagedChanges };

      // Handle image upload if present
      if (state.stagedChanges._imageUpload) {
        try {
          const uploadUrl = await mutations.generateUploadUrl();

          // For now, we'll simulate file upload - in a real implementation,
          // you'd need to handle file reading from the filesystem
          const imageUrl = await handleImageUpload(
            state.stagedChanges._imageUpload,
            uploadUrl,
          );

          // Update imageUrls array
          const currentImages = state.context.targetRecord?.imageUrls || [];
          commitData.imageUrls = [...currentImages, imageUrl];

          // Remove the upload marker
          delete commitData._imageUpload;

          result += `Image uploaded successfully. `;
        } catch (error) {
          return `Error uploading image: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
      }

      if (state.context.targetRecord && state.context.isModifying) {
        // Update existing project
        await mutations.updateProject({
          projectId: state.context.targetRecord._id,
          updates: commitData,
        });
        result += `Updated project ${state.context.targetRecord._id}`;
      } else {
        // Create new project - check required fields
        if (!commitData.name || !commitData.description) {
          const missing = [];
          if (!commitData.name) missing.push("name");
          if (!commitData.description) missing.push("description");
          return `Error: Missing required fields for creating new project: ${missing.join(", ")}. Both name and description are required.`;
        }

        if (!data?.currentUser) {
          return "Error: No user data available for creating project.";
        }

        await mutations.createProject({
          name: commitData.name,
          description: commitData.description,
          url: commitData.url,
          github: commitData.github,
          status: commitData.status,
          techStack: commitData.techStack,
          imageUrls: commitData.imageUrls,
        });
        result += "Created new project";
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
          : "Update project";

      return `${result}: "${message}"
Updated fields: ${stagedKeys.filter((k) => k !== "_imageUpload").join(", ")}`;
    } catch (error) {
      return `Error committing changes: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  },

  // Add new command for image operations
  image: async (
    args: string[],
    state: GitState,
    setState: (state: GitState) => void,
    mutations: any,
    data?: any,
  ): Promise<string> => {
    if (args.length === 0) {
      return `Image operations:
  git image add <file_path>     - Stage an image for upload
  git image list                - List current project images
  git image remove <index>      - Remove image by index`;
    }

    const subCommand = args[0].toLowerCase();

    switch (subCommand) {
      case "add":
        if (args.length < 2) {
          return "Usage: git image add <file_path>";
        }
        return userProjectsGitOperations.add(
          ["image=" + args[1]],
          state,
          setState,
          data,
        );

      case "list":
        if (!state.context.targetRecord) {
          return "No project targeted. Use 'git add -m projectId' first.";
        }
        const images = state.context.targetRecord.imageUrls || [];
        if (images.length === 0) {
          return "No images found for this project.";
        }
        return `Project images:\n${images.map((url: string, index: number) => `  [${index}] ${url}`).join("\n")}`;

      case "remove":
        if (args.length < 2) {
          return "Usage: git image remove <index>";
        }
        const index = parseInt(args[1]);
        if (!state.context.targetRecord) {
          return "No project targeted. Use 'git add -m projectId' first.";
        }
        const currentImages = state.context.targetRecord.imageUrls || [];
        if (index < 0 || index >= currentImages.length) {
          return `Invalid index. Available indices: 0-${currentImages.length - 1}`;
        }
        const newImages = currentImages.filter(
          (_: string, i: number) => i !== index,
        );
        setState({
          ...state,
          stagedChanges: {
            ...state.stagedChanges,
            imageUrls: newImages,
          },
        });
        return `Staged removal of image at index ${index}. Commit to apply changes.`;

      default:
        return `Unknown image command: ${subCommand}`;
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
        const recordValue = state.context.targetRecord[key];
        if (key === "techStack" && Array.isArray(recordValue)) {
          currentValue =
            recordValue.length > 0 ? `[${recordValue.join(", ")}]` : "(empty)";
        } else {
          currentValue = recordValue || "(empty)";
        }
      }

      const newValue = state.stagedChanges[key];
      const displayValue =
        key === "techStack" && Array.isArray(newValue)
          ? `[${newValue.join(", ")}]`
          : newValue;

      diff += `${key}:\n`;
      diff += `- ${currentValue}\n`;
      diff += `+ ${displayValue}\n\n`;
    });

    return diff;
  },

  show: (data?: any): string => {
    const userProjects = data?.userProjects;

    if (!userProjects || userProjects.length === 0) {
      return `No projects found.

Available statuses: ${VALID_STATUSES.join(", ")}
Available tech stacks: ${TECH_STACKS.slice(0, 10).join(", ")}... (${TECH_STACKS.length} total)`;
    }

    return `User Projects:
${userProjects
  .map((project: any) => {
    const techStack =
      project.techStack && project.techStack.length > 0
        ? ` [${project.techStack.join(", ")}]`
        : "";
    const status = project.status ? ` (${project.status})` : "";
    return `  [${project._id}] ${project.name}${status}${techStack}
    ${project.description}`;
  })
  .join("\n")}

Available statuses: ${VALID_STATUSES.join(", ")}
Available tech stacks: ${TECH_STACKS.slice(0, 10).join(", ")}... (${TECH_STACKS.length} total)`;
  },

  target: (
    recordId: string,
    state: GitState,
    setState: (state: GitState) => void,
    data?: any,
  ): string => {
    if (!recordId) {
      return "Usage: git add -m projectId";
    }

    const userProjects = data?.userProjects;

    if (!userProjects || userProjects.length === 0) {
      return "No projects available to target.";
    }

    const targetProject = userProjects.find(
      (project: any) => project._id === recordId,
    );
    if (!targetProject) {
      return `Project with ID ${recordId} not found.`;
    }

    setState({
      ...state,
      context: {
        ...state.context,
        targetRecord: targetProject,
        isModifying: true,
      },
    });

    const techStack =
      targetProject.techStack && targetProject.techStack.length > 0
        ? ` [${targetProject.techStack.join(", ")}]`
        : "";

    return `Targeting project: ${targetProject.name} (${targetProject.status || "no status"})${techStack}
Available actions:
  - git add field=value  (modify fields)
  - git rm               (delete this project)
Valid statuses: ${VALID_STATUSES.join(", ")}
Tech stack format: techStack="React,TypeScript,Tailwind"`;
  },

  rm: async (
    args: string[],
    state: GitState,
    setState: (state: GitState) => void,
    mutations: any,
    data?: any,
  ): Promise<string> => {
    if (!state.context.targetRecord || !state.context.isModifying) {
      return "No project targeted for deletion. Use 'git add -m projectId' to target a project first.";
    }

    const targetProject = state.context.targetRecord;

    // Check if this is a confirmation
    if (args.length > 0) {
      const confirmation = args[0].toLowerCase();

      if (confirmation === "yes" || confirmation === "y") {
        try {
          await mutations.deleteProject({
            projectId: targetProject._id,
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

          return `Deleted project: ${targetProject.name}`;
        } catch (error) {
          return `Error deleting project: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
      } else if (confirmation === "no" || confirmation === "n") {
        return "Deletion cancelled.";
      } else {
        return `Invalid response. Please type 'git rm yes' to confirm deletion or 'git rm no' to cancel.`;
      }
    }

    // Initial deletion request - show confirmation prompt
    return `Are you sure you want to delete this project?
  Project: ${targetProject.name}
  Description: ${targetProject.description}
  
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

function isValidGitHubUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname === "github.com" && urlObj.pathname.split("/").length >= 3
    );
  } catch {
    return /^https?:\/\/github\.com\/[\w.-]+\/[\w.-]+/.test(url);
  }
}

async function handleImageUpload(
  imagePath: string,
  uploadUrl: string,
): Promise<string> {
  // This is a simplified version - in a real implementation, you'd need to:
  // 1. Check if it's a file path or base64
  // 2. Read the file from the filesystem (if it's a path)
  // 3. Upload to the generated URL
  // 4. Return the final image URL

  // For now, return a placeholder
  throw new Error(
    "Image upload not fully implemented. Please use direct URLs for now.",
  );
}
