"use client";

import "../globals.css";
import {getUserInformation, getUserProfilePicture, updateUserPicture} from "@/lib/user";
import {updateUserInformation} from "@/lib/user";

import { FC, useEffect, useState } from "react";
import { X, Pencil } from "lucide-react";

export type User = {
    uuid: string;
    name: string;
    email: string;
    role: "admin" | "founder" | "investor";
    founder_uuid?: string | null;
    investor_uuid?: string | null;
    profilePic?: string;
};

const ProfileCard: FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [editName, setEditName] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    useEffect(() => {
        (async () => {
            const data = await getUserInformation();
            if (data == "") return;
            setUser(data);

            if (data?.uuid) {
                const pic = await getUserProfilePicture(data.uuid);
                setProfilePic(pic || null);
            }
        })();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;

        const formData = new FormData(e.currentTarget);
        const updatedData: { name?: string; email?: string } = {};

        if (editName) {
            updatedData.name = formData.get("name") as string;
        }
        if (editEmail) {
            updatedData.email = formData.get("email") as string;
        }

        try {
            await updateUserInformation(user.uuid, updatedData);
            const updatedUser = await getUserInformation();
            if (updatedUser == "") throw new Error("Failed to update user");
            setUser(updatedUser);

            if (updatedUser?.uuid) {
                const pic = await getUserProfilePicture(updatedUser.uuid);
                setProfilePic(pic || null);
            }

            setEditName(false);
            setEditEmail(false);
        } catch (err) {
            console.error("Failed to update user:", err);
        }
    };

    const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user || !e.target.files?.[0]) return;

        const file = e.target.files[0];

        if (file.type !== "image/png") {
            setShowErrorModal(true);
            return;
        }

        try {
            await updateUserPicture(user.uuid, file);

            const objectUrl = URL.createObjectURL(file);
            setProfilePic(objectUrl);
        } catch (err) {
            console.error("Failed to update profile picture:", err);
            setShowErrorModal(true);
        }
    };

    if (!user) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    return (
        <div className="w-full max-w-md mx-auto rounded-2xl shadow-lg border p-8 bg-white relative">
            <div className="flex justify-between items-start">
                <div className="flex gap-5">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {profilePic ? (
                                <img
                                    src={profilePic}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-500 text-3xl">👤</span>
                            )}
                        </div>
                        {/* Hidden file input */}
                        <input
                            type="file"
                            accept="image/png"
                            className="hidden"
                            id="profile-upload"
                            onChange={handleProfilePicChange}
                        />
                        <label
                            htmlFor="profile-upload"
                            className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow cursor-pointer hover:bg-gray-100"
                        >
                            <Pencil size={16} className="text-gray-600" />
                        </label>
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

            <hr className="my-6" />

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

                {/* Role field */}
                <div className="flex justify-between text-base">
                    <span className="text-gray-500">Role</span>
                    <span className="text-gray-800 capitalize">{user.role}</span>
                </div>

                {(editName || editEmail) && (
                    <button
                        type="submit"
                        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium text-base"
                    >
                        Save Changes
                    </button>
                )}
            </form>

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Upload Error
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Only PNG files are allowed!
                        </p>
                        <button
                            onClick={() => setShowErrorModal(false)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
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