import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { createClerkClient, WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

const http = httpRouter();

async function validateRequest(
  req: Request,
): Promise<{ event: WebhookEvent; data: any } | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id") || "",
    "svix-timestamp": req.headers.get("svix-timestamp") || "",
    "svix-signature": req.headers.get("svix-signature") || "",
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  try {
    const event = webhook.verify(
      payloadString,
      svixHeaders,
    ) as unknown as WebhookEvent;

    // Parse the payload string to get the data
    const data = JSON.parse(payloadString);

    return { event, data };
  } catch (error) {
    console.error("Error verifying webhook event", error);
    return null;
  }
}

http.route({
  path: "/users-clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const result = await validateRequest(req);
    if (!result) {
      return new Response("Error occurred", { status: 400 });
    }

    const { event, data } = result;

    switch (event.type) {
      case "user.created":
        // Create a new user in Convex based on data
        await ctx.runMutation(internal.functions.auth.upsertFromClerk, {
          data: data.data, // Clerk webhook structure has data nested in data property
        });
        break;
      case "user.updated":
        // Update existing user in Convex
        await ctx.runMutation(internal.functions.auth.upsertFromClerk, {
          data: data.data,
        });
        break;
      case "user.deleted":
        // Delete user from Convex
        // You'll need to implement this mutation
        // await ctx.runMutation(internal.functions.auth.deleteFromClerk, {
        //   externalId: data.data.id,
        // });
        break;
    }

    return new Response(null, { status: 200 });
  }),
});

export default http;
