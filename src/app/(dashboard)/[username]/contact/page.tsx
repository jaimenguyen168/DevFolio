import React from "react";
import ContactView from "@/modules/contact/ui/views/contact-view";
import { Metadata } from "next";
import { generatePageMetadata } from "@/constants/metadata";

interface ContactPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { username } = await params;
  return generatePageMetadata(username, "contact");
}

const ContactPage = async ({ params }: ContactPageProps) => {
  const { username } = await params;

  if (!username) {
    return null;
  }

  return <ContactView username={username} />;
};
export default ContactPage;
