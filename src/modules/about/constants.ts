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
