"use client";

import "../globals.css";
import NavBar from "@/components/layout/NavBar";
import {getUserInformation} from "@/lib/user";

import { FC, useEffect, useState } from "react";
import { X, Pencil } from "lucide-react";

interface UserInfo {
    [key: string]: string;
}

const ProfileCard: FC = () => {
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        (async () => {
            const data = await getUserInformation();
            setUser(data);
        })();
    }, []);

    if (!user) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }
    localStorage.setItem("uuid", user.uuid);

    return (
        <div className="w-full max-w-md mx-auto rounded-2xl shadow-lg border p-8 bg-white">
            <div className="flex justify-between items-start">
                <div className="flex gap-5">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-3xl">👤</span>
                        </div>
                        <button className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow">
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

            <hr className="my-6" />

            <div className="space-y-5">
                <div className="flex justify-between text-base">
                    <span className="text-gray-500">Name</span>
                    <span className="text-gray-800">{user.name}</span>
                </div>
                <div className="flex justify-between text-base">
                    <span className="text-gray-500">Email</span>
                    <span className="text-gray-800">{user.email}</span>
                </div>
                <div className="flex justify-between text-base">
                    <span className="text-gray-500">Role</span>
                    <span className="text-gray-800">{user.role}</span>
                </div>
            </div>

            <button className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium text-base">
                Save Change
            </button>
        </div>
    );
};

export default function ProfilePage() {
    return (
        <>
            <header>
                <NavBar />
            </header>
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
