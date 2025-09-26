import { defineTable } from "convex/server";
import { v } from "convex/values";
import {
  INTEREST_CATEGORIES,
  SKILL_CATEGORIES,
  TECH_STACKS,
} from "../../src/modules/about/constants";

export const users = defineTable({
  name: v.string(),
  email: v.string(),
  title: v.optional(v.string()),
  username: v.string(),
  imageUrl: v.optional(v.string()),
  phone: v.optional(v.string()),
  externalId: v.optional(v.string()),
  bio: v.optional(v.string()),
  hashtags: v.optional(v.array(v.string())),
})
  .index("by_external_id", ["externalId"])
  .index("by_email", ["email"])
  .index("by_phone", ["phone"])
  .index("by_username", ["username"]);

export const userLinks = defineTable({
  userId: v.id("users"),
  url: v.string(),
  label: v.string(),
}).index("by_user_id", ["userId"]);

export const userInterests = defineTable({
  userId: v.id("users"),
  interest: v.string(),
  category: v.union(...INTEREST_CATEGORIES.map((cat) => v.literal(cat))),
})
  .index("by_user_id", ["userId"])
  .index("by_user_and_category", ["userId", "category"]);

export const userEducation = defineTable({
  userId: v.id("users"),
  institution: v.string(),
  logoUrl: v.optional(v.string()),
  degree: v.optional(v.string()),
  field: v.optional(v.string()),
  location: v.optional(v.string()),
  grade: v.optional(v.string()),
  gpa: v.optional(v.number()),
  startYear: v.optional(v.number()),
  endYear: v.optional(v.number()),
  description: v.optional(v.string()),
  type: v.union(
    v.literal("high-school"),
    v.literal("university"),
    v.literal("certification"),
    v.literal("bootcamp"),
    v.literal("online-course"),
  ),
})
  .index("by_user_id", ["userId"])
  .index("by_user_and_type", ["userId", "type"]);

export const userWorkExperience = defineTable({
  userId: v.id("users"),
  company: v.string(),
  position: v.string(),
  startDate: v.number(),
  endDate: v.optional(v.number()),
  description: v.optional(v.string()),
  location: v.optional(v.string()),
}).index("by_user_id", ["userId"]);

export const userSkills = defineTable({
  userId: v.id("users"),
  skill: v.string(),
  category: v.union(...SKILL_CATEGORIES.map((cat) => v.literal(cat))),
  proficiency: v.optional(
    v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("expert"),
    ),
  ),
  order: v.optional(v.number()),
})
  .index("by_user_id", ["userId"])
  .index("by_user_and_category", ["userId", "category"]);

export const userProjects = defineTable({
  userId: v.id("users"),
  name: v.string(),
  description: v.string(),
  url: v.optional(v.string()),
  githubUrl: v.optional(v.string()),
  imageUrls: v.optional(v.array(v.string())),
  status: v.optional(
    v.union(
      v.literal("completed"),
      v.literal("in-progress"),
      v.literal("archived"),
    ),
  ),
  techStack: v.optional(
    v.array(v.union(...TECH_STACKS.map((tech) => v.literal(tech)))),
  ),
}).index("by_user_id", ["userId"]);
