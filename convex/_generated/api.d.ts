/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as functions_auth from "../functions/auth.js";
import type * as functions_educations from "../functions/educations.js";
import type * as functions_files from "../functions/files.js";
import type * as functions_interests from "../functions/interests.js";
import type * as functions_projects from "../functions/projects.js";
import type * as functions_userLinks from "../functions/userLinks.js";
import type * as functions_users from "../functions/users.js";
import type * as functions_workExperience from "../functions/workExperience.js";
import type * as http from "../http.js";
import type * as schemas_users from "../schemas/users.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "functions/auth": typeof functions_auth;
  "functions/educations": typeof functions_educations;
  "functions/files": typeof functions_files;
  "functions/interests": typeof functions_interests;
  "functions/projects": typeof functions_projects;
  "functions/userLinks": typeof functions_userLinks;
  "functions/users": typeof functions_users;
  "functions/workExperience": typeof functions_workExperience;
  http: typeof http;
  "schemas/users": typeof schemas_users;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
