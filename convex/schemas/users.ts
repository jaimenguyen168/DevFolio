import { defineTable } from "convex/server";
import { v } from "convex/values";

export const users = defineTable({
  name: v.string(),
  email: v.string(),
  title: v.optional(v.string()),
  username: v.string(),
  imageUrl: v.optional(v.string()),
  phone: v.optional(v.string()),
  externalId: v.optional(v.string()),
})
  .index("by_external_id", ["externalId"])
  .index("by_email", ["email"])
  .index("by_phone", ["phone"])
  .index("by_username", ["username"]);

export const userLinks = defineTable({
  userId: v.id("users"),
  url: v.string(),
  label: v.string(),
}).index("by_user_id", ["userId"]);
