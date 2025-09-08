"use client";

import { apiClient } from "@/lib/api";

export async function getUserInformation() {
  try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
    const response = await apiClient.get("/users/me");

    localStorage.setItem("uuid", response.uuid);
    return response;
  } catch (err) {
    console.error("Sign-up failed:", err);
    return "";
  }
}

export async function getAllUsers() {
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const response = await apiClient.get("/users/");

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const { profilePic, ...dataToSend } = updatedData;

        const response = await apiClient.patch(`/users/${uuid}`, JSON.stringify(dataToSend));
        return response.data;
    } catch (err) {
        console.error("Failed to update user:", err);
        throw err;
    }
}

export async function createUser(updatedData: UpdateUserData) {
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const { profilePic, investor_uuid, founder_uuid, uuid, ...dataToSend } = updatedData;

        const response = await apiClient.post(`/users/`, JSON.stringify(dataToSend));
        return response.data;
    } catch (err) {
        console.error("Failed to create user:", err);
        throw err;
    }
}

export async  function handleLogout() {
    localStorage.removeItem("uuid");
    localStorage.removeItem("token");
    window.location.href = "/";
}

export async function getUserProfilePicture(uuid: string): Promise<string> {
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const response = await apiClient.getRaw(`/users/${uuid}/picture`);
        if (!response.ok) {
            return "";
        }
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

export async function updateUserPicture(uuid: string, file: File): Promise<void> {
    try {
        const formData = new FormData();
        formData.append("picture", file);

        await apiClient.putForm(`/users/${uuid}/picture`, formData);
    } catch (err) {
        console.error(`Failed to update picture for user ${uuid}:`, err);
        throw err;
    }
}

export const userDeleteProfilePicture = async (uuid: string) => {
    return apiClient.delete(`/users/${uuid}/picture`);
};