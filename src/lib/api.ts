const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:24680/api";

export const apiClient = {
  get: async (endpoint: string, p0: { responseType: string; }) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Request error");
    return response.json();
  },

    getRaw: async (endpoint: string, p0: { responseType: string; }) => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        });
        if (!response.ok) throw new Error("Request error");
        return response;
    },

    put: async (endpoint: string, data: string) => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "PUT",
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
            },
            body: data,
        });
        if (!response.ok) throw new Error("Request error");
        return response.json();
    },

    putForm: async (endpoint: string, data: FormData) => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "PUT",
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
            body: data,
        });
        if (!response.ok) throw new Error("Request error");
        return response.json();
    },

  post: async (endpoint: string, data: string) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: data,
    });
    if (!response.ok) throw new Error("Request error");
    return response.json();
  },

  patch: async (endpoint: string, data: string) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: data,
    });
    if (!response.ok) throw new Error("Request error");
    return response.json();
  },
};
