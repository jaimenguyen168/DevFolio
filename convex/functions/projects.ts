import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import {
  generateSlug,
  generateUniqueSlug,
  getUserByUsername,
  validateUser,
} from "../utils";
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
    features: v.optional(v.array(v.string())),
    futureFeatures: v.optional(v.array(v.string())),
    contributors: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const user = await validateUser(ctx);
    const slug = await generateUniqueSlug(ctx.db, args.name);

    return await ctx.db.insert("userProjects", {
      userId: user._id,
      name: args.name,
      slug,
      description: args.description,
      url: args.url,
      githubUrl: args.githubUrl,
      imageUrls: args.imageUrls,
      status: args.status,
      techStack: args.techStack,
      features: args.features,
      futureFeatures: args.futureFeatures,
      contributors: args.contributors,
      views: 0,
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
      features: v.optional(v.array(v.string())),
      futureFeatures: v.optional(v.array(v.string())),
      contributors: v.optional(v.id("users")),
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

    const patchData: any = { ...updates };
    if (updates.name) {
      patchData.slug = await generateUniqueSlug(ctx.db, updates.name);
    }

    return await ctx.db.patch(projectId, patchData);
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

export const getProjectBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db
      .query("userProjects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!project) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Project not found.",
      });
    }

    return project;
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

export const updateProjectViews = mutation({
  args: {
    projectId: v.id("userProjects"),
  },
  handler: async (ctx, args) => {
    const currentUser = await ctx.auth.getUserIdentity();

    const user = await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) =>
        q.eq("externalId", currentUser?.subject),
      )
      .unique();

    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Project not found.",
      });
    }

    if (user && project.userId === user._id) {
      return project.views || 0;
    }

    await ctx.db.patch(args.projectId, {
      views: (project.views || 0) + 1,
    });

    return (project.views || 0) + 1;
  },
});
