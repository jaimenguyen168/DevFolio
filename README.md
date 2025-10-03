# DevFolio

<div>
    <img src="https://img.shields.io/badge/-React-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react" />
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextjs" />
    <img src="https://img.shields.io/badge/-Convex-black?style=for-the-badge&logoColor=white&logo=convex&color=FF6F00" alt="convex" />
    <img src="https://img.shields.io/badge/-Clerk-black?style=for-the-badge&logoColor=white&logo=clerk&color=6C47FF" alt="clerk" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-shadcn/ui-black?style=for-the-badge&logoColor=white&logo=shadcnui&color=000000" alt="shadcn" />
</div>

## 📋 <a name="table">Table of Contents</a>

1. ✨ [Introduction](#introduction)
2. ✅ [Tech Stack](#tech-stack)
3. 🕹️ [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 👥 [Contributors](#contributors)

## <a name="introduction">✨ Introduction</a>

DevFolio is a modern web application that transforms the traditional resume into an interactive digital portfolio. It serves as a comprehensive professional showcase where developers can display their projects, work experience, education, skills, and bio in a visually engaging format. More than just a resume builder, DevFolio acts as a personal website and networking hub, connecting talented developers with potential employers and collaborators. With its unique terminal-style interface and real-time editing capabilities, DevFolio makes creating and maintaining a professional online presence simple and fun.

## <a name="tech-stack">✅ Tech Stack</a>

- React
- Next.js
- Convex
- Clerk
- Tailwind CSS
- shadcn/ui
- Resend

## <a name="features">🕹️ Features</a>

### Profile Creation & Management
👉 **Comprehensive profile builder** – Create detailed profiles including bio, work experience, education, skills, and projects.  
👉 **Terminal-style interface** – Build your profile using an intuitive CLI-inspired interface for a unique developer experience.  
👉 **Live editing & updates** – See changes in real-time powered by Convex's reactive database.
</br>👉 **Custom confirmation emails** – Personalized email notifications using Resend.

### Security & Authentication
👉 **Secure authentication** – Safe sign-up and sign-in process managed by Clerk.    

### Sharing & Discovery
👉 **Shareable portfolios** – Share your profile with a personalized username URL.  
👉 **Browse developer portfolios** – Discover and explore profiles of other talented developers.  
👉 **Contact functionality** – Allow visitors to send emails directly to portfolio owners.  

### Future Features

#### AI-Powered Enhancement
🚀 **AI-enhanced writing** – Leverage AI to improve resume content, optimize descriptions, and enhance professional writing.  

#### Advanced Customization
🚀 **Theme customization** – Choose from multiple themes or create custom color schemes.  
🚀 **Privacy controls** – Hide specific sections or make your portfolio private.  
🚀 **Notification system** – Get notified when employers view or interact with your portfolio.  

#### Export & Analytics
🚀 **Download as CV/Resume** – Export your portfolio as a professional PDF resume or CV.  
🚀 **Analytics dashboard** – Track portfolio views, visitor insights, and profile performance metrics.  

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

### Prerequisites

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en) (v18 or higher)
- [pnpm](https://pnpm.io/) (recommended package manager)

### Installation Instructions

**Cloning the Repository**

```bash
git clone https://github.com/jaimenguyen168/DevFolio.git
cd DevFolio
```

**Installation**

Install the project dependencies using pnpm (recommended):

```bash
pnpm install
```

Or using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project by copying from the example and add the required API keys to your `.env.local` file:

```bash
cp .env.example .env.local
```

**Getting API Keys:**

- **Convex**: Sign up at [Convex](https://www.convex.dev/) and create a new project
- **Clerk**: Get your keys from [Clerk Dashboard](https://dashboard.clerk.com/)
- **Resend**: Obtain your API key from [Resend](https://resend.com/)

**Running the Development Server**

```bash
pnpm dev
```

Or using npm:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

**Building for Production**

```bash
pnpm build
pnpm start
```

## <a name="contributors">👥 Contributors</a>

**Developer**: [Jaime Nguyen](https://github.com/jaimenguyen168)

**UI Design**: [Portfolio for Developers Concept V.2.1](https://www.figma.com/design/5WPaJB8AoS64R0fULqvB8N/Portfolio-for-Developers-Concept-V.2.1--Community-?node-id=26532-1280&p=f&t=gCTPUKFSn24KHOw4-0) by Figma Community


---

<div align="center">
  <p>Built with ❤️ by ME</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
