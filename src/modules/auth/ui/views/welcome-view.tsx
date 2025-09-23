"use client";

import React, { useState } from "react";
import { Search, Code, User, ArrowRight, Globe } from "lucide-react";
import { SignIn } from "@clerk/nextjs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
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

// Mock data - replace with actual API calls
const mockPortfolios = [
  { id: 1, name: "john_doe", title: "Full Stack Developer", projects: 12 },
  { id: 2, name: "jane_smith", title: "Frontend Specialist", projects: 8 },
  { id: 3, name: "alex_chen", title: "Backend Engineer", projects: 15 },
  { id: 4, name: "maria_garcia", title: "UI/UX Designer", projects: 10 },
  { id: 5, name: "david_kim", title: "DevOps Engineer", projects: 6 },
];

const WelcomeView = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredPortfolios = mockPortfolios.filter(
    (portfolio) =>
      portfolio.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      portfolio.title.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 font-mono border border-gray-700 rounded-lg overflow-hidden w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-700 p-6">
          <div className="flex items-center space-x-2 text-gray-400">
            <Code size={24} />
            <span className="text-lg">DevPortfolio</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-12">
          <div className="text-center max-w-4xl">
            <div className="mb-12">
              <div className="mb-4 text-gray-400 text-lg">Welcome to</div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Dev Portfolio
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
                    className="bg-transparent border-gray-600 text-gray-300 hover:text-orange-300 hover:border-orange-400 transition-all duration-300 px-8 py-6 text-lg font-mono group"
                  >
                    <Search
                      className="mr-3 group-hover:text-orange-300"
                      size={20}
                    />
                    Browse Portfolios
                    <ArrowRight
                      className="ml-3 group-hover:translate-x-1 transition-transform"
                      size={20}
                    />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border-gray-700 font-mono max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-white font-mono text-xl">
                      // search portfolios
                    </DialogTitle>
                  </DialogHeader>
                  <Command className="bg-transparent">
                    <CommandInput
                      placeholder="Search by username or title..."
                      value={searchValue}
                      onValueChange={setSearchValue}
                      className="border-gray-600 bg-slate-800 text-white placeholder:text-gray-500"
                    />
                    <CommandList className="max-h-80">
                      <CommandEmpty className="text-gray-400 py-6 text-center">
                        No portfolios found.
                      </CommandEmpty>
                      <CommandGroup>
                        {filteredPortfolios.map((portfolio) => (
                          <CommandItem
                            key={portfolio.id}
                            className="text-gray-300 hover:bg-slate-700 cursor-pointer p-4"
                            onSelect={() => {
                              // Handle portfolio selection - navigate to portfolio
                              console.log(
                                `Navigate to portfolio: ${portfolio.name}`,
                              );
                              setSearchOpen(false);
                            }}
                          >
                            <div className="flex items-center space-x-3 w-full">
                              <User className="text-indigo-400" size={20} />
                              <div className="flex-1">
                                <div className="font-semibold text-white">
                                  {portfolio.name}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {portfolio.title}
                                </div>
                              </div>
                              <div className="text-xs text-orange-300">
                                {portfolio.projects} projects
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </DialogContent>
              </Dialog>

              {/* Get Started */}
              <Dialog open={showSignIn} onOpenChange={setShowSignIn}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-mono transition-all duration-300 group"
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
                </DialogTrigger>
                <DialogContent className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border-gray-700 font-mono max-w-md">
                  <DialogHeader className="mb-4">
                    <DialogTitle className="text-white font-mono text-xl text-center">
                      // join the community
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center">
                    // In your WelcomeView, replace the SignIn component with:
                    <div className="text-center">
                      <p className="text-gray-400 mb-4">
                        Ready to get started?
                      </p>
                      <Button
                        onClick={() => (window.location.href = "/sign-in")}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-mono"
                      >
                        Sign In / Sign Up
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
