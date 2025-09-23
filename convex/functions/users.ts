import { query } from "../_generated/server";
import { ConvexError, v } from "convex/values";

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
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You are not authenticated",
      });
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

export const getUserLinks = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userLinks")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();
  },
});
