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

export const taglines = [
  "Code is poetry in motion ✨",
  "Building dreams, one line at a time 🚀",
  "Turning caffeine into code since [year] ☕",
  "Making the web a better place 🌟",
  "Debug the world, one bug at a time 🐛",
  "Crafting digital experiences with passion 💡",
  "Where creativity meets functionality ⚡",
  "Shipping code and breaking limits 🎯",
  "From ideas to impact 🔥",
  "Writing the future in JavaScript 🌈",
];
