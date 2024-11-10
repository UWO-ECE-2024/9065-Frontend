export type CustomRequest = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  data?: object;
};
