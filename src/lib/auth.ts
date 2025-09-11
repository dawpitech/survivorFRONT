"use client";

import {apiClient} from "@/lib/api";

export async function handleSubmitSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    try {
        const response = await apiClient.post(
            "/auth/login",
            JSON.stringify({ email, password })
        );
        console.log("Login success:", response);

        if (response.token) {
            localStorage.setItem("token", response.token);
        }

        window.location.href = "/profile";

    } catch (err) {
        console.error("Login failed:", err);
        alert("Login failed: Check you email and password !")
    }
}

export async function handleSubmitSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    try {
        const response = await apiClient.post(
            "/auth/signup",
            JSON.stringify({ email, password })
        );
        console.log("Sign-up success:", response);

    } catch (err) {
        console.error("Sign-up failed:", err);
        alert("Sign Up failed: contact your administrator !")
    }
}
