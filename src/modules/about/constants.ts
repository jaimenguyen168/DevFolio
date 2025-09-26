export const INTEREST_CATEGORIES = [
  "technology",
  "sports",
  "arts",
  "music",
  "travel",
  "food",
  "reading",
  "gaming",
  "fitness",
  "photography",
  "cooking",
  "fashion",
  "science",
  "business",
  "education",
  "health",
  "environment",
  "politics",
  "finance",
  "entertainment",
] as const;

export const SKILL_CATEGORIES = [
  "frontend",
  "backend",
  "mobile",
  "database",
  "devops",
  "cloud",
  "design",
  "testing",
  "language",
  "framework",
  "tool",
  "soft-skills",
  "other",
] as const;

export const TECH_STACKS = [
  // Frontend Frameworks
  "React",
  "Vue",
  "Angular",
  "Svelte",
  "Solid",
  "Preact",
  "Qwik",

  // Meta Frameworks
  "Next.js",
  "Nuxt.js",
  "Gatsby",
  "Remix",
  "Astro",
  "SvelteKit",

  // Languages
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "PHP",
  "Go",
  "Swift",
  "Kotlin",
  "Rust",
  "C#",
  "Ruby",
  "Dart",

  // Markup & Styling
  "HTML",
  "CSS",
  "Tailwind",
  "Bootstrap",
  "Sass",
  "styled-components",
  "Emotion",
  "Chakra UI",
  "Material-UI",
  "shadcn/ui",

  // Backend Frameworks
  "Node.js",
  "Express",
  "NestJS",
  "Django",
  "Flask",
  "Spring",
  "FastAPI",
  "Laravel",
  "Ruby on Rails",
  "ASP.NET",
  "Fastify",
  "Hono",

  // Databases
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "SQLite",
  "Prisma",
  "Drizzle",
  "TypeORM",

  // API Technologies
  "GraphQL",
  "REST",
  "tRPC",
  "gRPC",

  // Authentication & Authorization
  "Clerk",
  "Auth0",
  "NextAuth",
  "Supabase Auth",
  "Firebase Auth",
  "Passport.js",
  "Okta",

  // Backend as a Service (BaaS)
  "Firebase",
  "Supabase",
  "Convex",
  "Appwrite",
  "PocketBase",
  "AWS Amplify",
  "Parse",

  // Mobile Development
  "Flutter",
  "React Native",
  "Android",
  "iOS",
  "Expo",
  "Ionic",
  "Xamarin",
  "SwiftUI",
  "Jetpack Compose",

  // Cloud & DevOps
  "AWS",
  "Docker",
  "Kubernetes",
  "Azure",
  "Google Cloud",
  "Terraform",
  "Ansible",
  "Jenkins",
  "GitHub Actions",
  "CircleCI",

  // Deployment & Hosting
  "Vercel",
  "Netlify",
  "Railway",
  "Render",
  "Fly.io",
  "Heroku",
  "DigitalOcean",
  "Cloudflare",

  // State Management
  "Redux",
  "Zustand",
  "Jotai",
  "Recoil",
  "MobX",
  "Pinia",
  "Vuex",

  // Payment Processing
  "Stripe",
  "PayPal",
  "Razorpay",
  "Square",

  // Analytics & Monitoring
  "Google Analytics",
  "Mixpanel",
  "Sentry",
  "LogRocket",
  "Datadog",
  "New Relic",

  // CMS & Content
  "Sanity",
  "Contentful",
  "Strapi",
  "WordPress",
  "Ghost",
  "Payload CMS",

  // Email Services
  "SendGrid",
  "Mailgun",
  "Resend",
  "Postmark",

  // Search & Data
  "Algolia",
  "Elasticsearch",
  "Meilisearch",

  // Real-time & WebSockets
  "Socket.io",
  "Pusher",
  "Ably",
  "WebRTC",

  // Game Development
  "Unity",
  "Unreal Engine",
  "Godot",

  // Design Tools
  "Blender",
  "Figma",
  "Adobe XD",
  "Sketch",

  // Build Tools & Bundlers
  "Webpack",
  "Vite",
  "Rollup",
  "Turbopack",
  "esbuild",
  "Parcel",

  // Testing
  "Jest",
  "Cypress",
  "Vitest",
  "Testing Library",
  "Mocha",

  // Version Control & Collaboration
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",

  // AI & ML
  "TensorFlow",
  "PyTorch",
  "OpenAI",
  "Hugging Face",
  "LangChain",

  // Other Popular Tools
  "Shopify",
  "Twilio",
  "AWS S3",
  "Cloudinary",
  "Socket.io",
] as const;

export function handleTabCompletion(
  input: string,
  cursorPosition: number,
): string {
  // Match techStack assignment with optional opening quote and capture everything after =
  const techStackMatch = input.match(/git\s+add\s+techStack=(["']?)(.*)$/);

  if (techStackMatch) {
    const quote = techStackMatch[1] || '"';
    let fullValue = techStackMatch[2];

    // Remove ALL quotes from the value (both leading/trailing and internal)
    fullValue = fullValue.replace(/["']/g, "");

    const parts = fullValue
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p);
    const lastPart = parts[parts.length - 1] || "";

    if (lastPart) {
      // Find matching tech stacks (case-insensitive)
      const matches = TECH_STACKS.filter((tech) =>
        tech.toLowerCase().startsWith(lastPart.toLowerCase()),
      );

      if (matches.length === 1) {
        // Single match - complete it
        parts[parts.length - 1] = matches[0];
        const completedValue = parts.join(", ");
        return `git add techStack=${quote}${completedValue}${quote}`;
      } else if (matches.length > 1) {
        // Multiple matches - complete common prefix
        const commonPrefix = getCommonPrefix(matches);
        if (commonPrefix.length > lastPart.length) {
          parts[parts.length - 1] = commonPrefix;
          const completedValue = parts.join(", ");
          return `git add techStack=${quote}${completedValue}${quote}`;
        }
        // Show matches in console
        console.log("Matches:", matches.join(", "));
        return input;
      }
    }
  }

  return input;
}

// Helper to find common prefix among matches
function getCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return "";
  if (strings.length === 1) return strings[0];

  let prefix = strings[0];
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].toLowerCase().startsWith(prefix.toLowerCase())) {
      prefix = prefix.slice(0, -1);
      if (prefix === "") return "";
    }
  }
  return prefix;
}

export interface ContentMap {
  [key: string]: string;
}

export const contentMap: ContentMap = {
  bio: `/**
 * About me
 * I have 5 years of experience in web development lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
 * 
 * Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat officia deserunt mollit anim id est laborum.
 */`,
  interests: `/**
 * My interests
 * Technology and programming fascinate me, especially artificial intelligence and machine learning applications in web development. I enjoy experimenting with new frameworks and exploring serverless architecture possibilities.
 * 
 * Outside of programming, I love reading science fiction novels and hiking in nature. Photography is another passion, particularly landscape and street photography that captures unique moments.
 */`,
  "high-school": `/**
 * High School Education
 * Lincoln Technical High School (2015-2019) During my high school years, I discovered my passion for computer science and programming through the Computer Science Club where I learned Java and C++ fundamentals.
 * 
 * My senior project involved creating a simple inventory management system for local businesses, giving me first taste of real-world software development and problem-solving skills.
 */`,
  university: `/**
 * University Education
 * State University - Computer Science (2019-2023) I pursued my Bachelor's degree where I deepened my understanding of software engineering principles, data structures, and algorithms with focus on web development and software architecture.
 * 
 * My thesis project focused on developing a real-time collaborative code editor using WebSocket technology and React, maintaining 3.8 GPA throughout studies.
 */`,
};
