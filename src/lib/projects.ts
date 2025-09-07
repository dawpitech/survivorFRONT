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
    social_media_url?: string;
    project_status?: string;
    needs?: string;
    image?: string;
    founders?: Array<{
        name: string;
        role?: string;
        linkedin?: string;
    }>;
};

export async function getProjects() {
    try {
        const projectsDetail: ProjectDetail[] = await apiClient.get("/startups")
        console.log("ProjectsDetail response is ", projectsDetail)
        return projectsDetail
    } catch (error) {
        console.error("Error while fetching projects", error)
        return null
    }
}
