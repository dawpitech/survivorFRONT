"use client";

import { apiClient } from "@/lib/api";

export async function getUserInformation() {
    const token = localStorage.getItem("token");
  try {
    const response = await apiClient.get(
      "/user/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Information", response);
  } catch (err) {
    console.error("Sign-up failed:", err);
  }
}
