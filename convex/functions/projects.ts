import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByUsername, validateUser } from "../utils";
import { TECH_STACKS } from "../../src/modules/about/constants";

export const getProjects = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, { username }) => {
    const user = await getUserByUsername(ctx, username);

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("userProjects")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const createProject = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const user = await validateUser(ctx);

    return await ctx.db.insert("userProjects", {
      userId: user._id,
      name: args.name,
      description: args.description,
      url: args.url,
      githubUrl: args.githubUrl,
      imageUrls: args.imageUrls,
      status: args.status,
      techStack: args.techStack,
    });
  },
});

export const updateProject = mutation({
  args: {
    projectId: v.id("userProjects"),
    updates: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
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
    }),
  },
  handler: async (ctx, { projectId, updates }) => {
    const user = await validateUser(ctx);

    const project = await ctx.db.get(projectId);
    if (!project || project.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You can only update your own projects.",
      });
    }

    return await ctx.db.patch(projectId, updates);
  },
});

export const deleteProject = mutation({
  args: {
    projectId: v.id("userProjects"),
  },
  handler: async (ctx, args) => {
    const user = await validateUser(ctx);

    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You can only delete your own projects.",
      });
    }

    return await ctx.db.delete(args.projectId);
  },
});

export const getProject = query({
  args: {
    projectId: v.id("userProjects"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.projectId);
  },
});

export const uploadProjectImage = mutation({
  args: {
    projectId: v.optional(v.id("userProjects")),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { projectId, storageId }) => {
    const user = await validateUser(ctx);

    const imageUrl = await ctx.storage.getUrl(storageId);

    if (projectId) {
      const project = await ctx.db.get(projectId);
      if (!project || project.userId !== user._id) {
        throw new ConvexError({
          code: "FORBIDDEN",
          message: "You can only update your own projects.",
        });
      }

      if (!imageUrl) return null;

      const currentImages = project.imageUrls || [];
      await ctx.db.patch(projectId, {
        imageUrls: [...currentImages, imageUrl],
      });
    }

    return { imageUrl, storageId };
  },
});
