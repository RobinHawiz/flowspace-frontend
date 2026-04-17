import request from "@api/request";
import {
  appUserResponseSchema,
  type AppUserCredentials,
  type AppUserRegistration,
} from "@customTypes/appUser";
import delay from "@utils/delay";

export async function registerUser(appUser: AppUserRegistration) {
  const options = {
    method: "POST" as const,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appUser),
  };
  // Simulate network latency.
  await delay(700);
  await request(`/auth/register`, options);
}

export async function loginUser(creds: AppUserCredentials) {
  const options = {
    method: "POST" as const,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(creds),
    credentials: "include" as const,
  };
  // Simulate network latency.
  await delay(700);
  await request(`/auth/login`, options);
}

export async function getUser() {
  const options = {
    method: "GET" as const,
    credentials: "include" as const,
  };
  const response = await request(`/auth/me`, options);
  const appUser = appUserResponseSchema.parse(response);
  return appUser;
}

export async function logoutUser() {
  const options = {
    method: "POST" as const,
    credentials: "include" as const,
  };
  await request(`/auth/logout`, options);
}
