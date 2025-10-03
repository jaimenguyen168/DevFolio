import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getUserByUsername, validateUser } from "../utils";

export const getCustomizationsByUsername = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUserByUsername(ctx, args.username);

    if (!user) {
      return null;
    }

    const customizations = await ctx.db
      .query("userCustomizations")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .unique();

    if (!customizations) {
      return {
        confirmationEmail: {
          useDefault: true,
          customHtml: undefined,
        },
        hideEmail: false,
        hidePhone: false,
      };
    }

    return customizations;
  },
});

export const getCustomizations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    const customizations = await ctx.db
      .query("userCustomizations")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .unique();

    if (!customizations) {
      return {
        confirmationEmail: {
          useDefault: true,
          customHtml: undefined,
        },
        hideEmail: false,
        hidePhone: false,
      };
    }

    return customizations;
  },
});

export const updateCustomizations = mutation({
  args: {
    hideEmail: v.optional(v.boolean()),
    hidePhone: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await validateUser(ctx);

    const existingCustomizations = await ctx.db
      .query("userCustomizations")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .unique();

    // Prepare update object with only provided fields
    const updateData: any = {};
    if (args.hideEmail !== undefined) {
      updateData.hideEmail = args.hideEmail;
    }
    if (args.hidePhone !== undefined) {
      updateData.hidePhone = args.hidePhone;
    }

    // If customizations exist, update them
    if (existingCustomizations) {
      await ctx.db.patch(existingCustomizations._id, updateData);
      return existingCustomizations._id;
    }

    // Otherwise, create new customizations with defaults
    return await ctx.db.insert("userCustomizations", {
      userId: user._id,
      confirmationEmail: {
        useDefault: true,
        customHtml: undefined,
      },
      hideEmail: args.hideEmail ?? false,
      hidePhone: args.hidePhone ?? false,
    });
  },
});

export const updateConfirmationEmail = mutation({
  args: {
    useDefault: v.boolean(),
    customHtml: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await validateUser(ctx);

    const existingCustomizations = await ctx.db
      .query("userCustomizations")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .unique();

    const confirmationEmail = {
      useDefault: args.useDefault,
      customHtml: args.customHtml,
    };

    if (existingCustomizations) {
      await ctx.db.patch(existingCustomizations._id, {
        confirmationEmail,
      });
      return existingCustomizations._id;
    }

    // Otherwise, create new customizations
    return await ctx.db.insert("userCustomizations", {
      userId: user._id,
      confirmationEmail,
    });
  },
});
