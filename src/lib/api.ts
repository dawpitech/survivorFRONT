const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:24680/api";

export const apiClient = {
  get: async (endpoint: string, options?: RequestInit) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) throw new Error("Request error");
    return response.json();
  },

  post: async (endpoint: string, data: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    if (!response.ok) throw new Error("Request error");
    return response.json();
  },
};
