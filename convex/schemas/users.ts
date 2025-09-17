import { defineTable } from "convex/server";
import { v } from "convex/values";

export const users = defineTable({
  name: v.string(),
  title: v.string(),
  email: v.string(),
  phone: v.string(),
  externalId: v.optional(v.string()),
})
  .index("by_externalId", ["externalId"])
  .index("by_email", ["email"])
  .index("by_phone", ["phone"]);

export const userLinks = defineTable({
  userId: v.id("users"),
  url: v.string(),
  label: v.string(),
}).index("by_user_id", ["userId"]);
