import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByUsername, validateUser } from "../utils";
import { INTEREST_CATEGORIES } from "../../src/modules/about/constants";

export const getInterests = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, { username }) => {
    const user = await getUserByUsername(ctx, username);

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("userInterests")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const getInterestsByCategory = query({
  args: {
    username: v.string(),
    category: v.union(...INTEREST_CATEGORIES.map((cat) => v.literal(cat))),
  },
  handler: async (ctx, { username, category }) => {
    const user = await getUserByUsername(ctx, username);

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("userInterests")
      .withIndex("by_user_and_category", (q) =>
        q.eq("userId", user._id).eq("category", category),
      )
      .collect();
  },
});

export const createInterest = mutation({
  args: {
    interest: v.string(),
    category: v.union(...INTEREST_CATEGORIES.map((cat) => v.literal(cat))),
  },
  handler: async (ctx, args) => {
    const user = await validateUser(ctx);

    return await ctx.db.insert("userInterests", {
      userId: user._id,
      interest: args.interest,
      category: args.category,
    });
  },
});

export const updateInterest = mutation({
  args: {
    interestId: v.id("userInterests"),
    updates: v.object({
      interest: v.optional(v.string()),
      category: v.optional(
        v.union(...INTEREST_CATEGORIES.map((cat) => v.literal(cat))),
      ),
    }),
  },
  handler: async (ctx, { interestId, updates }) => {
    const user = await validateUser(ctx);

    const interest = await ctx.db.get(interestId);
    if (!interest || interest.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You can only update your own interests.",
      });
    }

    return await ctx.db.patch(interestId, updates);
  },
});

export const deleteInterest = mutation({
  args: {
    interestId: v.id("userInterests"),
  },
  handler: async (ctx, args) => {
    const user = await validateUser(ctx);

    const interest = await ctx.db.get(args.interestId);
    if (!interest || interest.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You can only delete your own interests.",
      });
    }

    return await ctx.db.delete(args.interestId);
  },
});

export const getInterest = query({
  args: {
    interestId: v.id("userInterests"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.interestId);
  },
});
