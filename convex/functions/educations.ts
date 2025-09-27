import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByUsername, validateUser } from "../utils";

const EDUCATION_TYPES = [
  "high-school",
  "university",
  "certification",
  "bootcamp",
  "online-course",
] as const;

export const getEducations = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, { username }) => {
    const user = await getUserByUsername(ctx, username);

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("userEducation")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const createEducation = mutation({
  args: {
    institution: v.string(),
    logoUrl: v.optional(v.string()),
    degree: v.optional(v.string()),
    field: v.optional(v.string()),
    location: v.optional(v.string()),
    grade: v.optional(v.string()),
    gpa: v.optional(v.number()),
    startYear: v.optional(v.number()),
    endYear: v.optional(v.number()),
    details: v.optional(v.string()),
    type: v.union(...EDUCATION_TYPES.map((type) => v.literal(type))),
  },
  handler: async (ctx, args) => {
    const user = await validateUser(ctx);

    return await ctx.db.insert("userEducation", {
      userId: user._id,
      institution: args.institution,
      degree: args.degree,
      field: args.field,
      location: args.location,
      grade: args.grade,
      gpa: args.gpa,
      startYear: args.startYear,
      endYear: args.endYear,
      details: args.details,
      type: args.type,
    });
  },
});

export const updateEducation = mutation({
  args: {
    educationId: v.id("userEducation"),
    updates: v.object({
      institution: v.optional(v.string()),
      logoUrl: v.optional(v.string()),
      degree: v.optional(v.string()),
      field: v.optional(v.string()),
      location: v.optional(v.string()),
      grade: v.optional(v.string()),
      gpa: v.optional(v.number()),
      startYear: v.optional(v.number()),
      endYear: v.optional(v.number()),
      details: v.optional(v.string()),
      type: v.optional(
        v.union(...EDUCATION_TYPES.map((type) => v.literal(type))),
      ),
    }),
  },
  handler: async (ctx, { educationId, updates }) => {
    const user = await validateUser(ctx);

    const education = await ctx.db.get(educationId);
    if (!education || education.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You can only update your own education records.",
      });
    }

    return await ctx.db.patch(educationId, updates);
  },
});

export const deleteEducation = mutation({
  args: {
    educationId: v.id("userEducation"),
  },
  handler: async (ctx, args) => {
    const user = await validateUser(ctx);

    const education = await ctx.db.get(args.educationId);
    if (!education || education.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You can only delete your own education records.",
      });
    }

    return await ctx.db.delete(args.educationId);
  },
});

export const getSingleEducation = query({
  args: {
    educationId: v.id("userEducation"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.educationId);
  },
});
