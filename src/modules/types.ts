import { Doc, Id } from "../../convex/_generated/dataModel";

export type User = Doc<"users">;
export type UserId = Id<"users">;
export type Project = Doc<"userProjects">;
export type ProjectId = Id<"userProjects">;
export type Education = Doc<"userEducation">;
export type EducationId = Id<"userEducation">;
