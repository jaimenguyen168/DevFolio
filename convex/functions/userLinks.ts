import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByUsername, validateUser } from "../utils";

export const getUserLinks = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, { username }) => {
    const user = await getUserByUsername(ctx, username);

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
    const user = await validateUser(ctx);

    return await ctx.db.insert("userLinks", {
      userId: user._id,
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
    const user = await validateUser(ctx);

    const link = await ctx.db.get(linkId);
    if (!link || link.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You can only update your own links.",
      });
    }

    return await ctx.db.patch(linkId, updates);
  },
});

export const deleteUserLink = mutation({
  args: {
    linkId: v.id("userLinks"),
  },
  handler: async (ctx, { linkId }) => {
    const user = await validateUser(ctx);

    const link = await ctx.db.get(linkId);
    if (!link || link.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You can only update your own links.",
      });
    }

    return await ctx.db.delete(linkId);
  },
});
