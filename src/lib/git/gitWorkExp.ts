import { GitState, TableGitOperations } from "@/lib/git/types";

const VALID_WORK_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "freelance",
  "consulting",
  "other",
];

export const userWorkExperienceGitOperations: TableGitOperations = {
  add: async (
    args: string[],
    state: GitState,
    setState: (state: GitState) => void,
    data?: any,
  ): Promise<string> => {
    const validFields = [
      "company",
      "position",
      "startDate",
      "endDate",
      "description",
      "location",
      "logoUrl",
      "type",
      "responsibilities",
    ];

    if (args.length === 0) {
      return `Usage: 
  git add field=value    - Stage a field change
  git add -m workExpId   - Target existing record for modification`;
    }

    const firstArg = args[0];

    // Handle modification targeting: git add -m workExpId
    if (firstArg === "-m") {
      if (args.length < 2) {
        return "Usage: git add -m workExpId";
      }

      const recordId = args[1];
      return userWorkExperienceGitOperations.target(
        recordId,
        state,
        setState,
        data,
      );
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

    // Field-specific processing and validation
    if (field === "type") {
      if (!VALID_WORK_TYPES.includes(cleanStringValue)) {
        return `Invalid work type: "${cleanStringValue}". Valid types: ${VALID_WORK_TYPES.join(", ")}`;
      }
      processedValue = cleanStringValue;
    } else if (field === "responsibilities") {
      const existingResponsibilities =
        state.stagedChanges.responsibilities ||
        state.context.targetRecord?.responsibilities ||
        [];

      let newResponsibilities: string[];
      if (cleanStringValue.startsWith("[") && cleanStringValue.endsWith("]")) {
        try {
          newResponsibilities = JSON.parse(cleanStringValue);
          if (!Array.isArray(newResponsibilities)) {
            return `Invalid responsibilities format. Use array format: ["item1", "item2"]`;
          }
        } catch {
          return `Invalid JSON array format for responsibilities`;
        }
      } else {
        // Treat as comma-separated list or single item
        newResponsibilities = [cleanStringValue];
      }

      // Append new responsibilities to existing ones (remove duplicates)
      const combined = [...existingResponsibilities, ...newResponsibilities];
      processedValue = Array.from(new Set(combined));
    } else if (field === "logoUrl") {
      if (cleanStringValue && !isValidUrl(cleanStringValue)) {
        return `Invalid URL format: "${cleanStringValue}". Please provide a valid URL`;
      }
      processedValue = cleanStringValue;
    } else if (field === "startDate" || field === "endDate") {
      // Basic date validation (YYYY-MM-DD format)
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (cleanStringValue && !datePattern.test(cleanStringValue)) {
        return `Invalid date format: "${cleanStringValue}". Use YYYY-MM-DD format`;
      }
      processedValue = cleanStringValue;
    } else {
      processedValue = cleanStringValue;
    }

    setState({
      ...state,
      stagedChanges: {
        ...state.stagedChanges,
        [field]: processedValue,
      },
    });

    const targetInfo = state.context.targetRecord
      ? ` for work experience ${state.context.targetRecord._id}`
      : "";

    const displayValue = Array.isArray(processedValue)
      ? `[${processedValue.join(", ")}]`
      : processedValue;

    return `Staged change: ${field} = "${displayValue}"${targetInfo}`;
  },

  status: (state: GitState, data?: any): string => {
    const stagedKeys = Object.keys(state.stagedChanges);

    if (stagedKeys.length === 0) {
      return "No changes staged for commit.";
    }

    let status = "Changes staged for commit in Work Experience:\n";

    if (state.context.targetRecord) {
      status += `Target Work Experience: ${state.context.targetRecord._id}\n`;
    }

    stagedKeys.forEach((key) => {
      let currentValue = "(empty)";

      if (state.context.targetRecord) {
        const recordValue = state.context.targetRecord[key];
        currentValue = Array.isArray(recordValue)
          ? `[${recordValue.join(", ")}]`
          : recordValue?.toString() || "(empty)";
      }

      const newValue = state.stagedChanges[key];
      const displayValue = Array.isArray(newValue)
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
      const commitData = { ...state.stagedChanges };

      if (state.context.targetRecord && state.context.isModifying) {
        // Update existing work experience
        await mutations.updateWorkExperience({
          workExperienceId: state.context.targetRecord._id,
          updates: commitData,
        });
        result = `Updated work experience ${state.context.targetRecord._id}`;
      } else {
        // Create new work experience - check required fields
        if (
          !commitData.company ||
          !commitData.position ||
          !commitData.startDate ||
          !commitData.type
        ) {
          const missing = [];
          if (!commitData.company) missing.push("company");
          if (!commitData.position) missing.push("position");
          if (!commitData.startDate) missing.push("startDate");
          if (!commitData.type) missing.push("type");
          return `Error: Missing required fields for creating new work experience: ${missing.join(", ")}. company, position, startDate, and type are required.`;
        }

        if (!data?.currentUser) {
          return "Error: No user data available for creating work experience.";
        }

        await mutations.createWorkExperience({
          company: commitData.company,
          position: commitData.position,
          startDate: commitData.startDate,
          endDate: commitData.endDate,
          description: commitData.description,
          location: commitData.location,
          logoUrl: commitData.logoUrl,
          type: commitData.type,
          responsibilities: commitData.responsibilities,
        });
        result = "Created new work experience";
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
          : "Update work experience";

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
        const recordValue = state.context.targetRecord[key];
        currentValue = Array.isArray(recordValue)
          ? `[${recordValue.join(", ")}]`
          : recordValue?.toString() || "(empty)";
      }

      const newValue = state.stagedChanges[key];
      const displayValue = Array.isArray(newValue)
        ? `[${newValue.join(", ")}]`
        : newValue;

      diff += `${key}:\n`;
      diff += `- ${currentValue}\n`;
      diff += `+ ${displayValue}\n\n`;
    });

    return diff;
  },

  show: (data?: any): string => {
    const workExperiences = data?.userWorkExperiences;

    if (!workExperiences || workExperiences.length === 0) {
      return `No work experience records found.

Available types: ${VALID_WORK_TYPES.join(", ")}
Required fields: company, position, startDate, type`;
    }

    return `Work Experience:
${workExperiences
  .map((exp: any) => {
    const dates = exp.endDate
      ? `${exp.startDate} to ${exp.endDate}`
      : `${exp.startDate} to Present`;

    return `  [${exp._id}] ${exp.position} at ${exp.company}
    ${dates} | ${exp.type}${exp.location ? ` | ${exp.location}` : ""}${exp.description ? `\n    ${exp.description}` : ""}${exp.responsibilities && exp.responsibilities.length > 0 ? `\n    Responsibilities: ${exp.responsibilities.join(", ")}` : ""}`;
  })
  .join("\n")}

Available types: ${VALID_WORK_TYPES.join(", ")}`;
  },

  target: (
    recordId: string,
    state: GitState,
    setState: (state: GitState) => void,
    data?: any,
  ): string => {
    if (!recordId) {
      return "Usage: git add -m workExpId";
    }

    const workExperiences = data?.userWorkExperiences;

    if (!workExperiences || workExperiences.length === 0) {
      return "No work experience records available to target.";
    }

    const targetWorkExp = workExperiences.find(
      (exp: any) => exp._id === recordId,
    );
    if (!targetWorkExp) {
      return `Work experience with ID ${recordId} not found.`;
    }

    setState({
      ...state,
      context: {
        ...state.context,
        targetRecord: targetWorkExp,
        isModifying: true,
      },
    });

    const dates = targetWorkExp.endDate
      ? `${targetWorkExp.startDate} to ${targetWorkExp.endDate}`
      : `${targetWorkExp.startDate} to Present`;

    return `Targeting work experience: ${targetWorkExp.position} at ${targetWorkExp.company}
${dates} | Type: ${targetWorkExp.type}
Available actions:
  - git add field=value  (modify fields)
  - git rm               (delete this work experience)
Valid types: ${VALID_WORK_TYPES.join(", ")}`;
  },

  rm: async (
    args: string[],
    state: GitState,
    setState: (state: GitState) => void,
    mutations: any,
    data?: any,
  ): Promise<string> => {
    if (!state.context.targetRecord || !state.context.isModifying) {
      return "No work experience targeted for deletion. Use 'git add -m workExpId' to target a work experience first.";
    }

    const targetWorkExp = state.context.targetRecord;

    // Check if this is a confirmation
    if (args.length > 0) {
      const confirmation = args[0].toLowerCase();

      if (confirmation === "yes" || confirmation === "y") {
        try {
          await mutations.deleteWorkExperience({
            workExperienceId: targetWorkExp._id,
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

          return `Deleted work experience: ${targetWorkExp.position} at ${targetWorkExp.company}`;
        } catch (error) {
          return `Error deleting work experience: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
      } else if (confirmation === "no" || confirmation === "n") {
        return "Deletion cancelled.";
      } else {
        return `Invalid response. Please type 'git rm yes' to confirm deletion or 'git rm no' to cancel.`;
      }
    }

    // Initial deletion request - show confirmation prompt
    return `Are you sure you want to delete this work experience record?
  Position: ${targetWorkExp.position}
  Company: ${targetWorkExp.company}
  Type: ${targetWorkExp.type}
  
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
