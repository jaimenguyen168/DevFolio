import { MutationCtx, QueryCtx } from "./_generated/server";
import { ConvexError } from "convex/values";

export const getUserByUsername = async (ctx: QueryCtx, username: string) => {
  return await ctx.db
    .query("users")
    .withIndex("by_username", (q) => q.eq("username", username))
    .unique();
};

export const validateUser = async (ctx: MutationCtx | QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action.",
    });
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_external_id", (q) => q.eq("externalId", identity.subject))
    .unique();

  if (!user) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: "User not found. Please complete your profile setup.",
    });
  }

  return user;
};
