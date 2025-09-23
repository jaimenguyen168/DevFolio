import React from "react";
import ContactView from "@/modules/contact/ui/views/contact-view";

interface ContactPageProps {
  params: Promise<{ username: string }>;
}

const ContactPage = async ({ params }: ContactPageProps) => {
  const { username } = await params;

  if (!username) {
    return null;
  }

  return <ContactView username={username} />;
};
export default ContactPage;
