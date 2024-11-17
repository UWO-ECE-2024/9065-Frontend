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
}: CustomRequest) => {
  // const baseUrl = process.env.API_URL;
  const baseUrl = API_URL;

  let response;
  const headers = {
    "Content-Type": "application/json",
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
