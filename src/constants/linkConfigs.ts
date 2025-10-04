import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaStackOverflow,
  FaMedium,
  FaDev,
  FaYoutube,
  FaTwitch,
  FaDiscord,
  FaSlack,
  FaTelegram,
  FaInstagram,
  FaFacebook,
  FaMastodon,
  FaReddit,
} from "react-icons/fa";
import { ExternalLink, Mail, Rss } from "lucide-react";
import {
  SiCodepen,
  SiCodesandbox,
  SiDribbble,
  SiBehance,
  SiFigma,
  SiNotion,
  SiHashnode,
  SiSubstack,
  SiLeetcode,
  SiCodewars,
  SiReplit,
} from "react-icons/si";

export const linkConfigs = [
  // Core professional
  { label: "github", Icon: FaGithub },
  { label: "linkedin", Icon: FaLinkedin },
  { label: "twitter", Icon: FaTwitter },
  { label: "email", Icon: Mail },
  { label: "website", Icon: ExternalLink },

  // Developer communities
  { label: "stackoverflow", Icon: FaStackOverflow },
  { label: "dev.to", Icon: FaDev },
  { label: "hashnode", Icon: SiHashnode },
  { label: "medium", Icon: FaMedium },
  { label: "substack", Icon: SiSubstack },

  // Code platforms
  { label: "codepen", Icon: SiCodepen },
  { label: "codesandbox", Icon: SiCodesandbox },
  { label: "replit", Icon: SiReplit },
  { label: "leetcode", Icon: SiLeetcode },
  { label: "codewars", Icon: SiCodewars },

  // Design
  { label: "dribbble", Icon: SiDribbble },
  { label: "behance", Icon: SiBehance },
  { label: "figma", Icon: SiFigma },

  // Content/streaming
  { label: "youtube", Icon: FaYoutube },
  { label: "twitch", Icon: FaTwitch },

  // Social/communication
  { label: "discord", Icon: FaDiscord },
  { label: "slack", Icon: FaSlack },
  { label: "telegram", Icon: FaTelegram },
  { label: "mastodon", Icon: FaMastodon },
  { label: "reddit", Icon: FaReddit },
  { label: "instagram", Icon: FaInstagram },

  // Other
  { label: "notion", Icon: SiNotion },
  { label: "blog", Icon: Rss },
];
