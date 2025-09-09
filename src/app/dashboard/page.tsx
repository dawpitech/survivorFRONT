"use client";

import {useState, useRef, useEffect} from "react";
import "../globals.css";
import {
    getAllUsers,
    User,
    updateUserInformation,
    getUserProfilePicture,
    getUserInformation,
    updateUserPicture, userDeleteProfilePicture, createUser, getFounderInfos, FounderDetail, getInvestorsInfos,
    updateInvestorsInfos, Investor
} from "@/lib/user";
import {getProjects, ProjectDetail, updateProject} from "@/lib/projects";

type Page = "projects" | "users" | "messages" | "statistics" | "my-startup" | "investor-infos";

export default function DashboardPage() {
    const [activePage, setActivePage] = useState<Page>("messages");
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUser() {
            const user = await getUserInformation();
            if (user == "") return;
            if (user?.role) {
                setUserRole(user.role);
                setActivePage(user.role === "admin" ? "users" : "messages");
            }
        }
        fetchUser();
    }, []);

    return (
        <>
            <main className="flex min-h-screen">
                <aside className="w-64 bg-gray-100 border-r border-gray-300 p-4 flex flex-col">
                    <h2 className="text-lg font-semibold mb-6">Dashboard</h2>
                    <nav className="flex flex-col gap-2">
                        {userRole === "admin" && (
                            <>
                                <SidebarButton page="projects" activePage={activePage} setActivePage={setActivePage}>
                                    Manage Startups
                                </SidebarButton>
                                <SidebarButton page="users" activePage={activePage} setActivePage={setActivePage}>
                                    Manage Users
                                </SidebarButton>
                            </>
                        )}
                        {userRole === "founder" && (
                            <SidebarButton page="my-startup" activePage={activePage} setActivePage={setActivePage}>
                                My Startup
                            </SidebarButton>
                        )}
                        {userRole === "investor" && (
                            <SidebarButton page="investor-infos" activePage={activePage} setActivePage={setActivePage}>
                                Your Informations
                            </SidebarButton>
                        )}

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
                    {activePage === "my-startup" && <MyStartupPage />}
                    {activePage === "investor-infos" && <InvestorInfosPage />}
                </section>
            </main>

            <footer className="mt-16 pt-8 pb-6 border-t border-gray-200 bg-gray-50">
                <p className="text-center text-gray-600">© 2025 JEB Incubator</p>
            </footer>
        </>
    );
}

function InvestorInfosPage() {
    const [investor, setInvestor] = useState<Investor | null>(null);
    const [edited, setEdited] = useState<Investor | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [investor_uuid, setInvestor_uuid] = useState<string | null>(null);

    useEffect(() => {
        const loadInvestor = async () => {
            try {
                const user = await getUserInformation();
                if (user == "") throw new Error("User not found");
                if (user?.investor_uuid) {
                    setInvestor_uuid(user.investor_uuid);
                    const data = await getInvestorsInfos(user.investor_uuid);
                    if (Array.isArray(data)) {
                        return;
                    }
                    setInvestor(data);
                    setEdited(data);
                }
            } catch (err) {
                console.error("Failed to load investor infos:", err);
            } finally {
                setLoading(false);
            }
        };
        loadInvestor();
    }, []);

    const handleSave = async () => {
        if (!edited || !investor_uuid) return;
        setSaving(true);
        try {
            await updateInvestorsInfos(investor_uuid, edited as Partial<typeof edited>);
            setInvestor(edited);
            setEditing(false);
        } catch (err) {
            console.error("Failed to update investor infos:", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!investor) return <div className="p-6">No investor information found.</div>;

    const renderField = (
        label: string,
        key: keyof Investor,
        type: "text" | "email" | "tel" | "textarea" = "text"
    ) => {
        if (!edited) return null;

        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                {type === "textarea" ? (
                    <textarea
                        value={edited[key] || ""}
                        onChange={(e) => setEdited({ ...edited, [key]: e.target.value })}
                        className="border rounded px-3 py-2 w-full h-24"
                        placeholder={label}
                        disabled={!editing}
                    />
                ) : (
                    <input
                        type={type}
                        value={edited[key] || ""}
                        onChange={(e) => setEdited({ ...edited, [key]: e.target.value })}
                        className="border rounded px-3 py-2 w-full"
                        placeholder={label}
                        disabled={!editing}
                    />
                )}
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Your Informations</h2>
            <div className="border p-6 rounded-xl shadow-lg bg-white space-y-4">
                {renderField("Name", "name")}
                {renderField("Email", "email", "email")}
                {renderField("Phone", "phone", "tel")}
                {renderField("Address", "address")}
                {renderField("Legal Status", "legal_status")}
                {renderField("Investor Type", "investor_type")}
                {renderField("Investment Focus", "investment_focus")}
                {renderField("Description", "description", "textarea")}

                <div className="flex justify-end space-x-3">
                    {!editing ? (
                        <button
                            onClick={() => setEditing(true)}
                            className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white"
                        >
                            Edit
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={() => {
                                    setEdited(investor);
                                    setEditing(false);
                                }}
                                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-black"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}


function MyStartupPage() {
    const [founder, setFounder] = useState<FounderDetail>();
    const [loading, setLoading] = useState(true);
    const [selectedStartup, setSelectedStartup] = useState<ProjectDetail>();

    useEffect(() => {
        const loadFounder = async () => {
            try {
                const user = await getUserInformation();
                if (user == "") throw new Error("User not found");
                if (user?.founder_uuid) {
                    const response = await getFounderInfos(user.founder_uuid);
                    if (Array.isArray(response)) {
                        return;
                    }
                    setFounder(response);
                }
            } catch (err) {
                console.error("Failed to load founder infos:", err);
            } finally {
                setLoading(false);
            }
        };
        loadFounder();
    }, []);

    const handleProjectUpdate = async (updatedStartup: ProjectDetail) => {
        try {
            const { uuid, created_at, ...dataToUpdate } = updatedStartup;

            await updateProject(uuid, dataToUpdate);
            setFounder((prev) =>
                prev ? { ...prev, startup: { ...updatedStartup } } : prev
            );
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setSelectedStartup(null);
        } catch (err) {
            console.error("Failed to update startup:", err);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!founder?.startup) return <div className="p-6">No startup linked to your account.</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">My Startup</h2>

            <div className="border p-6 rounded-xl shadow-lg bg-white">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">{founder.startup.name}</h3>
                        <p className="text-gray-700 mb-4">{founder.startup.description}</p>
                    </div>
                    <button
                        onClick={() => setSelectedStartup(founder.startup)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Edit
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                        <p><span className="font-medium">Sector:</span> {founder.startup.sector}</p>
                        <p><span className="font-medium">Maturity:</span> {founder.startup.maturity}</p>
                        <p><span className="font-medium">Status:</span> {founder.startup.project_status}</p>
                        <p><span className="font-medium">Legal Status:</span> {founder.startup.legal_status}</p>
                    </div>

                    <div>
                        <p><span className="font-medium">Address:</span> {founder.startup.address}</p>
                        <p><span className="font-medium">Email:</span> {founder.startup.email}</p>
                        <p><span className="font-medium">Phone:</span> {founder.startup.phone}</p>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-4">
                    {founder.startup.website_url && (
                        <a
                            href={founder.startup.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            🌐 Website
                        </a>
                    )}
                    {founder.startup.social_media_url && (
                        <a
                            href={founder.startup.social_media_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            🔗 Social Media
                        </a>
                    )}
                </div>

                {founder.startup.needs && (
                    <div className="mt-6">
                        <h4 className="font-medium text-gray-800 mb-1">Needs</h4>
                        <p className="text-gray-700">{founder.startup.needs}</p>
                    </div>
                )}
            </div>

            {selectedStartup && (
                <ProjectModal
                    project={selectedStartup}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    onClose={() => setSelectedStartup(null)}
                    onSave={handleProjectUpdate}
                />
            )}
        </div>
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

function CreateUserModal({
                             onClose,
                             onCreate,
                         }: {
    onClose: () => void;
    onCreate: (user: Omit<User, "uuid">) => void;
}) {
    const [form, setForm] = useState<Omit<User, "uuid">>({
        name: "",
        email: "",
        role: "investor", // default
    });

    const handleSubmit = () => {
        if (!form.name || !form.email) {
            alert("Please fill in all fields");
            return;
        }
        onCreate(form);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h3 className="text-lg font-semibold mb-4">Create User</h3>

                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border rounded px-2 py-1 w-full mb-2"
                    placeholder="Name"
                />
                <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="border rounded px-2 py-1 w-full mb-2"
                    placeholder="Email"
                />
                <select
                    value={form.role}
                    onChange={(e) =>
                        setForm({ ...form, role: e.target.value as User["role"] })
                    }
                    className="border rounded px-2 py-1 w-full mb-4"
                >
                    <option value="admin">Admin</option>
                    <option value="founder">Founder</option>
                    <option value="investor">Investor</option>
                </select>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded-lg bg-green-500 text-white"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ManageUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<"All" | User["role"]>("All");
    const [sortKey, setSortKey] = useState<keyof User>("name");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers() as User[];
                const userData = Array.isArray(response)
                    ? response
                    : Array.isArray(response)
                        ? response
                        : [];
                setUsers(userData);
            } catch (err) {
                console.error("Failed to fetch users:", err);
                setUsers([]);
            }
        };
        fetchUsers();
    }, []);

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
                u.name?.toLowerCase().includes(search.toLowerCase()) ||
                u.email?.toLowerCase().includes(search.toLowerCase());
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

    const handleSave = async (updatedUser: User) => {
        try {
            await updateUserInformation(updatedUser.uuid, updatedUser);
            setUsers(users.map((u) => (u.uuid === updatedUser.uuid ? updatedUser : u)));
            setSelectedUser(null);
        } catch (err) {
            console.error("Failed to update user:", err);
        }
    };

    const handleCreate = async (newUser: Omit<User, "uuid">) => {
        try {
            const created = await createUser(newUser);
            setUsers([...users, created]);
            setShowCreateModal(false);
        } catch (err) {
            console.error("Failed to create user:", err);
        }
    };

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
                            setRoleFilter(e.target.value as "All" | User["role"])
                        }
                        className="border px-3 py-1 rounded-lg"
                    >
                        <option value="All">All Roles</option>
                        <option value="admin">Admins</option>
                        <option value="founder">Founders</option>
                        <option value="investor">Investors</option>
                    </select>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                        + Create User
                    </button>
                </div>
            </div>

            <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 border cursor-pointer" onClick={() => handleSort("name")}>
                        Name{arrow("name")}
                    </th>
                    <th className="p-2 border cursor-pointer" onClick={() => handleSort("email")}>
                        Email{arrow("email")}
                    </th>
                    <th className="p-2 border cursor-pointer" onClick={() => handleSort("role")}>
                        Role{arrow("role")}
                    </th>
                </tr>
                </thead>
                <tbody>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                        <tr
                            key={u.uuid}
                            className="border-t hover:bg-gray-50 cursor-pointer"
                            onClick={() => setSelectedUser(u)}
                        >
                            <td className="p-2 border">{u.name}</td>
                            <td className="p-2 border">{u.email}</td>
                            <td className="p-2 border">{u.role}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={3} className="p-4 text-center text-gray-500">
                            No users found
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {selectedUser && (
                <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} onSave={handleSave} />
            )}
            {selectedUser && (
                <UserModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onSave={handleSave}
                />
            )}

            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreate}
                />
            )}
        </div>
    );
}

function UserModal({ user, onClose, onSave }: { user: User; onClose: () => void; onSave: (user: User) => void; }) {
    const profilePicDefault = "data:image/png;base64,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";

    const [edited, setEdited] = useState<User>(user);
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [loadingPic, setLoadingPic] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        (async () => {
            setLoadingPic(true);
            const pic = await getUserProfilePicture(user.uuid);
            setProfilePic(pic || profilePicDefault);
            setLoadingPic(false);
        })();
    }, [user.uuid]);

    const handleResetProfilePic = async () => {
        try {
            await userDeleteProfilePicture(user.uuid);
            setProfilePic(profilePicDefault);
        } catch (err) {
            console.error("Failed to reset profile picture:", err);
            setShowErrorModal(true);
        }
    };

    const handleProfilePicChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
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

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h3 className="text-lg font-semibold mb-4">Edit User</h3>

                <div className="flex flex-col items-center mb-4">
                    {loadingPic ? (
                        <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse mb-2" />
                    ) : (
                        <img
                            src={profilePic || profilePicDefault}
                            alt="Profile"
                            className="w-20 h-20 rounded-full mb-2 object-cover"
                        />
                    )}
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
                        accept="image/png"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleProfilePicChange}
                    />
                </div>

                {/* Editable fields */}
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
                    <option value="admin">Admin</option>
                    <option value="founder">Founder</option>
                    <option value="investor">Investor</option>
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

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Upload Error
                        </h2>
                        <p className="text-gray-600 mb-6">Only PNG files are allowed!</p>
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
}

function ManageProjects() {
    const [projects, setProjects] = useState<ProjectDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const fetchedProjects = await getProjects();
            if (fetchedProjects) {
                setProjects(fetchedProjects);
            } else {
                setError("Failed to load projects");
            }
        } catch (err) {
            setError("An error occurred while loading projects");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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

    const handleProjectUpdate = async (updatedProject: ProjectDetail) => {
        try {
            await updateProject(updatedProject.uuid, updatedProject);
            setProjects(projects.map((p) =>
                p.uuid === updatedProject.uuid ? updatedProject : p
            ));
            setSelectedProject(null);
        } catch (err) {
            console.error("Failed to update project:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading projects...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="text-red-500 text-lg mb-4">{error}</div>
                <button
                    onClick={loadProjects}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage Startups</h2>
                <input
                    type="text"
                    placeholder="Search startups..."
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
                    <th className="p-2 border">Sector</th>
                    <th className="p-2 border">Maturity</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Description</th>
                </tr>
                </thead>
                <tbody>
                {filteredProjects.map((p) => (
                    <tr
                        key={p.uuid}
                        className="border-t hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedProject(p)}
                    >
                        <td className="p-2 border font-medium">{p.name}</td>
                        <td className="p-2 border">{p.sector || "-"}</td>
                        <td className="p-2 border">{p.maturity || "-"}</td>
                        <td className="p-2 border">{p.project_status || "-"}</td>
                        <td className="p-2 border">{p.description || "-"}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {filteredProjects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No projects found matching your search.
                </div>
            )}

            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                    onSave={handleProjectUpdate}
                />
            )}
        </div>
    );
}

export function ProjectModal({
                          project,
                          onClose,
                          onSave,
                      }: {
    project: ProjectDetail;
    onClose: () => void;
    onSave: (project: ProjectDetail) => void;
}) {
    const [edited, setEdited] = useState<ProjectDetail>(project);
    const [saving, setSaving] = useState(false);
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

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(edited);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Edit Startup</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Startup Name *
                        </label>
                        <input
                            type="text"
                            value={edited.name}
                            onChange={(e) => setEdited({ ...edited, name: e.target.value })}
                            className="border rounded px-3 py-2 w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            value={edited.email}
                            onChange={(e) => setEdited({ ...edited, email: e.target.value })}
                            className="border rounded px-3 py-2 w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sector
                        </label>
                        <input
                            type="text"
                            value={edited.sector || ""}
                            onChange={(e) => setEdited({ ...edited, sector: e.target.value })}
                            className="border rounded px-3 py-2 w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                        </label>
                        <input
                            type="tel"
                            value={edited.phone || ""}
                            onChange={(e) => setEdited({ ...edited, phone: e.target.value })}
                            className="border rounded px-3 py-2 w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Legal Status
                        </label>
                        <select
                            value={edited.legal_status || ""}
                            onChange={(e) => setEdited({ ...edited, legal_status: e.target.value })}
                            className="border rounded px-3 py-2 w-full"
                        >
                            <option value="">Select Status</option>
                            <option value="SpA">SpA</option>
                            <option value="SAS">SAS</option>
                            <option value="LLC">LLC</option>
                            <option value="Corp">Corporation</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Maturity
                        </label>
                        <select
                            value={edited.maturity || ""}
                            onChange={(e) => setEdited({ ...edited, maturity: e.target.value })}
                            className="border rounded px-3 py-2 w-full"
                        >
                            <option value="">Select Maturity</option>
                            <option value="Idea">Idea</option>
                            <option value="Prototype">Prototype</option>
                            <option value="MVP">MVP</option>
                            <option value="Growth">Growth</option>
                            <option value="Scale">Scale</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project Status
                        </label>
                        <select
                            value={edited.project_status || ""}
                            onChange={(e) => setEdited({ ...edited, project_status: e.target.value })}
                            className="border rounded px-3 py-2 w-full"
                        >
                            <option value="">Select Status</option>
                            <option value="Active">Active</option>
                            <option value="Growth">Growth</option>
                            <option value="Paused">Paused</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Website URL
                        </label>
                        <input
                            type="url"
                            value={edited.website_url || ""}
                            onChange={(e) => setEdited({ ...edited, website_url: e.target.value })}
                            className="border rounded px-3 py-2 w-full"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                    </label>
                    <input
                        type="text"
                        value={edited.address || ""}
                        onChange={(e) => setEdited({ ...edited, address: e.target.value })}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Social Media URL
                    </label>
                    <input
                        type="url"
                        value={edited.social_media_url || ""}
                        onChange={(e) => setEdited({ ...edited, social_media_url: e.target.value })}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="https://..."
                    />
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        value={edited.description || ""}
                        onChange={(e) => setEdited({ ...edited, description: e.target.value })}
                        className="border rounded px-3 py-2 w-full h-24"
                        placeholder="Describe your project..."
                    />
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Needs
                    </label>
                    <textarea
                        value={edited.needs || ""}
                        onChange={(e) => setEdited({ ...edited, needs: e.target.value })}
                        className="border rounded px-3 py-2 w-full h-20"
                        placeholder="What does your project need right now?"
                    />
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Startup Image
                    </label>
                    <div className="flex flex-col items-center">
                        {edited.image && (
                            <img
                                src={edited.image}
                                alt="Preview"
                                className="w-full h-32 object-cover rounded mb-2"
                            />
                        )}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg"
                        >
                            {edited.image ? "Change Startup Image" : "Add Startup Image"}
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save"}
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
