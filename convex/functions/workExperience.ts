import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByUsername, validateUser } from "../utils";
import { WORK_TYPES } from "../../src/modules/settings/constants";

export const getWorkExperiences = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, { username }) => {
    const user = await getUserByUsername(ctx, username);

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("userWorkExperience")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const createWorkExperience = mutation({
  args: {
    company: v.string(),
    position: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    type: v.union(...WORK_TYPES.map((type) => v.literal(type))),
    responsibilities: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await validateUser(ctx);

    return await ctx.db.insert("userWorkExperience", {
      userId: user._id,
      company: args.company,
      position: args.position,
      startDate: args.startDate,
      endDate: args.endDate,
      description: args.description,
      location: args.location,
      logoUrl: args.logoUrl,
      type: args.type,
      responsibilities: args.responsibilities,
    });
  },
});

export const updateWorkExperience = mutation({
  args: {
    workExperienceId: v.id("userWorkExperience"),
    updates: v.object({
      company: v.optional(v.string()),
      position: v.optional(v.string()),
      startDate: v.optional(v.string()),
      endDate: v.optional(v.string()),
      description: v.optional(v.string()),
      location: v.optional(v.string()),
      logoUrl: v.optional(v.string()),
      type: v.optional(v.union(...WORK_TYPES.map((type) => v.literal(type)))),
      responsibilities: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, { workExperienceId, updates }) => {
    const user = await validateUser(ctx);

    const workExperience = await ctx.db.get(workExperienceId);
    if (!workExperience || workExperience.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You can only update your own work experience records.",
      });
    }

    return await ctx.db.patch(workExperienceId, updates);
  },
});

export const deleteWorkExperience = mutation({
  args: {
    workExperienceId: v.id("userWorkExperience"),
  },
  handler: async (ctx, args) => {
    const user = await validateUser(ctx);

    const workExperience = await ctx.db.get(args.workExperienceId);
    if (!workExperience || workExperience.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You can only delete your own work experience records.",
      });
    }

    return await ctx.db.delete(args.workExperienceId);
  },
});

export const getSingleWorkExperience = query({
  args: {
    workExperienceId: v.id("userWorkExperience"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.workExperienceId);
  },
});
