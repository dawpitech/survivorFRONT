"use client"

import {apiClient} from '@/lib/api'

export type Events = {
    uuid: string
    name: string,
    date?: string,
    location?: string,
    description?: string,
    event_type?: string,
    target_audience?: string,
}

export async function fetchEvents(): Promise<Events[]> {
    try {
        const response: Events[] = await apiClient.get("/events/")
        return response
    } catch (error) {
        console.error("Unable to fetch events from api")
        return []
    }
}

export async function editEvent(id: string, updatedEvent: Partial<Events>): Promise<Events> {
    try {
        const { uuid, ...dataToSend } = updatedEvent;
        return await apiClient.patch(`/events/${id}`, JSON.stringify((dataToSend)));
    } catch (error) {
        console.error("Failed to patch event:", error);
        throw error;
    }
}

export async function createEvent(newEvent: {
    name: string;
    date?: string;
    location?: string;
    description?: string;
    event_type?: string;
    target_audience?: string;
    uuid: string
}): Promise<Events> {
    try {
        const { uuid, ...dataToSend } = newEvent;
        const response: Events = await apiClient.post(`/events/`, JSON.stringify((dataToSend)));
        return editEvent(response.uuid, dataToSend);
    } catch (error) {
        console.error("Failed to patch event:", error)
        throw error;
    }
}
