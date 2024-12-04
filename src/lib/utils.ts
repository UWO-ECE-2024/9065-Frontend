import { API_URL } from "@/common/config";
import { CustomRequest } from "@/types/request-and-response";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const request = async ({
  method = "GET",
  path = "",
  data,
  token,
}: CustomRequest) => {
  const baseUrl = API_URL;

  let response;
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token || "",
  };
  if (method === "GET") {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
    });
  } else {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: JSON.stringify(data),
    });
  }

  const responseData = await response.json();
  console.log(responseData);

  if (!responseData.data) {
    throw new Error("No data found");
  }
  return responseData;
};

export const update_tokens = (data: {
  accessToken: string;
  refreshToken: string;
}) => {
  localStorage.setItem("token", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
};

export const clearUserAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

export const clearAdminAuth = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminRefreshToken");
};