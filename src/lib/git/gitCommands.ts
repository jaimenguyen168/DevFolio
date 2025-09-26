import { GitState, TableGitOperations } from "@/lib/git/types";
import { TABLE_CONFIGS } from "@/lib/git/configs";

export const executeGitCommand = async (
  args: string[],
  state: GitState,
  setState: (state: GitState) => void,
  tableOperations: TableGitOperations,
  mutations: any,
  data?: any,
): Promise<string> => {
  if (args.length === 0) {
    return "Usage: git <command>. Try 'git status', 'git add', 'git commit', etc.";
  }

  const gitCommand = args[0].toLowerCase();

  switch (gitCommand) {
    case "add":
      return await tableOperations.add(args.slice(1), state, setState, data);

    case "status":
      return tableOperations.status(state, data);

    case "commit":
      return await tableOperations.commit(
        args.slice(1),
        state,
        setState,
        mutations,
        data,
      );

    case "reset":
      return tableOperations.reset(state, setState);

    case "diff":
      return tableOperations.diff(state, data);

    case "show":
      return tableOperations.show(data);

    case "rm":
      return (
        tableOperations.rm?.(args.slice(1), state, setState, mutations, data) ||
        ""
      );

    case "image":
      if (tableOperations.image) {
        return await tableOperations.image(
          args.slice(1),
          state,
          setState,
          mutations,
          data,
        );
      }
      return "Image commands not available for this table.";

    case "upload":
      if (args[0] === "image") {
        return "TRIGGER_FILE_UPLOAD";
      }
      return `Unknown upload target: ${args[0]}. Available: image`;

    default:
      return `Unknown git command: ${gitCommand}`;
  }
};

export const switchToTable = (
  tableName: string,
  setState: (state: GitState) => void,
  tableConfig: any,
): string => {
  if (!tableConfig) {
    return `Unknown table: ${tableName}`;
  }

  setState({
    context: {
      targetTable: tableName,
      targetRecord: undefined,
      isModifying: false,
    },
    stagedChanges: {},
  });

  return `Switched to ${tableConfig.displayName} table. Available fields: ${tableConfig.fields.join(", ")}`;
};

export const showContext = (state: GitState, tableConfigs: any): string => {
  if (!state.context.targetTable) {
    return "No table targeted. Use a table command (e.g., 'users', 'user-links') to target a table.";
  }

  const config = tableConfigs[state.context.targetTable];
  let context = `Current context:
  Table: ${config.displayName}
  Fields: ${config.fields.join(", ")}`;

  if (state.context.targetRecord) {
    context += `\n  Target Record: ${state.context.targetRecord._id}`;
    context += `\n  Modifying: ${state.context.isModifying ? "Yes" : "No"}`;
  }

  const stagedCount = Object.keys(state.stagedChanges).length;
  if (stagedCount > 0) {
    context += `\n  Staged Changes: ${stagedCount}`;
  }

  return context;
};

export const generateHelpText = (): string => {
  return `Available commands:
  help              - Show this help message
  context           - Show current git context
  
  Git commands:
  git <table>           - Switch to a table:
  ${Object.entries(TABLE_CONFIGS)
    .map(
      ([key, config]) =>
        `    git ${key.padEnd(12)} - Target ${config.displayName} table`,
    )
    .join("\n  ")}
  
  git add field=value   - Stage a field change (after targeting a table)
  git add -m id         - Target existing record for modification
  git status            - Show staged changes
  git commit            - Apply all staged changes
  git reset             - Discard all staged changes
  git diff              - Show differences between current and staged
  git show              - Display all records in the current table
  git rm                - Delete targeted record (requires yes/no confirmation)
  
  Image commands (for projects):
  git image add <url>   - Stage an image URL for upload
  git image list        - List current project images
  git image remove <n>  - Stage removal of image at index n
  
  Other commands:
  clear                 - Clear the terminal
  exit                  - Close terminal
  
Examples:
  git projects          - Target projects table
  git show              - Display all projects
  git add name="My App" - Stage project name
  git add description="Cool app" - Stage description
  git add image="https://example.com/image.png" - Stage image URL
  git commit "Create new project" - Commit all changes
  
  git add -m abc123     - Target specific project for editing
  git image list        - See current images
  git image remove 0    - Stage removal of first image
  git commit            - Apply changes`;
};
