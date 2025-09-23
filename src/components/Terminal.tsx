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

interface HistoryEntry {
  type: "input" | "output";
  content: string;
}

interface StagedChanges {
  [key: string]: any;
}

const Terminal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: "output", content: "Welcome to Git-Style User Terminal v1.0.0" },
    { type: "output", content: 'Type "help" for available commands.' },
  ]);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Get current user data from Convex
  const currentUser = useQuery(api.functions.users.getCurrentUser);
  const updateUser = useMutation(api.functions.users.updateUser);

  // Staged changes that haven't been committed yet
  const [stagedChanges, setStagedChanges] = useState<StagedChanges>({});

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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
        output = `Available commands:
  help              - Show this help message
  git add users.field=value - Stage a user field change
  git status        - Show staged changes
  git commit        - Apply all staged changes
  git reset         - Discard all staged changes
  git diff          - Show differences between current and staged
  show user         - Display current user data
  clear             - Clear the terminal
  exit              - Close terminal
  
Examples:
  git add users.name="Jane Smith"
  git add users.title="Senior Developer"
  git add users.phone="+1-555-9999"`;
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

      case "show":
        if (parts[1]?.toLowerCase() === "user") {
          if (!currentUser) {
            output = "Error: No user data available. Please log in.";
          } else {
            output = formatUserData(currentUser);
          }
        } else {
          output = `Usage: show user`;
        }
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
      return "Usage: git <command>. Try 'git status', 'git add', 'git commit', etc.";
    }

    const gitCommand = args[0].toLowerCase();

    switch (gitCommand) {
      case "add":
        return handleGitAdd(args.slice(1));

      case "status":
        return handleGitStatus();

      case "commit":
        return await handleGitCommit(args.slice(1));

      case "reset":
        return handleGitReset();

      case "diff":
        return handleGitDiff();

      default:
        return `Unknown git command: ${gitCommand}`;
    }
  };

  const handleGitAdd = (args: string[]): string => {
    if (!currentUser) {
      return "Error: No user data available. Please log in.";
    }

    if (args.length === 0) {
      return "Usage: git add users.field=value";
    }

    const assignment = args.join(" ");

    // Parse users.field=value
    const match = assignment.match(/^users\.([^=]+)=(.+)$/);
    if (!match) {
      return "Invalid format. Use: git add users.field=value";
    }

    const [, field, value] = match;

    // Remove quotes if present
    const cleanValue = value.replace(/^["']|["']$/g, "");

    // Validate field exists - check against the mutation args
    const validFields = ["name", "email", "title", "username", "phone"];
    if (!validFields.includes(field)) {
      return `Invalid field: ${field}. Valid fields: ${validFields.join(", ")}`;
    }

    // Stage the change
    setStagedChanges((prev) => ({
      ...prev,
      [field]: cleanValue,
    }));

    return `Staged change: users.${field} = "${cleanValue}"`;
  };

  const handleGitStatus = (): string => {
    if (!currentUser) {
      return "Error: No user data available. Please log in.";
    }

    const stagedKeys = Object.keys(stagedChanges);

    if (stagedKeys.length === 0) {
      return "No changes staged for commit.";
    }

    let status = "Changes staged for commit:\n";
    stagedKeys.forEach((key) => {
      const currentValue = (currentUser as any)[key] || "(empty)";
      const newValue = stagedChanges[key];
      status += `  modified: users.${key}\n`;
      status += `    ${currentValue} → ${newValue}\n`;
    });

    return status;
  };

  const handleGitCommit = async (args: string[]): Promise<string> => {
    if (!currentUser) {
      return "Error: No user data available. Please log in.";
    }

    const stagedKeys = Object.keys(stagedChanges);

    if (stagedKeys.length === 0) {
      return "No changes staged for commit.";
    }

    try {
      // Apply staged changes via Convex mutation
      await updateUser({ updates: stagedChanges });

      // Clear staged changes after successful commit
      setStagedChanges({});

      const message =
        args.length > 0
          ? args.join(" ").replace(/^["']|["']$/g, "")
          : "Update user data";

      return `Committed ${stagedKeys.length} change(s): "${message}"
Updated fields: ${stagedKeys.join(", ")}`;
    } catch (error) {
      return `Error committing changes: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  };

  const handleGitReset = (): string => {
    const stagedCount = Object.keys(stagedChanges).length;
    setStagedChanges({});

    if (stagedCount === 0) {
      return "No staged changes to reset.";
    }

    return `Reset ${stagedCount} staged change(s).`;
  };

  const handleGitDiff = (): string => {
    if (!currentUser) {
      return "Error: No user data available. Please log in.";
    }

    const stagedKeys = Object.keys(stagedChanges);

    if (stagedKeys.length === 0) {
      return "No staged changes to diff.";
    }

    let diff = "Differences between current and staged:\n\n";
    stagedKeys.forEach((key) => {
      const currentValue = (currentUser as any)[key] || "(empty)";
      const newValue = stagedChanges[key];
      diff += `users.${key}:\n`;
      diff += `- ${currentValue}\n`;
      diff += `+ ${newValue}\n\n`;
    });

    return diff;
  };

  const formatUserData = (user: any): string => {
    if (!user) {
      return "Error: No user data available";
    }

    return `Current User Data:
  name: "${user.name || "(not set)"}"
  email: "${user.email || "(not set)"}"
  username: "${user.username || "(not set)"}"
  title: "${user.title || "(not set)"}"
  phone: "${user.phone || "(not set)"}"`;
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

  const getStagedIndicator = (): string => {
    const stagedCount = Object.keys(stagedChanges).length;
    return stagedCount > 0 ? ` (${stagedCount} staged)` : "";
  };

  // Show loading state if user data is still loading
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
      <DrawerTrigger asChild>
        <button className="hover:bg-gray-700 p-1 rounded">
          <TerminalSquare size={24} />
        </button>
      </DrawerTrigger>

      <DrawerContent className="h-1/2 bg-gray-700 border-t border-gray-600">
        <DrawerHeader className="border-b border-gray-600 bg-black flex-shrink-0">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center space-x-2 text-white">
              <TerminalSquare size={20} className="text-green-400" />
              <span className="font-mono text-sm">
                Git Terminal{getStagedIndicator()}
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
                  <div className="text-green-400">{entry.content}</div>
                ) : (
                  <div className="text-gray-300 whitespace-pre-line">
                    {entry.content}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex-shrink-0 border-t border-gray-800 p-4 bg-black">
            <div className="flex items-center text-green-400">
              <span className="mr-2">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-white caret-white"
                placeholder="Enter git command..."
              />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default Terminal;
