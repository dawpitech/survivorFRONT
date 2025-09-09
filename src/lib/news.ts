"use client"

import {apiClient} from '@/lib/api'

export type News = {
    uuid: string
    location: string,
    title: string,
    category: string,
    startup_id: string,
    description: string,
    picture: string,
}

export async function fetchNews(): Promise<News[]> {
    try {
        const response: News[] = await apiClient.get("/news/")
        return response
    } catch (error) {
        console.error("Unable to fetch news from api")
        return []
    }
}

export async function editNews(id: string, updatedNews: Partial<News>): Promise<News> {
    try {
        const { uuid, picture, ...dataToSend } = updatedNews;
        return await apiClient.patch(`/news/${id}`, JSON.stringify((dataToSend)));
    } catch (error) {
        console.error("Failed to patch news:", error);
        throw error;
    }
}

export async function getNewsPicture(uuid: string): Promise<string> {
    try {
        const response = await apiClient.getRaw(`/news/${uuid}/picture`);
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
        console.error(`Failed to fetch picture for news ${uuid}:`, err);
        return "";
    }
}

export async function updateNewsPicture(uuid: string, file: File): Promise<void> {
    try {
        const formData = new FormData();
        formData.append("picture", file);

        await apiClient.putForm(`/news/${uuid}/picture`, formData);
    } catch (err) {
        console.error(`Failed to update picture for news ${uuid}:`, err);
        throw err;
    }
}
