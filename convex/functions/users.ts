import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { validateUser } from "../utils";

export const getUser = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", identity.subject))
      .unique();
  },
});

export const isCurrentUser = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the current user's identity from Clerk
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!currentUser) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return currentUser.username === args.username;
  },
});

export const searchUsers = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.searchTerm.trim()) {
      return [];
    }

    const searchTerm = args.searchTerm.toLowerCase();

    return await ctx.db
      .query("users")
      .withIndex("by_username", (q) =>
        q.gte("username", searchTerm).lt("username", searchTerm + "\uFFFF"),
      )
      .take(10);
  },
});

export const updateUser = mutation({
  args: {
    updates: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      title: v.optional(v.string()),
      username: v.optional(v.string()),
      phone: v.optional(v.string()),
      bio: v.optional(v.string()),
      hashtags: v.optional(v.array(v.string())),
      imageUrl: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { updates }) => {
    const user = await validateUser(ctx);

    await ctx.db.patch(user._id, updates);

    return await ctx.db.get(user._id);
  },
});

export const uploadResume = mutation({
  args: {
    userId: v.id("users"),
    storageId: v.id("_storage"),
    fileName: v.string(),
  },
  handler: async (ctx, { userId, storageId, fileName }) => {
    // Update user with resume info
    await ctx.db.patch(userId, {
      resumeStorageId: storageId,
      resumeFileName: fileName,
    });

    return { success: true };
  },
});

export const getResumeUrl = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);

    if (!user?.resumeStorageId) {
      return null;
    }

    const url = await ctx.storage.getUrl(user.resumeStorageId);
    return {
      url,
      fileName: user.resumeFileName,
    };
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const deleteResume = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);

    if (user?.resumeStorageId) {
      await ctx.storage.delete(user.resumeStorageId);
      await ctx.db.patch(userId, {
        resumeStorageId: undefined,
        resumeFileName: undefined,
      });
    }

    return { success: true };
  },
});
