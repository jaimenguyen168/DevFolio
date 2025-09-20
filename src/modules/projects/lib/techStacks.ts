import {
  FaReact,
  FaVuejs,
  FaAngular,
  FaJs,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
  FaPython,
  FaJava,
  FaPhp,
  FaGitAlt,
  FaDocker,
  FaAws,
} from "react-icons/fa";
import { FaFlutter, FaGolang } from "react-icons/fa6";
import {
  SiTypescript,
  SiNextdotjs,
  SiNuxtdotjs,
  SiGatsby,
  SiSvelte,
  SiTailwindcss,
  SiBootstrap,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiGraphql,
  SiExpress,
  SiNestjs,
  SiDjango,
  SiFlask,
  SiSpring,
  SiKubernetes,
  SiFirebase,
  SiSupabase,
  SiVercel,
  SiNetlify,
  SiAndroid,
  SiIos,
  SiUnity,
  SiBlender,
  SiFigma,
  SiWebpack,
  SiVite,
  SiJest,
  SiCypress,
  SiSwift,
} from "react-icons/si";
import { Project } from "@/modules/projects/types";

export const TECH_STACK = {
  // Frontend Frameworks
  React: {
    name: "React",
    icon: FaReact,
    color: "#61DAFB",
    category: "frontend",
  },
  Vue: { name: "Vue", icon: FaVuejs, color: "#4FC08D", category: "frontend" },
  Angular: {
    name: "Angular",
    icon: FaAngular,
    color: "#DD0031",
    category: "frontend",
  },
  Svelte: {
    name: "Svelte",
    icon: SiSvelte,
    color: "#FF3E00",
    category: "frontend",
  },

  // Meta Frameworks
  "Next.js": {
    name: "Next.js",
    icon: SiNextdotjs,
    color: "#000000",
    category: "frontend",
  },
  "Nuxt.js": {
    name: "Nuxt.js",
    icon: SiNuxtdotjs,
    color: "#00DC82",
    category: "frontend",
  },
  Gatsby: {
    name: "Gatsby",
    icon: SiGatsby,
    color: "#663399",
    category: "frontend",
  },

  // Languages
  JavaScript: {
    name: "JavaScript",
    icon: FaJs,
    color: "#F7DF1E",
    category: "language",
  },
  TypeScript: {
    name: "TypeScript",
    icon: SiTypescript,
    color: "#3178C6",
    category: "language",
  },
  Python: {
    name: "Python",
    icon: FaPython,
    color: "#3776AB",
    category: "language",
  },
  Java: { name: "Java", icon: FaJava, color: "#ED8B00", category: "language" },
  PHP: { name: "PHP", icon: FaPhp, color: "#777BB4", category: "language" },
  Go: { name: "Go", icon: FaGolang, color: "#00ADD8", category: "language" },

  // Markup & Styling
  HTML: { name: "HTML", icon: FaHtml5, color: "#E34F26", category: "markup" },
  CSS: { name: "CSS", icon: FaCss3Alt, color: "#1572B6", category: "styling" },
  Tailwind: {
    name: "Tailwind",
    icon: SiTailwindcss,
    color: "#06B6D4",
    category: "styling",
  },
  Bootstrap: {
    name: "Bootstrap",
    icon: SiBootstrap,
    color: "#7952B3",
    category: "styling",
  },

  // Backend Frameworks
  "Node.js": {
    name: "Node.js",
    icon: FaNodeJs,
    color: "#339933",
    category: "backend",
  },
  Express: {
    name: "Express",
    icon: SiExpress,
    color: "#000000",
    category: "backend",
  },
  NestJS: {
    name: "NestJS",
    icon: SiNestjs,
    color: "#E0234E",
    category: "backend",
  },
  Django: {
    name: "Django",
    icon: SiDjango,
    color: "#092E20",
    category: "backend",
  },
  Flask: {
    name: "Flask",
    icon: SiFlask,
    color: "#000000",
    category: "backend",
  },
  Spring: {
    name: "Spring",
    icon: SiSpring,
    color: "#6DB33F",
    category: "backend",
  },

  // Databases
  MongoDB: {
    name: "MongoDB",
    icon: SiMongodb,
    color: "#47A248",
    category: "database",
  },
  PostgreSQL: {
    name: "PostgreSQL",
    icon: SiPostgresql,
    color: "#4169E1",
    category: "database",
  },
  MySQL: {
    name: "MySQL",
    icon: SiMysql,
    color: "#4479A1",
    category: "database",
  },
  Redis: {
    name: "Redis",
    icon: SiRedis,
    color: "#DC382D",
    category: "database",
  },

  // API Technologies
  GraphQL: {
    name: "GraphQL",
    icon: SiGraphql,
    color: "#E10098",
    category: "api",
  },

  // Mobile Development
  Flutter: {
    name: "Flutter",
    icon: FaFlutter,
    color: "#02569B",
    category: "mobile",
  },
  "React Native": {
    name: "React Native",
    icon: FaReact,
    color: "#61DAFB",
    category: "mobile",
  },
  Android: {
    name: "Android",
    icon: SiAndroid,
    color: "#3DDC84",
    category: "mobile",
  },
  iOS: { name: "iOS", icon: SiIos, color: "#000000", category: "mobile" },

  // Cloud & DevOps
  AWS: { name: "AWS", icon: FaAws, color: "#FF9900", category: "cloud" },
  Docker: {
    name: "Docker",
    icon: FaDocker,
    color: "#2496ED",
    category: "devops",
  },
  Kubernetes: {
    name: "Kubernetes",
    icon: SiKubernetes,
    color: "#326CE5",
    category: "devops",
  },

  // Backend as a Service
  Firebase: {
    name: "Firebase",
    icon: SiFirebase,
    color: "#FFCA28",
    category: "baas",
  },
  Supabase: {
    name: "Supabase",
    icon: SiSupabase,
    color: "#3ECF8E",
    category: "baas",
  },

  // Deployment Platforms
  Vercel: {
    name: "Vercel",
    icon: SiVercel,
    color: "#000000",
    category: "deployment",
  },
  Netlify: {
    name: "Netlify",
    icon: SiNetlify,
    color: "#00C7B7",
    category: "deployment",
  },

  // Game Development
  Unity: {
    name: "Unity",
    icon: SiUnity,
    color: "#000000",
    category: "gamedev",
  },

  // Design Tools
  Blender: {
    name: "Blender",
    icon: SiBlender,
    color: "#F5792A",
    category: "design",
  },
  Figma: { name: "Figma", icon: SiFigma, color: "#F24E1E", category: "design" },

  // Build Tools
  Webpack: {
    name: "Webpack",
    icon: SiWebpack,
    color: "#8DD6F9",
    category: "build",
  },
  Vite: { name: "Vite", icon: SiVite, color: "#646CFF", category: "build" },

  // Testing
  Jest: { name: "Jest", icon: SiJest, color: "#C21325", category: "testing" },
  Cypress: {
    name: "Cypress",
    icon: SiCypress,
    color: "#17202C",
    category: "testing",
  },

  // Version Control
  Git: { name: "Git", icon: FaGitAlt, color: "#F05032", category: "vcs" },

  // Swift
  Swift: {
    name: "Swift",
    icon: SiSwift,
    color: "#FFAC1C",
    category: "language",
  },
};

export const getUniqueTechnologies = (projects: Project[]): string[] => {
  const allTechs = new Set();
  projects.forEach((project: Project) => {
    project.technologies?.forEach((tech) => allTechs.add(tech));
  });

  return (Array.from(allTechs) as string[]) || [];
};

export const getTechInfo = (tech: string) => {
  return (
    TECH_STACK[tech as keyof typeof TECH_STACK] || {
      name: tech,
      icon: FaJs,
      color: "#666666",
      category: "other",
    }
  );
};

export default TECH_STACK;
