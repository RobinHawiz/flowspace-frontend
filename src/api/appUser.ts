import request from "@api/request";
import {
  appUserResponseSchema,
  type AppUserCredentials,
  type AppUserRegistration,
} from "@customTypes/appUser";
import { AuthTokenResponseSchema } from "@customTypes/auth";

export async function registerUser(appUser: AppUserRegistration) {
  const options = {
    method: "POST" as const,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appUser),
  };
  await request(`/auth/register`, options);
}

export async function loginUser(creds: AppUserCredentials) {
  const options = {
    method: "POST" as const,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(creds),
  };
  const response = await request(`/auth/login`, options);
  const Jwt = AuthTokenResponseSchema.parse(response);
  return Jwt.token;
}

export async function getUser() {
  const options = {
    method: "GET" as const,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const response = await request(`/auth/me`, options);
  const appUser = appUserResponseSchema.parse(response);
  return appUser;
}
