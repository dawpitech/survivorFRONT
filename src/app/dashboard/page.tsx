"use client";

import { useState } from "react";
import "../globals.css";
import NavBar from "@/components/layout/NavBar";

type Page = "projects" | "founders" | "investors" | "messages" | "statistics";

export default function DashboardPage() {
    const [activePage, setActivePage] = useState<Page>("messages");

    return (
        <>
            <header>
                <NavBar />
            </header>

            <main className="flex min-h-screen">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-100 border-r border-gray-300 p-4 flex flex-col">
                    <h2 className="text-lg font-semibold mb-6">Dashboard</h2>
                    <nav className="flex flex-col gap-2">
                        <button
                            onClick={() => setActivePage("projects")}
                            className={`text-left px-4 py-2 rounded-lg ${
                                activePage === "projects"
                                    ? "bg-blue-500 text-white"
                                    : "hover:bg-gray-200"
                            }`}
                        >
                            Manage Projects
                        </button>
                        <button
                            onClick={() => setActivePage("founders")}
                            className={`text-left px-4 py-2 rounded-lg ${
                                activePage === "founders"
                                    ? "bg-blue-500 text-white"
                                    : "hover:bg-gray-200"
                            }`}
                        >
                            Manage Founders
                        </button>
                        <button
                            onClick={() => setActivePage("investors")}
                            className={`text-left px-4 py-2 rounded-lg ${
                                activePage === "investors"
                                    ? "bg-blue-500 text-white"
                                    : "hover:bg-gray-200"
                            }`}
                        >
                            Manage Investors
                        </button>
                        <button
                            onClick={() => setActivePage("messages")}
                            className={`text-left px-4 py-2 rounded-lg ${
                                activePage === "messages"
                                    ? "bg-blue-500 text-white"
                                    : "hover:bg-gray-200"
                            }`}
                        >
                            Messages
                        </button>
                        <button
                            onClick={() => setActivePage("statistics")}
                            className={`text-left px-4 py-2 rounded-lg ${
                                activePage === "statistics"
                                    ? "bg-blue-500 text-white"
                                    : "hover:bg-gray-200"
                            }`}
                        >
                            Statistics
                        </button>
                    </nav>
                </aside>

                {/* Content Area */}
                <section className="flex-1 p-6">
                    {activePage === "messages" && <MessagesPage />}
                    {activePage === "projects" && <div>📁 Projects management coming soon...</div>}
                    {activePage === "founders" && <div>👨‍💼 Founders management coming soon...</div>}
                    {activePage === "investors" && <div>💰 Investors management coming soon...</div>}
                    {activePage === "statistics" && <div>📊 Statistics dashboard coming soon...</div>}
                </section>
            </main>

            <footer className="mt-16 pt-8 pb-6 border-t border-gray-200 bg-gray-50">
                <p className="text-center text-gray-600">© 2025 JEB Incubator</p>
            </footer>
        </>
    );
}

function MessagesPage() {
    return (
        <div className="flex border rounded-lg shadow h-[600px]">
            {/* Discussions Sidebar */}
            <div className="w-1/4 border-r p-2 bg-gray-50">
                <h3 className="font-semibold mb-4">Discussions</h3>
                <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 rounded-lg bg-red-200">
                        John Doe
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg border">
                        Daniel Cotton
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg border">
                        Elon Musk
                    </button>
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-3 border-b bg-gray-100 font-semibold">John Doe</div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {/* Recipient Message */}
                    <div className="flex flex-col items-start">
                        <div className="bg-blue-100 px-3 py-2 rounded-lg max-w-xs">
                            Hey! Are we still on for tomorrow?
                        </div>
                        <div className="text-xs text-gray-500 mt-1">10:45 AM</div>
                    </div>

                    {/* My Message */}
                    <div className="flex flex-col items-end">
                        <div className="bg-green-100 px-3 py-2 rounded-lg max-w-xs">
                            Yes, looking forward to it!
                        </div>
                        <div className="text-xs text-gray-500 mt-1">10:46 AM</div>
                    </div>

                    {/* Recipient Message */}
                    <div className="flex flex-col items-start">
                        <div className="bg-blue-100 px-3 py-2 rounded-lg max-w-xs">
                            Great! See you then.
                        </div>
                        <div className="text-xs text-gray-500 mt-1">10:47 AM</div>
                    </div>
                </div>

                {/* Input Box */}
                <div className="flex border-t p-2">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 border rounded-lg px-3 py-2 mr-2"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
