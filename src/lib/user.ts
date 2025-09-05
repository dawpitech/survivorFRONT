"use client";

import { apiClient } from "@/lib/api";

export async function getUserInformation() {
  try {
    const response = await apiClient.get("/user/me");

    console.log("Information", response);
    return response;
  } catch (err) {
    console.error("Sign-up failed:", err);
    return "";
  }
}

export async function updateUserInformation() {
  const id = localStorage.getItem("id");
  const email = "email";
  const pwd = "UserName";
  try {
    const response = await apiClient.patch(
      `/users/:${id}`,
      JSON.stringify({ email, pwd }),
    );
    console.log("Information", response);
  } catch (err) {
    console.error("Sign-up failed:", err);
  }
}

export async function createUserAdmin() {
  const email = "email";
  const name = "UserName";
  const role = "investor";
  try {
    const response = await apiClient.post(
      "/users",
      JSON.stringify({ email, name, role }),
    );
    console.log("Information", response);
  } catch (err) {
    console.error("Sign-up failed:", err);
  }
}
