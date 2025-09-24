import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { validateUser } from "../utils";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    await validateUser(ctx);

    return await ctx.storage.generateUploadUrl();
  },
});

export const getImageUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});

export const deleteImage = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { storageId }) => {
    await validateUser(ctx);

    await ctx.storage.delete(storageId);

    return { success: true };
  },
});
