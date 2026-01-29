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
  FaStripe,
  FaPaypal,
  FaShopify,
  FaWordpress,
  FaGithub,
  FaGitlab,
  FaBitbucket,
  FaRust,
  FaMicrosoft,
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
  SiClerk,
  SiRemix,
  SiAstro,
  SiPrisma,
  SiKotlin,
  SiRuby,
  SiDart,
  SiSass,
  SiMui,
  SiLaravel,
  SiRubyonrails,
  SiFastapi,
  SiRedux,
  SiAuth0,
  SiRender,
  SiHeroku,
  SiCloudflare,
  SiStripe,
  SiSanity,
  SiContentful,
  SiStrapi,
  SiSocketdotio,
  SiGoogleanalytics,
  SiTensorflow,
  SiPytorch,
  SiOpenai,
  SiTwilio,
  SiGooglecloud,
  SiSentry,
  SiElasticsearch,
  SiAdobe,
  SiSketch,
  SiExpo,
  SiSqlite,
  SiRazorpay,
  SiDigitalocean,
  SiAwsamplify,
  SiAmazons3,
} from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";
import { Project } from "@/modules/types";

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
  Solid: {
    name: "Solid",
    icon: FaReact,
    color: "#2C4F7C",
    category: "frontend",
  },
  Preact: {
    name: "Preact",
    icon: FaReact,
    color: "#673AB8",
    category: "frontend",
  },
  Qwik: { name: "Qwik", icon: FaReact, color: "#AC7EF4", category: "frontend" },

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
  Remix: {
    name: "Remix",
    icon: SiRemix,
    color: "#000000",
    category: "frontend",
  },
  Astro: {
    name: "Astro",
    icon: SiAstro,
    color: "#FF5D01",
    category: "frontend",
  },
  SvelteKit: {
    name: "SvelteKit",
    icon: SiSvelte,
    color: "#FF3E00",
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
  Swift: {
    name: "Swift",
    icon: SiSwift,
    color: "#FFAC1C",
    category: "language",
  },
  Kotlin: {
    name: "Kotlin",
    icon: SiKotlin,
    color: "#7F52FF",
    category: "language",
  },
  Rust: { name: "Rust", icon: FaRust, color: "#000000", category: "language" },
  "C#": {
    name: "C#",
    icon: TbBrandCSharp,
    color: "#239120",
    category: "language",
  },
  Ruby: { name: "Ruby", icon: SiRuby, color: "#CC342D", category: "language" },
  Dart: { name: "Dart", icon: SiDart, color: "#0175C2", category: "language" },

  // Markup & Styling
  HTML: { name: "HTML", icon: FaHtml5, color: "#E34F26", category: "styling" },
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
  Sass: { name: "Sass", icon: SiSass, color: "#CC6699", category: "styling" },
  "styled-components": {
    name: "styled-components",
    icon: FaCss3Alt,
    color: "#DB7093",
    category: "styling",
  },
  Emotion: {
    name: "Emotion",
    icon: FaCss3Alt,
    color: "#D36AC2",
    category: "styling",
  },
  "Chakra UI": {
    name: "Chakra UI",
    icon: FaReact,
    color: "#319795",
    category: "styling",
  },
  "Material-UI": {
    name: "Material-UI",
    icon: SiMui,
    color: "#007FFF",
    category: "styling",
  },
  "shadcn/ui": {
    name: "shadcn/ui",
    icon: FaReact,
    color: "#000000",
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
  FastAPI: {
    name: "FastAPI",
    icon: SiFastapi,
    color: "#009688",
    category: "backend",
  },
  Laravel: {
    name: "Laravel",
    icon: SiLaravel,
    color: "#FF2D20",
    category: "backend",
  },
  "Ruby on Rails": {
    name: "Ruby on Rails",
    icon: SiRubyonrails,
    color: "#CC0000",
    category: "backend",
  },
  "ASP.NET": {
    name: "ASP.NET",
    icon: TbBrandCSharp,
    color: "#512BD4",
    category: "backend",
  },
  Fastify: {
    name: "Fastify",
    icon: FaNodeJs,
    color: "#000000",
    category: "backend",
  },
  Hono: { name: "Hono", icon: FaNodeJs, color: "#FF6600", category: "backend" },

  // Databases & ORMs
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
  SQLite: {
    name: "SQLite",
    icon: SiSqlite,
    color: "#003B57",
    category: "database",
  },
  Prisma: {
    name: "Prisma",
    icon: SiPrisma,
    color: "#2D3748",
    category: "database",
  },
  Drizzle: {
    name: "Drizzle",
    icon: FaNodeJs,
    color: "#C5F74F",
    category: "database",
  },
  TypeORM: {
    name: "TypeORM",
    icon: SiTypescript,
    color: "#FE0803",
    category: "database",
  },

  // API Technologies
  GraphQL: {
    name: "GraphQL",
    icon: SiGraphql,
    color: "#E10098",
    category: "api",
  },
  REST: { name: "REST", icon: FaNodeJs, color: "#009688", category: "api" },
  tRPC: { name: "tRPC", icon: SiTypescript, color: "#398CCB", category: "api" },
  gRPC: { name: "gRPC", icon: FaNodeJs, color: "#244C5A", category: "api" },

  // Authentication
  Clerk: { name: "Clerk", icon: SiClerk, color: "#6C47FF", category: "auth" },
  Auth0: { name: "Auth0", icon: SiAuth0, color: "#EB5424", category: "auth" },
  NextAuth: {
    name: "NextAuth",
    icon: SiNextdotjs,
    color: "#000000",
    category: "auth",
  },
  "Supabase Auth": {
    name: "Supabase Auth",
    icon: SiSupabase,
    color: "#3ECF8E",
    category: "auth",
  },
  "Firebase Auth": {
    name: "Firebase Auth",
    icon: SiFirebase,
    color: "#FFCA28",
    category: "auth",
  },
  "Passport.js": {
    name: "Passport.js",
    icon: FaNodeJs,
    color: "#34E27A",
    category: "auth",
  },
  Okta: { name: "Okta", icon: FaNodeJs, color: "#007DC1", category: "auth" },

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
  Convex: {
    name: "Convex",
    icon: FaNodeJs,
    color: "#EE4C2C",
    category: "baas",
  },
  Appwrite: {
    name: "Appwrite",
    icon: FaNodeJs,
    color: "#F02E65",
    category: "baas",
  },
  PocketBase: {
    name: "PocketBase",
    icon: FaNodeJs,
    color: "#B8DBE4",
    category: "baas",
  },
  "AWS Amplify": {
    name: "AWS Amplify",
    icon: SiAwsamplify,
    color: "#FF9900",
    category: "baas",
  },
  Parse: { name: "Parse", icon: FaNodeJs, color: "#169CEE", category: "baas" },

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
  Expo: { name: "Expo", icon: SiExpo, color: "#000020", category: "mobile" },
  Ionic: { name: "Ionic", icon: FaReact, color: "#3880FF", category: "mobile" },
  Xamarin: {
    name: "Xamarin",
    icon: TbBrandCSharp,
    color: "#3498DB",
    category: "mobile",
  },
  SwiftUI: {
    name: "SwiftUI",
    icon: SiSwift,
    color: "#FFAC1C",
    category: "mobile",
  },
  "Jetpack Compose": {
    name: "Jetpack Compose",
    icon: SiKotlin,
    color: "#4285F4",
    category: "mobile",
  },

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
  Azure: {
    name: "Azure",
    icon: FaMicrosoft,
    color: "#0078D4",
    category: "cloud",
  },
  "Google Cloud": {
    name: "Google Cloud",
    icon: SiGooglecloud,
    color: "#4285F4",
    category: "cloud",
  },
  Terraform: {
    name: "Terraform",
    icon: FaDocker,
    color: "#7B42BC",
    category: "devops",
  },
  Ansible: {
    name: "Ansible",
    icon: FaDocker,
    color: "#EE0000",
    category: "devops",
  },
  Jenkins: {
    name: "Jenkins",
    icon: FaDocker,
    color: "#D24939",
    category: "devops",
  },
  "GitHub Actions": {
    name: "GitHub Actions",
    icon: FaGithub,
    color: "#2088FF",
    category: "devops",
  },
  CircleCI: {
    name: "CircleCI",
    icon: FaDocker,
    color: "#343434",
    category: "devops",
  },

  // Deployment & Hosting
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
  Railway: {
    name: "Railway",
    icon: SiRender,
    color: "#0B0D0E",
    category: "deployment",
  },
  Render: {
    name: "Render",
    icon: SiRender,
    color: "#46E3B7",
    category: "deployment",
  },
  "Fly.io": {
    name: "Fly.io",
    icon: FaDocker,
    color: "#7B3FF2",
    category: "deployment",
  },
  Heroku: {
    name: "Heroku",
    icon: SiHeroku,
    color: "#430098",
    category: "deployment",
  },
  DigitalOcean: {
    name: "DigitalOcean",
    icon: SiDigitalocean,
    color: "#0080FF",
    category: "deployment",
  },
  Cloudflare: {
    name: "Cloudflare",
    icon: SiCloudflare,
    color: "#F38020",
    category: "deployment",
  },

  // State Management
  Redux: { name: "Redux", icon: SiRedux, color: "#764ABC", category: "state" },
  Zustand: {
    name: "Zustand",
    icon: FaReact,
    color: "#000000",
    category: "state",
  },
  Jotai: { name: "Jotai", icon: FaReact, color: "#000000", category: "state" },
  Recoil: {
    name: "Recoil",
    icon: FaReact,
    color: "#3578E5",
    category: "state",
  },
  MobX: { name: "MobX", icon: FaReact, color: "#FF9955", category: "state" },
  Pinia: { name: "Pinia", icon: FaVuejs, color: "#FFC93C", category: "state" },
  Vuex: { name: "Vuex", icon: FaVuejs, color: "#4FC08D", category: "state" },

  // Payment Processing
  Stripe: {
    name: "Stripe",
    icon: SiStripe,
    color: "#635BFF",
    category: "payment",
  },
  PayPal: {
    name: "PayPal",
    icon: FaPaypal,
    color: "#00457C",
    category: "payment",
  },
  Razorpay: {
    name: "Razorpay",
    icon: SiRazorpay,
    color: "#0C2451",
    category: "payment",
  },
  Square: {
    name: "Square",
    icon: FaStripe,
    color: "#000000",
    category: "payment",
  },

  // Analytics & Monitoring
  "Google Analytics": {
    name: "Google Analytics",
    icon: SiGoogleanalytics,
    color: "#E37400",
    category: "analytics",
  },
  Mixpanel: {
    name: "Mixpanel",
    icon: SiGoogleanalytics,
    color: "#7856FF",
    category: "analytics",
  },
  Sentry: {
    name: "Sentry",
    icon: SiSentry,
    color: "#362D59",
    category: "monitoring",
  },
  LogRocket: {
    name: "LogRocket",
    icon: SiGoogleanalytics,
    color: "#764ABC",
    category: "monitoring",
  },
  Datadog: {
    name: "Datadog",
    icon: SiGoogleanalytics,
    color: "#632CA6",
    category: "monitoring",
  },
  "New Relic": {
    name: "New Relic",
    icon: SiGoogleanalytics,
    color: "#008C99",
    category: "monitoring",
  },

  // CMS & Content
  Sanity: { name: "Sanity", icon: SiSanity, color: "#F03E2F", category: "cms" },
  Contentful: {
    name: "Contentful",
    icon: SiContentful,
    color: "#2478CC",
    category: "cms",
  },
  Strapi: { name: "Strapi", icon: SiStrapi, color: "#2F2E8B", category: "cms" },
  WordPress: {
    name: "WordPress",
    icon: FaWordpress,
    color: "#21759B",
    category: "cms",
  },
  Ghost: {
    name: "Ghost",
    icon: FaWordpress,
    color: "#15171A",
    category: "cms",
  },
  "Payload CMS": {
    name: "Payload CMS",
    icon: FaNodeJs,
    color: "#000000",
    category: "cms",
  },

  // Communication Services
  SendGrid: {
    name: "SendGrid",
    icon: FaNodeJs,
    color: "#1A82E2",
    category: "email",
  },
  Mailgun: {
    name: "Mailgun",
    icon: FaNodeJs,
    color: "#F06B66",
    category: "email",
  },
  Resend: {
    name: "Resend",
    icon: FaNodeJs,
    color: "#000000",
    category: "email",
  },
  Postmark: {
    name: "Postmark",
    icon: FaNodeJs,
    color: "#FFCD00",
    category: "email",
  },

  // Search
  Algolia: {
    name: "Algolia",
    icon: SiElasticsearch,
    color: "#5468FF",
    category: "search",
  },
  Elasticsearch: {
    name: "Elasticsearch",
    icon: SiElasticsearch,
    color: "#005571",
    category: "search",
  },
  Meilisearch: {
    name: "Meilisearch",
    icon: SiElasticsearch,
    color: "#FF5CAA",
    category: "search",
  },

  // Real-time
  "Socket.io": {
    name: "Socket.io",
    icon: SiSocketdotio,
    color: "#010101",
    category: "realtime",
  },
  Pusher: {
    name: "Pusher",
    icon: FaNodeJs,
    color: "#300D4F",
    category: "realtime",
  },
  Ably: {
    name: "Ably",
    icon: FaNodeJs,
    color: "#FF5416",
    category: "realtime",
  },
  WebRTC: {
    name: "WebRTC",
    icon: FaNodeJs,
    color: "#333333",
    category: "realtime",
  },

  // Game Development
  Unity: {
    name: "Unity",
    icon: SiUnity,
    color: "#000000",
    category: "gamedev",
  },
  "Unreal Engine": {
    name: "Unreal Engine",
    icon: SiUnity,
    color: "#0E1128",
    category: "gamedev",
  },
  Godot: {
    name: "Godot",
    icon: SiUnity,
    color: "#478CBF",
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
  "Adobe XD": {
    name: "Adobe XD",
    icon: SiAdobe,
    color: "#FF61F6",
    category: "design",
  },
  Sketch: {
    name: "Sketch",
    icon: SiSketch,
    color: "#F7B500",
    category: "design",
  },

  // Build Tools
  Webpack: {
    name: "Webpack",
    icon: SiWebpack,
    color: "#8DD6F9",
    category: "build",
  },
  Vite: { name: "Vite", icon: SiVite, color: "#646CFF", category: "build" },
  Rollup: { name: "Rollup", icon: SiVite, color: "#EC4A3F", category: "build" },
  Turbopack: {
    name: "Turbopack",
    icon: SiWebpack,
    color: "#0D1117",
    category: "build",
  },
  esbuild: {
    name: "esbuild",
    icon: SiVite,
    color: "#FFCF00",
    category: "build",
  },
  Parcel: {
    name: "Parcel",
    icon: SiWebpack,
    color: "#21374B",
    category: "build",
  },

  // Testing
  Jest: { name: "Jest", icon: SiJest, color: "#C21325", category: "testing" },
  Cypress: {
    name: "Cypress",
    icon: SiCypress,
    color: "#17202C",
    category: "testing",
  },
  Vitest: {
    name: "Vitest",
    icon: SiVite,
    color: "#729B1B",
    category: "testing",
  },
  "Testing Library": {
    name: "Testing Library",
    icon: SiJest,
    color: "#E33332",
    category: "testing",
  },
  Mocha: { name: "Mocha", icon: SiJest, color: "#8D6748", category: "testing" },

  // Version Control
  Git: { name: "Git", icon: FaGitAlt, color: "#F05032", category: "vcs" },
  GitHub: { name: "GitHub", icon: FaGithub, color: "#181717", category: "vcs" },
  GitLab: { name: "GitLab", icon: FaGitlab, color: "#FC6D26", category: "vcs" },
  Bitbucket: {
    name: "Bitbucket",
    icon: FaBitbucket,
    color: "#0052CC",
    category: "vcs",
  },

  // AI & ML
  TensorFlow: {
    name: "TensorFlow",
    icon: SiTensorflow,
    color: "#FF6F00",
    category: "ai",
  },
  PyTorch: {
    name: "PyTorch",
    icon: SiPytorch,
    color: "#EE4C2C",
    category: "ai",
  },
  OpenAI: { name: "OpenAI", icon: SiOpenai, color: "#412991", category: "ai" },
  "Hugging Face": {
    name: "Hugging Face",
    icon: FaPython,
    color: "#FFD21E",
    category: "ai",
  },
  LangChain: {
    name: "LangChain",
    icon: FaPython,
    color: "#1C3C3C",
    category: "ai",
  },

  // Other Popular Tools
  Shopify: {
    name: "Shopify",
    icon: FaShopify,
    color: "#7AB55C",
    category: "ecommerce",
  },
  Twilio: {
    name: "Twilio",
    icon: SiTwilio,
    color: "#F22F46",
    category: "communication",
  },
  "AWS S3": {
    name: "AWS S3",
    icon: SiAmazons3,
    color: "#569A31",
    category: "storage",
  },
  Cloudinary: {
    name: "Cloudinary",
    icon: SiCloudflare,
    color: "#3448C5",
    category: "storage",
  },
};

export const getUniqueTechnologies = (projects: Project[]): string[] => {
  const allTechs = new Set();
  projects.forEach((project: Project) => {
    project.techStack?.forEach((tech: string) => allTechs.add(tech));
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

export function getTechStackCounts(projects: Project[]) {
  const techCounts: Record<string, number> = {};

  projects.forEach((project) => {
    if (project.techStack) {
      project.techStack.forEach((tech) => {
        techCounts[tech] = (techCounts[tech] || 0) + 1;
      });
    }
  });

  return Object.entries(techCounts)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}
