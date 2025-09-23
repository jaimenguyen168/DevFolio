"use client";

import React, { useState } from "react";
import { Mail, Phone, User, PanelRight, X, ExternalLink } from "lucide-react";
import CodeMirror, { EditorView, oneDark } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import EmailSuccessView from "@/modules/contact/ui/components/EmailSuccessView";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import NotFoundView from "@/modules/auth/ui/views/not-found-view";

const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name must not exceed 50 characters." }),
  email: z.email({ message: "Please enter a valid email address." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(500, { message: "Message must not exceed 500 characters." }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactViewProps {
  username: string;
}

const ContactView = ({ username }: ContactViewProps) => {
  const user = useQuery(api.functions.users.getUser, {
    username: username,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        form.reset();
      } else {
        setSubmitStatus("error");
        console.error("Failed to send message:", result.error);
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      setSubmitStatus("error");
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleSendNewMessage = () => {
    setSubmitStatus("idle");
    form.reset(
      {
        name: "",
        email: "",
        message: "",
      },
      {
        keepErrors: false,
        keepDirty: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false,
      },
    );
  };

  const watchedValues = form.watch();

  const generateCode = () => {
    const date = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    return `/**
 * Contact Form Handler
 * Please send me your message to connect with me
*/
const button = document.getElementById('submit-button');

const message = {${`
  name: "${watchedValues.name}",
  email: "${watchedValues.email}",
  message: "${watchedValues.message}",
  date: "${date}",
}`}

button.addEventListener('click', () => {
  form.send(message);
});`;
  };

  const codeMirrorExtensions = [javascript(), EditorView.lineWrapping];

  const SidebarContent = () => (
    <div>
      {/* Contact Info Section */}
      <Accordion type="multiple" defaultValue={["contacts"]} className="w-full">
        <AccordionItem value="contacts" className="border-gray-700">
          <AccordionTrigger className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors hover:no-underline py-3.5 border-b border-gray-700 rounded-none px-4">
            <span className="flex items-center">
              <User size={16} className="mr-2" /> _contact
            </span>
          </AccordionTrigger>
          <AccordionContent className="p-3">
            <div className="space-y-2 mx-4">
              <Button
                disabled
                variant="ghost"
                className="text-gray-200 justify-start p-0"
              >
                <Mail size={14} className="mr-2" />
                <span className="text-sm">{user?.email}</span>
              </Button>
              {user?.phone && (
                <Button
                  variant="ghost"
                  className="text-gray-200 justify-start p-0"
                  disabled
                >
                  <Phone size={14} className="mr-2" />
                  <span className="text-sm">{user.phone}</span>
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Find Me Also In Section */}
        <AccordionItem value="find-me-also-in" className="border-gray-700">
          <AccordionTrigger className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors hover:no-underline py-3.5 border-b border-gray-700 rounded-none px-4">
            <span className="flex items-center">
              <User size={16} className="mr-2" /> _find-me-also-in
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="flex flex-col mt-2 space-y-2 ml-6">
              <Button
                variant="ghost"
                className="text-blue-400 hover:text-blue-300 justify-start p-2"
              >
                <ExternalLink size={14} className="mr-2" />
                <span className="text-sm">YouTube</span>
              </Button>
              <Button
                variant="ghost"
                className="text-blue-400 hover:text-blue-300 justify-start p-2"
              >
                <ExternalLink size={14} className="mr-2" />
                <span className="text-sm">dev.to</span>
              </Button>
              <Button
                variant="ghost"
                className="text-blue-400 hover:text-blue-300 justify-start p-2"
              >
                <ExternalLink size={14} className="mr-2" />
                <span className="text-sm">Instagram</span>
              </Button>
              <Button
                variant="ghost"
                className="text-blue-400 hover:text-blue-300 justify-start p-2"
              >
                <ExternalLink size={14} className="mr-2" />
                <span className="text-sm">Twitch</span>
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  if (user === undefined) {
    return null;
  }

  if (!user) {
    return <NotFoundView />;
  }

  return (
    <div className="flex flex-col sm:flex-row h-full relative flex-1">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-md z-40 sm:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Left Sidebar - Desktop: Fixed, Mobile: Overlay */}
      <div
        className={`
        ${/* Desktop styles */ ""}
        sm:w-[300px] sm:border-r sm:border-gray-700 sm:flex sm:flex-col sm:h-full sm:relative sm:transform-none sm:transition-none
        ${/* Mobile styles */ ""}
        fixed top-0 left-0 h-full w-[280px] bg-slate-900 border-r border-gray-700 flex flex-col z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
      `}
      >
        {/* Mobile Close Button */}
        <div className="sm:hidden flex items-center justify-between p-4 border-b border-gray-700">
          <span className="text-white font-medium">_contact-me</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-gray-400 hover:bg-gray-700 hover:text-white p-1"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SidebarContent />
        </div>
      </div>

      {/* Right Container - Scrollable content (middle + right sections) */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Tab Header */}
        <div className="items-center border-b border-gray-700 sticky top-0  z-10 w-full">
          <div className="px-4 py-3 flex items-center w-full sm:w-fit justify-between md:justify-start gap-3 sm:border-r sm:border-gray-700">
            <div className="flex items-center w-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="sm:hidden text-gray-400 hover:bg-gray-700 hover:text-white p-1 mr-3"
              >
                <PanelRight size={20} />
              </Button>
              <span className="text-gray-400 text-sm">_contact</span>
            </div>

            <button className="text-gray-500 hover:text-white cursor-pointer">
              ×
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col lg:flex-row flex-1 w-full min-h-0 max-w-[1600px] mx-auto">
          {/* Middle Section - Contact Form */}
          <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-700 flex flex-col p-8 xl:p-16 2xl:p-28 flex-shrink-0">
            {submitStatus === "success" ? (
              <EmailSuccessView onPress={handleSendNewMessage} />
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-8"
                >
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 text-sm">
                          _name:
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                            className="bg-slate-800 border-gray-600 text-white placeholder-gray-400 focus-visible:ring-orange-400 focus-visible:border-orange-400 text-sm w-full"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 text-sm">
                          _email:
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john-doe@gmail.com"
                            {...field}
                            className="bg-slate-800 border-gray-600 text-white placeholder-gray-400 focus-visible:ring-orange-400 focus-visible:border-orange-400 text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Message Field */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="min-w-1/2">
                        <FormLabel className="text-gray-300 text-sm">
                          _message:
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Hey! Just checked your website and it looks awesome! Also, I checked your articled on Medium. Lerned a few nice tips. Than!"
                            className="bg-slate-800 border-gray-600 text-white placeholder-gray-400 focus-visible:ring-orange-400 focus-visible:border-orange-400 text-sm w-full !resize-none"
                            rows={10}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded transition-colors mt-4"
                    disabled={
                      form.formState.isSubmitting ||
                      !form.formState.isValid ||
                      !form.formState.isDirty
                    }
                  >
                    {form.formState.isSubmitting
                      ? "Submitting..."
                      : "submit-message"}
                  </Button>
                </form>
              </Form>
            )}
          </div>

          {/* Right Section - Code Mirror */}
          <div className="flex-1 lg:w-1/2 w-full flex flex-col min-h-[400px] lg:min-h-0 flex-shrink-0 p-8 xl:p-16 2xl:p-28 ">
            <div className="flex-1 min-h-0 w-full">
              <CodeMirror
                value={generateCode()}
                theme={oneDark}
                extensions={codeMirrorExtensions}
                editable={false}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: false,
                  dropCursor: false,
                  allowMultipleSelections: false,
                  indentOnInput: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  autocompletion: false,
                  highlightSelectionMatches: false,
                  searchKeymap: false,
                }}
                style={{
                  fontSize: "14px",
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  height: "100%",
                  backgroundColor: "transparent",
                }}
                className="[&_.cm-editor]:!bg-transparent [&_.cm-focused]:!bg-transparent [&_.cm-gutters]:w-8 [&_.cm-gutters]:min-w-8 [&_.cm-gutters]:!bg-transparent [&_.cm-gutter]:!bg-transparent [&_.cm-lineNumbers]:!bg-transparent h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
