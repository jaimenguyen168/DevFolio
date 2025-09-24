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
  // Meta Frameworks
  "Next.js",
  "Nuxt.js",
  "Gatsby",
  // Languages
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "PHP",
  "Go",
  "Swift",
  // Markup & Styling
  "HTML",
  "CSS",
  "Tailwind",
  "Bootstrap",
  // Backend Frameworks
  "Node.js",
  "Express",
  "NestJS",
  "Django",
  "Flask",
  "Spring",
  // Databases
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  // API Technologies
  "GraphQL",
  // Mobile Development
  "Flutter",
  "React Native",
  "Android",
  "iOS",
  // Cloud & DevOps
  "AWS",
  "Docker",
  "Kubernetes",
  // Backend as a Service
  "Firebase",
  "Supabase",
  // Deployment Platforms
  "Vercel",
  "Netlify",
  // Game Development
  "Unity",
  // Design Tools
  "Blender",
  "Figma",
  // Build Tools
  "Webpack",
  "Vite",
  // Testing
  "Jest",
  "Cypress",
  // Version Control
  "Git",
] as const;

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
