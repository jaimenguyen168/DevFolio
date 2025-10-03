import { defineSchema } from "convex/server";
import {
  userCustomizations,
  userEducation,
  userInterests,
  userLinks,
  userProjects,
  users,
  userSkills,
  userWorkExperience,
} from "./schemas/users";

export default defineSchema({
  users: users,
  userLinks: userLinks,
  userInterests: userInterests,
  userProjects: userProjects,
  userSkills: userSkills,
  userWorkExperience: userWorkExperience,
  userEducation: userEducation,
  userCustomizations: userCustomizations,
});
