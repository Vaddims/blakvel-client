import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";

export const apiBaseQuery = fetchBaseQuery({ baseUrl: "/api" });