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
    return "No table targeted. Use a table command (e.g., 'users', 'links') to target a table.";
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

export const generateHelpText = (state?: GitState): string => {
  // If no table is targeted, show general help
  if (!state?.context.targetTable) {
    return `Available commands:
  help              - Show help message
  context           - Show current git context
  
  Table commands (target a table first):
  ${Object.entries(TABLE_CONFIGS)
    .map(
      ([key, config]) =>
        `  git ${key.padEnd(12)} - Target ${config.displayName} table`,
    )
    .join("\n")}
  
  Other commands:
  clear             - Clear the terminal
  exit              - Close terminal

Examples:
  git users         - Target the users table
  git projects      - Target the projects table
  help              - Show context-specific help (after targeting a table)`;
  }

  // Table-specific help
  const config = TABLE_CONFIGS[state.context.targetTable];
  const tableName = config.displayName;

  let helpText = `${tableName} Table - Available Commands:

Basic Git Commands:
  git add field=value   - Stage a field change
  git status            - Show staged changes
  git commit            - Apply all staged changes
  git commit "message"  - Apply changes with a custom message
  git reset             - Discard all staged changes
  git diff              - Show differences between current and staged
  git show              - Display current ${tableName.toLowerCase()} data

Available Fields:
  ${config.fields.join(", ")}
`;

  // Add table-specific help sections
  switch (state.context.targetTable) {
    case "users":
      helpText += `
Examples:
  git add name="John Doe"
  git add title="Full Stack Developer"
  git add bio="Passionate about building great products"
  git add hashtags="react,nextjs,typescript"
  git commit "Update profile info"

Note: Hashtags can be comma or space-separated. The # symbol is optional.`;
      break;

    case "links":
      helpText += `
Record Management:
  git add -m <id>       - Target existing link for modification
  git rm                - Delete targeted link (requires confirmation)

Examples:
  # Create new link
  git add url="https://github.com/username"
  git add label="GitHub"
  git commit "Add GitHub link"
  
  # Modify existing link
  git show              - List all links with IDs
  git add -m abc123     - Target link by ID
  git add url="https://new-url.com"
  git commit "Update link URL"
  
  # Delete link
  git add -m abc123
  git rm`;
      break;

    case "projects":
      helpText += `
Record Management:
  git add -m <id>       - Target existing project for modification
  git rm                - Delete targeted project (requires confirmation)

Image Commands:
  git image add <url>   - Stage an image URL
  git image list        - List current project images
  git image remove <n>  - Stage removal of image at index n

Examples:
  # Create new project
  git add name="My Awesome App"
  git add description="A revolutionary application"
  git add url="https://myapp.com"
  git add githubUrl="https://github.com/user/repo"
  git add status="completed"
  git add techStack="React,Node.js,PostgreSQL"
  git commit "Create new project"
  
  # Add images
  git add -m abc123     - Target project
  git image add "https://example.com/screenshot.png"
  git commit
  
  # Modify existing project
  git show
  git add -m abc123
  git add description="Updated description"
  git commit "Update project details"`;
      break;

    case "educations":
      helpText += `
Record Management:
  git add -m <id>       - Target existing education for modification
  git rm                - Delete targeted education (requires confirmation)

Examples:
  # Add education
  git add institution="University Name"
  git add degree="Bachelor of Science"
  git add field="Computer Science"
  git add startYear="2018"
  git add endYear="2022"
  git add grade="First Class Honours"
  git add gpa="3.8"
  git add location="City, Country"
  git add type="university"
  git commit "Add university education"
  
  # Modify existing education
  git show
  git add -m abc123
  git add grade="Updated grade"
  git commit`;
      break;

    case "work":
      helpText += `
Record Management:
  git add -m <id>       - Target existing work experience for modification
  git rm                - Delete targeted work experience (requires confirmation)

Examples:
  # Add work experience
  git add company="Tech Company Inc"
  git add position="Software Engineer"
  git add startDate="2022-01"
  git add endDate="2024-03"
  git add location="Remote"
  git add type="full-time"
  git add description="Developed web applications"
  git add responsibilities="Built features,Code reviews,Mentoring"
  git commit "Add work experience"
  
  # Modify existing experience
  git show
  git add -m abc123
  git add endDate="present"
  git commit "Update to current position"`;
      break;
  }

  helpText += `

General Commands:
  git <table>       - Switch to a different table
  context           - Show current context and staged changes
  clear             - Clear terminal
  exit              - Close terminal`;

  return helpText;
};
