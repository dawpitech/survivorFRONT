"use client";

export function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    console.log(email);
    console.log(password);
}

export default function Login() {
}
