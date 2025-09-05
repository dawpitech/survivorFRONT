"use client";

import { apiClient } from "@/lib/api";

export async function getUserInformation() {
  try {
    const response = await apiClient.get("/user/me");

    console.log("Information", response);
    localStorage.setItem("uuid", response.uuid);
    return response;
  } catch (err) {
    console.error("Sign-up failed:", err);
    return "";
  }
}

interface UpdateUserData {
  email?: string;
  password?: string;
  name?: string;
}

export async function updateUserInformation(
  e: React.FormEvent<HTMLFormElement>,
) {
  const data = new FormData(e.currentTarget);
  const email = data.get("email") as string;
  const pwd = data.get("password") as string;
  const name = data.get("name") as string;
  const id = localStorage.getItem("uuid");

  const updateData: UpdateUserData = {};

  if (email && email.trim() !== "") {
    updateData.email = email;
  }

  if (pwd && pwd.trim() !== "") {
    updateData.password = pwd;
  }

  if (name && name.trim() !== "") {
    updateData.name = name;
  }

  try {
    const response = await apiClient.patch(
      `/user/${id}`,
      JSON.stringify(updateData),
    );
    console.log("Information", response);
  } catch (err) {
    console.error("Get user failed:", err);
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
