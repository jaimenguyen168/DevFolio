import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";

export const getUserLinks = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("userLinks")
      .withIndex("by_user_id", (q) => q.eq("userId", user?._id))
      .collect();
  },
});

export const createUserLink = mutation({
  args: {
    url: v.string(),
    label: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to create a user link.",
      });
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", user.subject))
      .unique();

    if (!currentUser) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return await ctx.db.insert("userLinks", {
      userId: currentUser._id,
      url: args.url,
      label: args.label,
    });
  },
});

export const updateUserLink = mutation({
  args: {
    linkId: v.id("userLinks"),
    updates: v.object({
      url: v.optional(v.string()),
      label: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { linkId, updates }) => {
    return await ctx.db.patch(linkId, updates);
  },
});

export const deleteUserLink = mutation({
  args: {
    linkId: v.id("userLinks"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.linkId);
  },
});
