import { query } from "../_generated/server";
import { v } from "convex/values";

export const getUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
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
