"use client";

import { useState, useRef } from "react";
import "../globals.css";
import NavBar from "@/components/layout/NavBar";

type Page = "projects" | "users" | "messages" | "statistics";

interface User {
    id: number;
    name: string;
    email: string;
    role: "Admin" | "Founder" | "Investor";
    profilePic?: string;
}

interface Project {
    id: number;
    name: string;
    description: string;
    image?: string;
}

export default function DashboardPage() {
    const [activePage, setActivePage] = useState<Page>("users");

    return (
        <>
            <header>
                <NavBar />
            </header>

            <main className="flex min-h-screen">
                <aside className="w-64 bg-gray-100 border-r border-gray-300 p-4 flex flex-col">
                    <h2 className="text-lg font-semibold mb-6">Dashboard</h2>
                    <nav className="flex flex-col gap-2">
                        <SidebarButton page="projects" activePage={activePage} setActivePage={setActivePage}>
                            Manage Projects
                        </SidebarButton>
                        <SidebarButton page="users" activePage={activePage} setActivePage={setActivePage}>
                            Manage Users
                        </SidebarButton>
                        <SidebarButton page="messages" activePage={activePage} setActivePage={setActivePage}>
                            Messages
                        </SidebarButton>
                        <SidebarButton page="statistics" activePage={activePage} setActivePage={setActivePage}>
                            Statistics
                        </SidebarButton>
                    </nav>
                </aside>

                <section className="flex-1 p-6">
                    {activePage === "users" && <ManageUsers />}
                    {activePage === "projects" && <ManageProjects />}
                    {activePage === "messages" && <MessagesPage />}
                    {activePage === "statistics" && <div>📊 Statistics dashboard coming soon...</div>}
                </section>
            </main>

            <footer className="mt-16 pt-8 pb-6 border-t border-gray-200 bg-gray-50">
                <p className="text-center text-gray-600">© 2025 JEB Incubator</p>
            </footer>
        </>
    );
}

function SidebarButton({
                           page,
                           activePage,
                           setActivePage,
                           children,
                       }: {
    page: Page;
    activePage: Page;
    setActivePage: (page: Page) => void;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={() => setActivePage(page)}
            className={`text-left px-4 py-2 rounded-lg ${
                activePage === page ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
        >
            {children}
        </button>
    );
}

function ManageUsers() {
    const [users, setUsers] = useState<User[]>([
        { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
        { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Founder" },
        { id: 3, name: "Charlie Lee", email: "charlie@example.com", role: "Investor" },
    ]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<"All" | "Admin" | "Founder" | "Investor">("All");
    const [sortKey, setSortKey] = useState<keyof User>("name");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleSort = (key: keyof User) => {
        if (sortKey === key) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    const filteredUsers = users
        .filter((u) => {
            const matchesSearch =
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase());
            const matchesRole = roleFilter === "All" || u.role === roleFilter;
            return matchesSearch && matchesRole;
        })
        .sort((a, b) => {
            const v1 = a[sortKey];
            const v2 = b[sortKey];
            if (v1 && v2) {
                if (v1 < v2) return sortDir === "asc" ? -1 : 1;
                if (v1 > v2) return sortDir === "asc" ? 1 : -1;
            }
            return 0;
        });

    const arrow = (key: keyof User) =>
        sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : "";

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage Users</h2>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-3 py-1 rounded-lg"
                    />
                    <select
                        value={roleFilter}
                        onChange={(e) =>
                            setRoleFilter(e.target.value as "All" | "Admin" | "Founder" | "Investor")
                        }
                        className="border px-3 py-1 rounded-lg"
                    >
                        <option value="All">All Roles</option>
                        <option value="Admin">Admins</option>
                        <option value="Founder">Founders</option>
                        <option value="Investor">Investors</option>
                    </select>
                </div>
            </div>

            <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                <tr>
                    <th
                        className="p-2 border cursor-pointer"
                        onClick={() => handleSort("name")}
                    >
                        Name{arrow("name")}
                    </th>
                    <th
                        className="p-2 border cursor-pointer"
                        onClick={() => handleSort("email")}
                    >
                        Email{arrow("email")}
                    </th>
                    <th
                        className="p-2 border cursor-pointer"
                        onClick={() => handleSort("role")}
                    >
                        Role{arrow("role")}
                    </th>
                </tr>
                </thead>
                <tbody>
                {filteredUsers.map((u) => (
                    <tr
                        key={u.id}
                        className="border-t hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedUser(u)}
                    >
                        <td className="p-2 border">{u.name}</td>
                        <td className="p-2 border">{u.email}</td>
                        <td className="p-2 border">{u.role}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {selectedUser && (
                <UserModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onSave={(updated) => {
                        setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
                        setSelectedUser(null);
                    }}
                />
            )}
        </div>
    );
}

function UserModal({
                       user,
                       onClose,
                       onSave,
                   }: {
    user: User;
    onClose: () => void;
    onSave: (user: User) => void;
}) {
    const [edited, setEdited] = useState<User>(user);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setEdited({ ...edited, profilePic: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const handleResetProfilePic = () => {
        setEdited({ ...edited, profilePic: "" });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h3 className="text-lg font-semibold mb-4">Edit User</h3>

                <div className="flex flex-col items-center mb-4">
                    <img
                        src={edited.profilePic || "https://via.placeholder.com/80"}
                        alt="Profile"
                        className="w-20 h-20 rounded-full mb-2"
                    />
                    <div className="flex space-x-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gray-200 px-3 py-1 rounded-lg"
                        >
                            Change Profile Picture
                        </button>
                        <button
                            onClick={handleResetProfilePic}
                            className="bg-red-200 px-3 py-1 rounded-lg"
                        >
                            Reset
                        </button>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                <input
                    type="text"
                    value={edited.name}
                    onChange={(e) => setEdited({ ...edited, name: e.target.value })}
                    className="border rounded px-2 py-1 w-full mb-2"
                    placeholder="Name"
                />

                <input
                    type="email"
                    value={edited.email}
                    onChange={(e) => setEdited({ ...edited, email: e.target.value })}
                    className="border rounded px-2 py-1 w-full mb-2"
                    placeholder="Email"
                />

                <select
                    value={edited.role}
                    onChange={(e) =>
                        setEdited({ ...edited, role: e.target.value as User["role"] })
                    }
                    className="border rounded px-2 py-1 w-full mb-2"
                >
                    <option>Admin</option>
                    <option>Founder</option>
                    <option>Investor</option>
                </select>

                <button
                    onClick={() => alert("Password reset requested")}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg w-full mb-2"
                >
                    Reset Password
                </button>

                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-300">
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(edited)}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

function ManageProjects() {
    const [projects, setProjects] = useState<Project[]>([
        { id: 1, name: "Project Alpha", description: "First project", image: "" },
        { id: 2, name: "Project Beta", description: "Second project", image: "" },
        { id: 3, name: "Project Gamma", description: "Third project", image: "" },
    ]);
    const [search, setSearch] = useState("");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const handleSort = () => {
        setSortDir(sortDir === "asc" ? "desc" : "asc");
    };

    const filteredProjects = projects
        .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (a.name < b.name) return sortDir === "asc" ? -1 : 1;
            if (a.name > b.name) return sortDir === "asc" ? 1 : -1;
            return 0;
        });

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage Projects</h2>
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-3 py-1 rounded-lg"
                />
            </div>

            <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                <tr>
                    <th
                        className="p-2 border cursor-pointer"
                        onClick={handleSort}
                    >
                        Name {sortDir === "asc" ? "↑" : "↓"}
                    </th>
                    <th className="p-2 border">Description</th>
                </tr>
                </thead>
                <tbody>
                {filteredProjects.map((p) => (
                    <tr
                        key={p.id}
                        className="border-t hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedProject(p)}
                    >
                        <td className="p-2 border">{p.name}</td>
                        <td className="p-2 border">{p.description}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                    onSave={(updated) => {
                        setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
                        setSelectedProject(null);
                    }}
                />
            )}
        </div>
    );
}

function ProjectModal({
                          project,
                          onClose,
                          onSave,
                      }: {
    project: Project;
    onClose: () => void;
    onSave: (project: Project) => void;
}) {
    const [edited, setEdited] = useState<Project>(project);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setEdited({ ...edited, image: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h3 className="text-lg font-semibold mb-4">Edit Project</h3>

                <input
                    type="text"
                    value={edited.name}
                    onChange={(e) => setEdited({ ...edited, name: e.target.value })}
                    className="border rounded px-2 py-1 w-full mb-2"
                />
                <textarea
                    value={edited.description}
                    onChange={(e) =>
                        setEdited({ ...edited, description: e.target.value })
                    }
                    className="border rounded px-2 py-1 w-full mb-2"
                />

                <div className="flex flex-col items-center mb-4">
                    {edited.image && (
                        <img
                            src={edited.image}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded mb-2"
                        />
                    )}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-200 px-3 py-1 rounded-lg"
                    >
                        Change Project Image
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-300">
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(edited)}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

function MessagesPage() {
    return (
        <div className="flex border rounded-lg shadow h-[600px]">
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

            <div className="flex-1 flex flex-col">
                <div className="p-3 border-b bg-gray-100 font-semibold">John Doe</div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    <div className="flex flex-col items-start">
                        <div className="bg-blue-100 px-3 py-2 rounded-lg max-w-xs">
                            Hey! Are we still on for tomorrow?
                        </div>
                        <div className="text-xs text-gray-500 mt-1">10:45 AM</div>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className="bg-green-100 px-3 py-2 rounded-lg max-w-xs">
                            Yes, looking forward to it!
                        </div>
                        <div className="text-xs text-gray-500 mt-1">10:46 AM</div>
                    </div>

                    <div className="flex flex-col items-start">
                        <div className="bg-blue-100 px-3 py-2 rounded-lg max-w-xs">
                            Great! See you then.
                        </div>
                        <div className="text-xs text-gray-500 mt-1">10:47 AM</div>
                    </div>
                </div>

                <div className="flex border-t p-2">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 border rounded-lg px-3 py-2 mr-2"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Send</button>
                </div>
            </div>
        </div>
    );
}
