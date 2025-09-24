import { internalMutation, QueryCtx } from "../_generated/server";
import { ConvexError, v, Validator } from "convex/values";
import { UserJSON } from "@clerk/backend";

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  async handler(ctx, { data }) {
    const email = data.email_addresses?.[0]?.email_address;
    const firstName = data.first_name || "User";
    const lastName = data.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();

    const randomNumber = Math.floor(Math.random() * 9000);
    const username = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${randomNumber}`;

    const userAttributes = {
      username: username,
      externalId: data.id,
      imageUrl: data.image_url,
      name: fullName,
      email: email,
    };

    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { externalId: v.string() },
  async handler(ctx, { externalId }) {
    const user = await userByExternalId(ctx, externalId);

    if (user === null) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    await ctx.db.delete(user._id);
  },
});

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_external_id", (q) => q.eq("externalId", externalId))
    .unique();
}
