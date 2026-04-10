import { AppError, errorSchema } from "@customTypes/appError";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type EmptyRequestOptions = RequestInit & { method: "DELETE" | "PATCH" };
type JsonRequestOptions = RequestInit & { method: "GET" | "POST" };

function request(endpoint: string, options: EmptyRequestOptions): Promise<void>;
function request(
  endpoint: string,
  options: JsonRequestOptions,
): Promise<unknown>;
async function request(
  endpoint: string,
  options: EmptyRequestOptions | JsonRequestOptions,
): Promise<unknown | void> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json();
    const result = errorSchema.safeParse(error);
    if (result.success) {
      throw new AppError(response.status, result.data.message);
    } else {
      throw new AppError(response.status, "Unexpected App error");
    }
  }

  if (
    options.method === "DELETE" ||
    options.method === "PATCH" ||
    response.status === 204
  ) {
    return;
  }

  if (response.status === 200 || response.status === 201) {
    return await response.json();
  } else {
    throw new AppError(418, "Unhandled response status");
  }
}

export default request;
