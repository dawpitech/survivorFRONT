"use client"

import {apiClient} from '@/lib/api'

export type Events = {
    uuid: number
    name: string,
    dates?: string,
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

export async function editEvent(id: number, updatedEvent: Partial<Events>): Promise<void> {
    try {
        const { uuid, ...dataToSend } = updatedEvent;
        await apiClient.patch(`/events/${id}`, JSON.stringify((dataToSend)));
    } catch (error) {
        console.error("Failed to patch event:", error)
    }
}
