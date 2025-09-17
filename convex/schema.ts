import { defineSchema } from "convex/server";
import { userLinks, users } from "./schemas/users";

export default defineSchema({
  users: users,
  userLinks: userLinks,
});
