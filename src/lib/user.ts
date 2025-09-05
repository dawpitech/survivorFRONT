"use client";

import { apiClient } from "@/lib/api";

export async function getUserInformation() {
  try {
    const response = await apiClient.get(
      "/user/me",
    );

    console.log("Information", response);
  } catch (err) {
    console.error("Sign-up failed:", err);
  }
}
