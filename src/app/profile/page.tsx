"use client";

import "../globals.css";
import {getUserInformation} from "@/lib/user";
import {updateUserInformation} from "@/lib/user";

import { FC, useEffect, useState } from "react";
import { X, Pencil } from "lucide-react";

interface UserInfo {
    [key: string]: string;
}

const ProfileCard: FC = () => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [editName, setEditName] = useState(false);
    const [editEmail, setEditEmail] = useState(false);

    useEffect(() => {
        (async () => {
            const data = await getUserInformation();
            setUser(data);
        })();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await updateUserInformation(e);
        const updatedData = await getUserInformation();
        setUser(updatedData);
        setEditName(false);
        setEditEmail(false);
    };

    if (!user) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    return (
        <div className="w-full max-w-md mx-auto rounded-2xl shadow-lg border p-8 bg-white">
            {/* Header with avatar + close */}
            <div className="flex justify-between items-start">
                <div className="flex gap-5">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-3xl">👤</span>
                        </div>
                        {/* Pencil for profile picture (kept separate) */}
                        <button type="button" className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow">
                            <Pencil size={16} className="text-gray-600" />
                        </button>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{user.name}</h2>
                        <p className="text-base text-gray-500">{user.email}</p>
                    </div>
                </div>
                <button>
                    <X className="text-gray-500" size={22} />
                </button>
            </div>

            {/* Divider */}
            <hr className="my-6" />

            {/* Info form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name field */}
                <div className="flex justify-between items-center text-base">
                    <label className="text-gray-500" htmlFor="name">
                        Name
                    </label>
                    <div className="flex items-center gap-2">
                        {editName ? (
                            <input
                                id="name"
                                name="name"
                                defaultValue={user.name}
                                className="border rounded px-2 py-1 text-gray-800"
                            />
                        ) : (
                            <span className="text-gray-800">{user.name}</span>
                        )}
                        <button
                            type="button"
                            onClick={() => setEditName(!editName)}
                            className="p-1 rounded-full hover:bg-gray-100"
                        >
                            <Pencil size={16} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Email field */}
                <div className="flex justify-between items-center text-base">
                    <label className="text-gray-500" htmlFor="email">
                        Email
                    </label>
                    <div className="flex items-center gap-2">
                        {editEmail ? (
                            <input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={user.email}
                                className="border rounded px-2 py-1 text-gray-800"
                            />
                        ) : (
                            <span className="text-gray-800">{user.email}</span>
                        )}
                        <button
                            type="button"
                            onClick={() => setEditEmail(!editEmail)}
                            className="p-1 rounded-full hover:bg-gray-100"
                        >
                            <Pencil size={16} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Role field (read-only) */}
                <div className="flex justify-between text-base">
                    <span className="text-gray-500">Role</span>
                    <span className="text-gray-800">{user.role}</span>
                </div>

                {/* Save button if any field is being edited */}
                {(editName || editEmail) && (
                    <button
                        type="submit"
                        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium text-base"
                    >
                        Save Changes
                    </button>
                )}
            </form>
        </div>
    );
};

export default function ProfilePage() {
    return (
        <>
            <main>
                <h2 className="text-6xl pt-[3rem] pb-[2rem] text-center">My Profile</h2>

                <p className="text-xl mx-auto pl-[2rem] pb-[2rem] pr-[2rem] text-center">Here you can see and edit your profile&#39;s details.</p>

                <ProfileCard/>

            </main>
            <footer className="mt-16 pt-8 pb-6 border-t border-gray-200 bg-gray-50">
                <p className="text-center text-gray-600">© 2025 JEB Incubator</p>
            </footer>{" "}
        </>
    );
}
