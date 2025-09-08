"use client";

import { apiClient } from "@/lib/api";

export async function getUserInformation() {
  try {
    const response = await apiClient.get("/users/me");

    console.log("Information", response);
    localStorage.setItem("uuid", response.uuid);
    return response;
  } catch (err) {
    console.error("Sign-up failed:", err);
    return "";
  }
}

export async function getAllUsers() {
    try {
        const response = await apiClient.get("/users/");

        console.log("All users", response);
        return response;
    } catch (err) {
        console.error("Fetching all users failed:", err);
        return [];
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

export type User = {
    uuid: string;
    name: string;
    email: string;
    role: "admin" | "founder" | "investor";
    founder_uuid?: string | null;
    investor_uuid?: string | null;
    profilePic?: string;
};

export type UpdateUserData = Partial<{
    name: string;
    email: string;
    password: string;
    role: User["role"];
}>;

export async function updateUserInformation(uuid: string, updatedData: UpdateUserData) {
    try {
        const response = await apiClient.patch(`/users/${uuid}`, JSON.stringify(updatedData));
        console.log("User updated:", response.data);
        return response.data;
    } catch (err) {
        console.error("Failed to update user:", err);
        throw err;
    }
}

export async function getUserProfilePicture(uuid: string): Promise<string> {
    try {
        const response = await apiClient.getRaw(`/users/${uuid}/picture`);
        const blob = await response.blob();

        return await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (err) {
        console.error(`Failed to fetch picture for user ${uuid}:`, err);
        return "";
    }
}
