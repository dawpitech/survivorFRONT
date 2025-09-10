"use client"

import {apiClient} from '@/lib/api'

export type ChatRoom = {
    uuid: string;
    first_party_uuid: string;
    second_party_uuid: string;
};

export type ChatMessage = {
    uuid: string;
    chat_room_uuid: string;
    content: string;
    receiver_uuid: string;
    sender_uuid: string;
    sent_at: string;
};

export type CreateRoomInput = {
    first_party_uuid: string;
    second_party_uuid: string;
};

export type NewMessageInput = {
    content: string;
    receiver_uuid: string;
    sender_uuid: string;
};

export async function fetchRooms(): Promise<ChatRoom[]> {
    try {
        const res = (await apiClient.get("/rooms/")) as ChatRoom[];
        return Array.isArray(res) ? res : [];
    } catch (e) {
        console.error("Failed to fetch rooms:", e);
        return [];
    }
}

export async function createRoom(input: CreateRoomInput): Promise<ChatRoom> {
    try {
        const res = (await apiClient.post(
            "/rooms/",
            JSON.stringify(input),
        )) as ChatRoom;
        return res;
    } catch (e) {
        console.error("Failed to create room:", e);
        throw e;
    }
}

export async function fetchRoomMessages(roomUuid: string): Promise<ChatMessage[]> {
    try {
        const res = (await apiClient.get(`/rooms/${roomUuid}`)) as ChatMessage[];
        return Array.isArray(res) ? res : [];
    } catch (e) {
        console.error(`Failed to fetch messages for room ${roomUuid}:`, e);
        return [];
    }
}

export async function sendMessage(
    roomUuid: string,
    input: NewMessageInput,
): Promise<ChatMessage> {
    try {
        const res = (await apiClient.put(
            `/rooms/${roomUuid}`,
            JSON.stringify(input),
        )) as ChatMessage;
        return res;
    } catch (e) {
        console.error(`Failed to send message in room ${roomUuid}:`, e);
        throw e;
    }
}