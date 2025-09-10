"use client";

import { apiClient } from "@/lib/api";

export type ProjectDetail = {
    uuid: string;
    name: string;
    description?: string;
    sector?: string;
    email: string;
    phone?: string;
    address?: string;
    legal_status?: string;
    maturity?: string;
    created_at?: string;
    website_url?: string;
    views_count?: number;
    social_media_url?: string;
    project_status?: string;
    needs?: string;
    image?: string;
    founders?: Array<{
        uuid?: string;
        name: string;
        image: string;
    }>;
};

export async function getProjects(): Promise<ProjectDetail[] | null> {
    try {
        const projectsDetail: ProjectDetail[] = await apiClient.get("/startups/")
        return projectsDetail
    } catch (error) {
        console.error("Error while fetching projects", error)
        return null
    }
}

export async function getProjectByUuid(uuid: string): Promise<ProjectDetail | null> {
    try {
        const project: ProjectDetail = await apiClient.get(`/startups/${uuid}`);
        return project;
    } catch (error) {
        console.error("Error fetching project details:", error);
        return null;
    }
}

export async function updateProject(uuid: string, updatedData: Partial<ProjectDetail>) {
    try {
        const response = await apiClient.patch(`/startups/${uuid}`, JSON.stringify(updatedData));
        return response;
    } catch (err) {
        console.error("Failed to update project:", err);
        throw err;
    }
}

export async function upProjectStats(uuid: string) {
    try {
        const response = await apiClient.patch(`/startups/${uuid}/upViewCount`, "");
        return response;
    } catch (err) {
        console.error("Failed to update project:", err);
        throw err;
    }
}

export async function getPitchDeck(uuid: string): Promise<void> {
    const response = await apiClient.getRaw(`/startups/${uuid}/file`);
    if (!response.ok) {
        throw new Error("Failed to fetch pitch deck");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `pitch_deck.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export async function updatePitchDeck(uuid: string, file: File): Promise<void> {
    if (!file || file.type !== "application/pdf") {
        throw new Error("Only PDF files are allowed");
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        await apiClient.putForm(`/startups/${uuid}/file`, formData);
    } catch (err) {
        console.error(`Failed to update pitch deck for startup ${uuid}:`, err);
        throw err;
    }
}
