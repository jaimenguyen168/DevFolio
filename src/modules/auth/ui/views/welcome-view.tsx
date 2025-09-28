"use client";

import React, { useEffect, useState } from "react";
import { Search, Code, User, ArrowRight, Globe } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const WelcomeView = () => {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");

  const user = useQuery(api.functions.users.getCurrentUser, {});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const searchResults = useQuery(
    api.functions.users.searchUsers,
    debouncedSearchValue ? { searchTerm: debouncedSearchValue } : "skip",
  );

  const handleUserSelect = (username: string) => {
    window.location.href = `/${username}`;
    setSearchOpen(false);
    setSearchValue("");
  };

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push(`/${user?.username}`);
    } else {
      router.push("/sign-in");
    }
  };

  const renderSearchContent = () => {
    if (!searchValue.trim()) {
      return (
        <CommandEmpty className="text-gray-400 py-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <Search className="text-gray-500" size={32} />
            <p>Type a username to search for portfolios</p>
            <p className="text-sm text-gray-500">
              Example: johndoe, alice_dev, etc.
            </p>
          </div>
        </CommandEmpty>
      );
    }

    if (debouncedSearchValue && searchResults === undefined) {
      return (
        <CommandEmpty className="text-gray-400 py-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-400"></div>
            <p>Searching for "{debouncedSearchValue}"...</p>
          </div>
        </CommandEmpty>
      );
    }

    // Show no results found
    if (debouncedSearchValue && searchResults && searchResults.length === 0) {
      return (
        <CommandEmpty className="text-gray-400 py-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <User className="text-gray-500" size={32} />
            <p>No portfolio found for "{debouncedSearchValue}"</p>
            <p className="text-sm text-gray-500">
              Try a different username or check the spelling
            </p>
          </div>
        </CommandEmpty>
      );
    }

    if (searchResults && searchResults.length > 0) {
      return (
        <div className="space-y-2">
          {searchResults.map((user) => (
            <button
              key={user._id}
              className="text-gray-300 hover:bg-slate-700 cursor-pointer p-3 rounded-md transition-colors flex items-center justify-between flex-1 w-full "
              onClick={() => handleUserSelect(user.username)}
            >
              <div className="flex items-center space-x-6">
                <User className="text-indigo-400" size={32} />
                <div className="flex flex-col justify-start items-start">
                  <div className="font-semibold text-white">
                    {user.name || user.username}
                  </div>
                  <div className="text-sm text-gray-400">@{user.username}</div>
                </div>
              </div>

              <div className="font-semibold text-orange-300">View</div>
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-screen bg-black p-8">
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 font-mono border border-gray-700 rounded-lg overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-700 p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/icon.png"
              alt="devfolio logo"
              width={25}
              height={25}
              className="size-7"
            />

            <span className="text-lg font-semibold text-orange-400">
              DevFolio
            </span>
          </Link>

          <div className="flex items-center space-x-2 text-gray-400">
            <span className="text-gray-400">Built with</span>
            <span className="text-orange-400 font-bold">Next.js</span>
            <button
              className="p-1 cursor-pointer"
              onClick={() =>
                window.open(
                  "https://github.com/jaimenguyen168/Dev-Portfolio",
                  "_blank",
                )
              }
            >
              <FaGithub size={28} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-12">
          <div className="text-center max-w-4xl">
            <div className="mb-12">
              <div className="mb-4 text-gray-400 text-lg">Welcome to</div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                DevFolio
              </h1>
              <div className="text-xl md:text-2xl text-indigo-500 mb-8">
                &gt; showcase your coding journey
              </div>

              {/* Description */}
              <div className="space-y-2 text-gray-500 text-base md:text-lg max-w-2xl mx-auto mb-12">
                <div>// create your own developer portfolio</div>
                <div>// or browse amazing portfolios from our community</div>
                <div className="flex flex-wrap items-center justify-center space-x-2">
                  <span className="text-indigo-500">const</span>
                  <span className="text-orange-300">possibilities</span>
                  <span className="text-white">=</span>
                  <span className="text-green-400">"unlimited";</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
              {/* Browse Portfolios */}
              <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent hover:bg-white/20 border-gray-600 text-gray-300 hover:text-orange-300 hover:border-orange-400 transition-all duration-300 px-8 py-6 text-lg font-mono group"
                  >
                    <Search
                      className="mr-3 group-hover:text-orange-300 group-hover:rotate-12"
                      size={20}
                    />
                    Browse Portfolios
                    <ArrowRight
                      className="ml-3 group-hover:translate-x-1 transition-transform"
                      size={20}
                    />
                  </Button>
                </DialogTrigger>

                <DialogContent className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border-gray-700 font-mono max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-white font-mono text-lg ">
                      // search portfolios
                    </DialogTitle>
                  </DialogHeader>
                  <Command className="bg-transparent" shouldFilter={false}>
                    <CommandInput
                      placeholder="Enter username to search..."
                      value={searchValue}
                      onValueChange={setSearchValue}
                      className="text-white"
                    />
                    <CommandList className="max-h-80">
                      {renderSearchContent()}
                    </CommandList>
                  </Command>
                </DialogContent>
              </Dialog>

              {/* Get Started */}
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-mono transition-all duration-300 group"
                onClick={handleGetStarted}
              >
                <Code
                  className="mr-3 group-hover:rotate-12 transition-transform"
                  size={20}
                />
                Get Started
                <ArrowRight
                  className="ml-3 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </Button>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-slate-800/50 border border-gray-700 rounded-lg p-6 hover:border-indigo-500/50 transition-colors">
                <Code className="text-indigo-400 mb-3" size={24} />
                <h3 className="text-white font-semibold mb-2">
                  Create Portfolio
                </h3>
                <p className="text-gray-400 text-sm">
                  Build your developer portfolio with our intuitive tools and
                  templates.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-gray-700 rounded-lg p-6 hover:border-green-500/50 transition-colors">
                <Globe className="text-green-400 mb-3" size={24} />
                <h3 className="text-white font-semibold mb-2">
                  Share Projects
                </h3>
                <p className="text-gray-400 text-sm">
                  Showcase your projects and connect with other developers
                  worldwide.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-gray-700 rounded-lg p-6 hover:border-orange-500/50 transition-colors">
                <FaGithub className="text-orange-400 mb-3" size={24} />
                <h3 className="text-white font-semibold mb-2">
                  GitHub Integration
                </h3>
                <p className="text-gray-400 text-sm">
                  Sync your repositories and display your coding activity
                  automatically.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-6">
          <div className="text-center text-gray-500 text-sm font-mono">
            // built with ❤️ for developers
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeView;
