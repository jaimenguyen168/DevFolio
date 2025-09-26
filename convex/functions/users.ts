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
    }),
  },
  handler: async (ctx, { updates }) => {
    const user = await validateUser(ctx);

    await ctx.db.patch(user._id, updates);

    return await ctx.db.get(user._id);
  },
});
