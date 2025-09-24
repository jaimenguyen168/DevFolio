import React, { useState, useRef, useEffect } from "react";
import { TerminalSquare, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUsername } from "@/components/UsernameProvider";
import { GitState } from "@/lib/git/types";
import {
  executeGitCommand,
  generateHelpText,
  showContext,
  switchToTable,
} from "@/lib/git/gitCommands";
import { TABLE_CONFIGS, TABLE_OPERATIONS } from "@/lib/git/configs";
import { useRouter } from "next/navigation";

interface HistoryEntry {
  type: "input" | "output";
  content: string;
}

const Terminal = () => {
  const router = useRouter();
  const { username } = useUsername();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      type: "output",
      content: "Welcome to Git-Style Terminal v2.0.0",
    },
    { type: "output", content: 'Type "help" for available commands.' },
  ]);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const [gitState, setGitState] = useState<GitState>({
    context: {},
    stagedChanges: {},
  });

  // Queries
  const currentUser = useQuery(api.functions.users.getCurrentUser);
  const userLinks = useQuery(api.functions.userLinks.getUserLinks, {
    username: username as string,
  });
  const userProjects = useQuery(api.functions.projects.getProjects, {
    username: username as string,
  });

  // Mutations
  const updateUser = useMutation(api.functions.users.updateUser);
  const createUserLink = useMutation(api.functions.userLinks.createUserLink);
  const updateUserLink = useMutation(api.functions.userLinks.updateUserLink);
  const deleteUserLink = useMutation(api.functions.userLinks.deleteUserLink);
  const createProject = useMutation(api.functions.projects.createProject);
  const updateProject = useMutation(api.functions.projects.updateProject);
  const deleteProject = useMutation(api.functions.projects.deleteProject);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop =
        terminalContentRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = async (command: string): Promise<void> => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    setHistory((prev) => [
      ...prev,
      { type: "input", content: `$ ${trimmedCommand}` },
    ]);
    setCommandHistory((prev) => [...prev, trimmedCommand]);
    setHistoryIndex(-1);

    const parts = trimmedCommand.split(" ");
    const mainCommand = parts[0].toLowerCase();
    let output = "";

    switch (mainCommand) {
      case "help":
        output = generateHelpText();
        break;

      case "clear":
        setHistory([]);
        return;

      case "exit":
        setIsOpen(false);
        return;

      case "git":
        output = await handleGitCommand(parts.slice(1));
        break;

      case "context":
        output = showContext(gitState, TABLE_CONFIGS);
        break;

      default:
        output = `Command not found: ${trimmedCommand}. Type 'help' for available commands.`;
    }

    if (output) {
      setHistory((prev) => [...prev, { type: "output", content: output }]);
    }
  };

  const handleGitCommand = async (args: string[]): Promise<string> => {
    if (args.length === 0) {
      return "Usage: git <command>. Type 'help' for available git commands.";
    }

    const gitSubCommand = args[0].toLowerCase();

    if (TABLE_CONFIGS[gitSubCommand]) {
      return switchToTable(
        gitSubCommand,
        setGitState,
        TABLE_CONFIGS[gitSubCommand],
      );
    }

    if (!gitState.context.targetTable) {
      return "No table targeted. Use 'git <table>' to target a table first (e.g., 'git users', 'git user-links').";
    }

    const tableOperations = TABLE_OPERATIONS[gitState.context.targetTable];
    if (!tableOperations) {
      return `No git operations available for table: ${gitState.context.targetTable}`;
    }

    const mutations = {
      updateUser,
      createUserLink,
      updateUserLink,
      deleteUserLink,
      createProject,
      updateProject,
      deleteProject,
    };

    let data: any = null;
    switch (gitState.context.targetTable) {
      case "users":
        data = currentUser;
        break;
      case "links":
        data = { userLinks, currentUser };
        break;
      case "projects":
        data = { userProjects, currentUser };
        break;
      default:
        data = null;
    }

    try {
      const result = await executeGitCommand(
        args,
        gitState,
        setGitState,
        tableOperations,
        mutations,
        data,
      );

      if (
        gitState.context.targetTable === "users" &&
        args[0] === "commit" &&
        gitState.stagedChanges.username &&
        gitState.stagedChanges.username !== username
      ) {
        setIsOpen(false);
        router.push(`/${gitState.stagedChanges.username}/home`);

        return (
          result + "\n\nUsername updated! Redirecting to new profile URL..."
        );
      }

      return result;
    } catch (error) {
      return `Error executing git command: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      executeCommand(currentInput).catch(console.error);
      setCurrentInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCurrentInput(e.target.value);
  };

  const getContextIndicator = (): string => {
    const stagedCount = Object.keys(gitState.stagedChanges).length;
    const stagedIndicator = stagedCount > 0 ? ` (${stagedCount} staged)` : "";

    if (gitState.context.targetTable) {
      const config = TABLE_CONFIGS[gitState.context.targetTable];
      const modifyIndicator = gitState.context.isModifying
        ? ` [editing ${gitState.context.targetRecord?._id}]`
        : "";
      return ` - ${config.displayName}${modifyIndicator}${stagedIndicator}`;
    }

    return stagedIndicator;
  };

  if (currentUser === undefined) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <button className="hover:bg-gray-700 p-1 rounded">
            <TerminalSquare size={24} />
          </button>
        </DrawerTrigger>
        <DrawerContent className="h-96 bg-gray-700 border-t border-gray-600">
          <div className="flex items-center justify-center h-full">
            <div className="text-white">Loading...</div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center space-x-3">
        <div className="text-gray-400 hidden md:block">Edit Terminal</div>
        <DrawerTrigger asChild>
          <button className="hover:bg-gray-700 p-1 rounded">
            <TerminalSquare size={24} />
          </button>
        </DrawerTrigger>
      </div>

      <DrawerContent className="h-2/5 bg-gray-700 border-t border-gray-600">
        <DrawerHeader className="border-b border-gray-600 bg-black flex-shrink-0">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center space-x-2 text-white">
              <TerminalSquare size={20} className="text-orange-400" />
              <span className="font-mono text-sm">
                Git Terminal{getContextIndicator()}
              </span>
            </DrawerTitle>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </DrawerHeader>

        <div className="flex-1 bg-slate-900 overflow-hidden flex flex-col">
          <div
            ref={terminalContentRef}
            className="flex-1 p-4 overflow-y-auto font-mono text-sm"
          >
            {history.map((entry, index) => (
              <div key={index} className="mb-1">
                {entry.type === "input" ? (
                  <div className="text-orange-400 select-text cursor-text">
                    {entry.content}
                  </div>
                ) : (
                  <div className="text-gray-300 whitespace-pre-line select-text cursor-text">
                    {entry.content}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex-shrink-0 border-t border-gray-800 p-4 py-6 bg-black">
            <div className="flex items-center text-orange-400">
              <span className="mr-2">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-white caret-white"
                placeholder="Enter command..."
                autoFocus
              />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default Terminal;
