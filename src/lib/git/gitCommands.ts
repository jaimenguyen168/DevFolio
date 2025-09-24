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
      return tableOperations.rm(
        args.slice(1),
        state,
        setState,
        mutations,
        data,
      );

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
  
  Other commands:
  clear                 - Clear the terminal
  exit                  - Close terminal
  
Examples:
  git users             - Target users table
  git show              - Display current user info
  git add name="John"   - Stage username change
  
  git user-links        - Target user-links table
  git show              - Display all user links
  git add -m 12345      - Target specific link for editing
  git add label=github  - Stage label change for targeted link`;
};
