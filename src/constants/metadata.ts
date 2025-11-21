import { Metadata } from "next";

export interface MetadataConfig {
  username: string;
  pageType: "home" | "about" | "projects" | "contact";
  customTitle?: string;
  customDescription?: string;
}

const PAGE_CONFIG = {
  home: {
    titleSuffix: "Developer Portfolio",
    description: (username: string) =>
      `View ${username}'s professional developer portfolio on DevFolio.`,
    path: (username: string) => `/${username}`,
  },
  about: {
    titleSuffix: "Developer Portfolio",
    description: (username: string) =>
      `Learn more about ${username}'s background, experience, and skills. View their professional bio, work experience, and education.`,
    path: (username: string) => `/${username}/about`,
  },
  projects: {
    titleSuffix: "Projects - Developer Portfolio",
    description: (username: string) =>
      `Explore ${username}'s latest projects, code samples, and technical achievements.`,
    path: (username: string) => `/${username}/projects`,
  },
  contact: {
    titleSuffix: "Contact - Developer Portfolio",
    description: (username: string) =>
      `Get in touch with ${username}. View contact information and connect professionally.`,
    path: (username: string) => `/${username}/contact`,
  },
} as const;

export function generateDevFolioMetadata({
  username,
  pageType,
  customTitle,
  customDescription,
}: MetadataConfig): Metadata {
  const config = PAGE_CONFIG[pageType];

  const title =
    customTitle ||
    (pageType === "home"
      ? `${username} - ${config.titleSuffix}`
      : `${pageType.charAt(0).toUpperCase() + pageType.slice(1)} ${username} - ${config.titleSuffix}`);

  const description = customDescription || config.description(username);
  const url = `https://devfolio.me${config.path(username)}`;

  return {
    title: `${title} | DevFolio`,
    description,
    openGraph: {
      title: `${title} | DevFolio`,
      description,
      type: "profile",
      url,
      siteName: "DevFolio",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | DevFolio`,
      description,
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generatePageMetadata(
  username: string,
  pageType: MetadataConfig["pageType"],
): Metadata {
  return generateDevFolioMetadata({ username, pageType });
}
