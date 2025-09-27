import { GitState, TableGitOperations } from "@/lib/git/types";

const VALID_EDUCATION_TYPES = [
  "high-school",
  "university",
  "certification",
  "bootcamp",
  "online-course",
];

export const userEducationGitOperations: TableGitOperations = {
  add: async (
    args: string[],
    state: GitState,
    setState: (state: GitState) => void,
    data?: any,
  ): Promise<string> => {
    const validFields = [
      "institution",
      "logoUrl",
      "degree",
      "field",
      "location",
      "grade",
      "gpa",
      "startYear",
      "endYear",
      "details",
      "type",
    ];

    if (args.length === 0) {
      return `Usage: 
  git add field=value    - Stage a field change
  git add -m educationId - Target existing record for modification`;
    }

    const firstArg = args[0];

    // Handle modification targeting: git add -m educationId
    if (firstArg === "-m") {
      if (args.length < 2) {
        return "Usage: git add -m educationId";
      }

      const recordId = args[1];
      return userEducationGitOperations.target(recordId, state, setState, data);
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

    let processedValue: string | number;

    // Field-specific processing and validation
    if (field === "type") {
      if (!VALID_EDUCATION_TYPES.includes(cleanStringValue)) {
        return `Invalid education type: "${cleanStringValue}". Valid types: ${VALID_EDUCATION_TYPES.join(", ")}`;
      }
      processedValue = cleanStringValue;
    } else if (field === "gpa") {
      const gpaValue = parseFloat(cleanStringValue);
      if (isNaN(gpaValue) || gpaValue < 0 || gpaValue > 4.0) {
        return `Invalid GPA: "${cleanStringValue}". GPA must be a number between 0 and 4.0`;
      }
      processedValue = gpaValue;
    } else if (field === "startYear" || field === "endYear") {
      const yearValue = parseInt(cleanStringValue);
      if (isNaN(yearValue) || yearValue < 1900 || yearValue > 2100) {
        return `Invalid year: "${cleanStringValue}". Year must be between 1900 and 2100`;
      }
      processedValue = yearValue;
    } else if (field === "logoUrl") {
      if (cleanStringValue && !isValidUrl(cleanStringValue)) {
        return `Invalid URL format: "${cleanStringValue}". Please provide a valid URL`;
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
      ? ` for education ${state.context.targetRecord._id}`
      : "";

    return `Staged change: ${field} = "${processedValue}"${targetInfo}`;
  },

  status: (state: GitState, data?: any): string => {
    const stagedKeys = Object.keys(state.stagedChanges);

    if (stagedKeys.length === 0) {
      return "No changes staged for commit.";
    }

    let status = "Changes staged for commit in User Education:\n";

    if (state.context.targetRecord) {
      status += `Target Education: ${state.context.targetRecord._id}\n`;
    }

    stagedKeys.forEach((key) => {
      let currentValue = "(empty)";

      if (state.context.targetRecord) {
        const recordValue = state.context.targetRecord[key];
        currentValue = recordValue?.toString() || "(empty)";
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
      const commitData = { ...state.stagedChanges };

      if (state.context.targetRecord && state.context.isModifying) {
        // Update existing education
        await mutations.updateEducation({
          educationId: state.context.targetRecord._id,
          updates: commitData,
        });
        result = `Updated education ${state.context.targetRecord._id}`;
      } else {
        // Create new education - check required fields
        if (!commitData.institution || !commitData.type) {
          const missing = [];
          if (!commitData.institution) missing.push("institution");
          if (!commitData.type) missing.push("type");
          return `Error: Missing required fields for creating new education: ${missing.join(", ")}. institution and type are required.`;
        }

        if (!data?.currentUser) {
          return "Error: No user data available for creating education.";
        }

        await mutations.createEducation({
          institution: commitData.institution,
          logoUrl: commitData.logoUrl,
          degree: commitData.degree,
          field: commitData.field,
          location: commitData.location,
          grade: commitData.grade,
          gpa: commitData.gpa,
          startYear: commitData.startYear,
          endYear: commitData.endYear,
          details: commitData.details,
          type: commitData.type,
        });
        result = "Created new education";
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
          : "Update education";

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
        currentValue = recordValue?.toString() || "(empty)";
      }

      const newValue = state.stagedChanges[key];
      diff += `${key}:\n`;
      diff += `- ${currentValue}\n`;
      diff += `+ ${newValue}\n\n`;
    });

    return diff;
  },

  show: (data?: any): string => {
    const userEducation = data?.userEducations;

    if (!userEducation || userEducation.length === 0) {
      return `No education records found.

Available types: ${VALID_EDUCATION_TYPES.join(", ")}
Required fields: institution, type`;
    }

    return `User Education:
${userEducation
  .map((edu: any) => {
    const years =
      edu.startYear && edu.endYear
        ? ` (${edu.startYear}-${edu.endYear})`
        : edu.startYear
          ? ` (${edu.startYear})`
          : "";
    const degree = edu.degree ? ` - ${edu.degree}` : "";
    const field = edu.field ? ` in ${edu.field}` : "";
    return `  [${edu._id}] ${edu.institution}${degree}${field}${years}
    Type: ${edu.type}${edu.description ? `\n    ${edu.description}` : ""}`;
  })
  .join("\n")}

Available types: ${VALID_EDUCATION_TYPES.join(", ")}`;
  },

  target: (
    recordId: string,
    state: GitState,
    setState: (state: GitState) => void,
    data?: any,
  ): string => {
    if (!recordId) {
      return "Usage: git add -m educationId";
    }

    const userEducation = data?.userEducations;

    if (!userEducation || userEducation.length === 0) {
      return "No education records available to target.";
    }

    const targetEducation = userEducation.find(
      (edu: any) => edu._id === recordId,
    );
    if (!targetEducation) {
      return `Education with ID ${recordId} not found.`;
    }

    setState({
      ...state,
      context: {
        ...state.context,
        targetRecord: targetEducation,
        isModifying: true,
      },
    });

    const years =
      targetEducation.startYear && targetEducation.endYear
        ? ` (${targetEducation.startYear}-${targetEducation.endYear})`
        : "";

    return `Targeting education: ${targetEducation.institution}${years}
Type: ${targetEducation.type}
Available actions:
  - git add field=value  (modify fields)
  - git rm               (delete this education)
Valid types: ${VALID_EDUCATION_TYPES.join(", ")}`;
  },

  rm: async (
    args: string[],
    state: GitState,
    setState: (state: GitState) => void,
    mutations: any,
    data?: any,
  ): Promise<string> => {
    if (!state.context.targetRecord || !state.context.isModifying) {
      return "No education targeted for deletion. Use 'git add -m educationId' to target an education first.";
    }

    const targetEducation = state.context.targetRecord;

    // Check if this is a confirmation
    if (args.length > 0) {
      const confirmation = args[0].toLowerCase();

      if (confirmation === "yes" || confirmation === "y") {
        try {
          await mutations.deleteEducation({
            educationId: targetEducation._id,
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

          return `Deleted education: ${targetEducation.institution}`;
        } catch (error) {
          return `Error deleting education: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
      } else if (confirmation === "no" || confirmation === "n") {
        return "Deletion cancelled.";
      } else {
        return `Invalid response. Please type 'git rm yes' to confirm deletion or 'git rm no' to cancel.`;
      }
    }

    // Initial deletion request - show confirmation prompt
    return `Are you sure you want to delete this education record?
  Institution: ${targetEducation.institution}
  Type: ${targetEducation.type}
  
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
