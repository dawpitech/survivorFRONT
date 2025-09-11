"use client";

import {useState, useRef, useEffect, useMemo} from "react";
import "../globals.css";
import {
    getAllUsers,
    User,
    updateUserInformation,
    getUserProfilePicture,
    getUserInformation,
    updateUserPicture,
    userDeleteProfilePicture,
    createUser,
    getFounderInfos,
    FounderDetail,
    getInvestorsInfos,
    updateInvestorsInfos,
    Investor,
} from "@/lib/user";

import {getProjects, ProjectDetail, updatePitchDeck, updateProject} from "@/lib/projects";
import {createEvent, editEvent, Events, fetchEvents} from "@/lib/events";
import {createNews, editNews, fetchNews, getNewsPicture, News, updateNewsPicture} from "@/lib/news";
import {ChatMessage, ChatRoom, createRoom, fetchRoomMessages, fetchRooms, sendMessage} from "@/lib/chat";

type Page = "projects" | "users" | "messages" | "my-startup" | "investor-infos" | "events" | "news" | "stats";

const __prefetchUserInfo = (async () => {
    try {
        const user = await getUserInformation();
        if (user === "" || !user) {
            window.location.href = "/";
        }
        return user;
    } catch {
        window.location.href = "/";
        return "";
    }
})();

export default function DashboardPage() {
    const [activePage, setActivePage] = useState<Page>("messages");
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUser() {
            const user = await __prefetchUserInfo;
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
                                <SidebarButton page="events" activePage={activePage} setActivePage={setActivePage}>
                                    Manage Events
                                </SidebarButton>
                                <SidebarButton page="news" activePage={activePage} setActivePage={setActivePage}>
                                    Manage News
                                </SidebarButton>
                                <SidebarButton page="stats" activePage={activePage} setActivePage={setActivePage}>
                                    Statistics
                                </SidebarButton>
                            </>
                        )}
                        {userRole === "founder" && (
                            <>
                                <SidebarButton page="my-startup" activePage={activePage} setActivePage={setActivePage}>
                                    My Startup
                                </SidebarButton>
                                <SidebarButton page="news" activePage={activePage} setActivePage={setActivePage}>
                                    Manage News
                                </SidebarButton>
                            </>
                        )}
                        {userRole === "investor" && (
                            <SidebarButton page="investor-infos" activePage={activePage} setActivePage={setActivePage}>
                                Your Informations
                            </SidebarButton>
                        )}

                        <SidebarButton page="messages" activePage={activePage} setActivePage={setActivePage}>
                            Messages
                        </SidebarButton>
                    </nav>
                </aside>

                <section className="flex-1 p-6">
                    {activePage === "projects" && <ManageProjects />}
                    {activePage === "users" && <ManageUsers />}
                    {activePage === "news" && <ManageNews />}
                    {activePage === "events" && <ManageEvents />}
                    {activePage === "messages" && <MessagesPage />}
                    {activePage === "my-startup" && <MyStartupPage />}
                    {activePage === "investor-infos" && <InvestorInfosPage />}
                    {activePage === "stats" && <StatisticsPage />}
                </section>
            </main>
        </>
    );
}

function CreateNewsModal({
                             onClose,
                             onCreate,
                         }: {
    onClose: () => void;
    onCreate: (form: Omit<News, 'uuid' | 'picture'>, pictureFile: File) => void;
}) {
    const [form, setForm] = useState<Omit<News, 'uuid' | 'picture'>>({
        title: "",
        location: "",
        category: "",
        startup_uuid: "",
        description: "",
    });
    const [pictureFile, setPictureFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [startups, setStartups] = useState<ProjectDetail[]>([]);
    const [userRole, setUserRole] = useState<"admin" | "founder" | "investor" | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getUserInformation();
                if (user === "") return;
                setUserRole(user.role);

                if (user.role === "admin") {
                    const projects = await getProjects() as ProjectDetail[];
                    setStartups(projects || []);
                } else if (user.role === "founder") {
                    const founder = await getFounderInfos(user.founder_uuid || "");
                    if (Array.isArray(founder))
                        return;
                    if (founder.startup.uuid) {
                        setForm(prev => ({ ...prev, startup_uuid: founder.startup.uuid }));
                        setStartups([founder.startup]);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];

            if (file.type !== "image/png") {
                alert("Only PNG files are allowed.");
                e.target.value = ""; // reset input
                return;
            }

            setPictureFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        if (!form.title || !form.category || !form.startup_uuid || !pictureFile) {
            alert("Please fill in all required fields (Title, Category, Startup, Picture)");
            return;
        }
        onCreate(form, pictureFile);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h3 className="text-lg font-semibold mb-4">Create News</h3>

                {/* Picture */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Picture (PNG only) *</label>
                <div className="flex flex-col items-center mb-4">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded mb-2"
                        />
                    ) : (
                        <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center text-gray-500">
                            No picture selected
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg"
                    >
                        {preview ? "Change Picture" : "Add Picture"}
                    </button>
                    <input
                        type="file"
                        accept="image/png"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handlePictureChange}
                    />
                </div>

                {/* Title */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="border rounded px-3 py-2 w-full mb-4"
                />

                {/* Category */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="border rounded px-3 py-2 w-full mb-4"
                />

                {/* Location */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="border rounded px-3 py-2 w-full mb-4"
                />

                {/* Startup Selection */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Startup *</label>
                {userRole === "founder" ? (
                    <input
                        type="text"
                        value={startups[0]?.name || ""}
                        disabled
                        className="border rounded px-3 py-2 w-full mb-4 bg-gray-100"
                    />
                ) : (
                    <select
                        value={form.startup_uuid}
                        onChange={(e) => setForm({ ...form, startup_uuid: e.target.value })}
                        className="border rounded px-3 py-2 w-full mb-4"
                        disabled={userRole !== "admin"}
                    >
                        <option value="">Select a startup</option>
                        {startups.map((startup) => (
                            <option key={startup.uuid} value={startup.uuid}>
                                {startup.name}
                            </option>
                        ))}
                    </select>
                )}

                {/* Description */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="border rounded px-3 py-2 w-full mb-4 h-24"
                />

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ManageNews() {
    const [news, setNews] = useState<News[]>([]);
    const [pictures, setPictures] = useState<Record<string, string>>({});
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<keyof News>("title");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [selectedNews, setSelectedNews] = useState<News | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [userRole, setUserRole] = useState<"admin" | "founder" | "investor" | null>(null);
    const [userStartupUuid, setUserStartupUuid] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getUserInformation();
                if (user === "") return;
                setUserRole(user.role);

                const allNews = await fetchNews();
                let filteredNews = allNews;
                if (user.role === "founder") {
                    const founder = await getFounderInfos(user.founder_uuid || "");
                    if (!Array.isArray(founder) && founder.startup) {
                        setUserStartupUuid(founder.startup.uuid);
                    }
                    if (Array.isArray(founder)) {
                        return;
                    }
                    filteredNews = user.role === "founder"
                        ? allNews.filter(n => n.startup_uuid === founder.startup.uuid)
                        : allNews;
                }

                setNews(filteredNews);
                const pics: Record<string, string> = {};
                await Promise.all(filteredNews.map(async (n) => {
                    const pic = await getNewsPicture(n.uuid);
                    if (pic) {
                        pics[n.uuid] = pic;
                    }
                }));
                setPictures(pics);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleSort = (key: keyof News) => {
        if (sortKey === key) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    const sortedNews = news
        .filter((n) => n.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            const v1 = (a[sortKey] || "").toString();
            const v2 = (b[sortKey] || "").toString();
            if (v1 < v2) return sortDir === "asc" ? -1 : 1;
            if (v1 > v2) return sortDir === "asc" ? 1 : -1;
            return 0;
        });

    const handleCreate = async (
        form: Omit<News, "uuid" | "picture">,
        pictureFile: File
    ) => {
        try {
            const newNews = await createNews({
                title: form.title,
                startup_uuid: form.startup_uuid,
            });

            const created = await editNews(newNews.uuid, {
                category: form.category,
                description: form.description,
                location: form.location,
            });

            await updateNewsPicture(newNews.uuid, pictureFile);
            const pic = await getNewsPicture(newNews.uuid);

            console.log("News successfully created:", newNews.uuid);

            // Only add to news list if it matches the founder's startup_uuid
            if (userRole !== "founder" || newNews.startup_uuid === userStartupUuid) {
                setNews((prev) => [...prev, created]);
                setPictures((prev) => ({
                    ...prev,
                    [newNews.uuid]: pic,
                }));
            }

            setShowCreateModal(false);
            return newNews.uuid;
        } catch (error) {
            console.error("Failed to create news:", error);
            throw error;
        }
    };

    const handleNewsUpdate = async (updatedNews: News) => {
        try {
            const updated = await editNews(updatedNews.uuid, updatedNews);
            // Only update news list if it matches the founder's startup_uuid
            if (userRole !== "founder" || updated.startup_uuid === userStartupUuid) {
                setNews(news.map((n) => (n.uuid === updated.uuid ? updated : n)));
            } else {
                // If the updated news no longer matches the founder's startup, remove it
                setNews(news.filter((n) => n.uuid !== updated.uuid));
            }
            setSelectedNews(null);
        } catch (err) {
            console.error("Failed to update news:", err);
        }
    };

    const handlePictureUpdate = (uuid: string, newPicture: string) => {
        setPictures({ ...pictures, [uuid]: newPicture });
    };

    const truncateDescription = (description: string) => {
        return description.length > 32 ? description.substring(0, 150) + "..." : description;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage News</h2>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Search news..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded-lg"
                    />
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                        + Create News
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedNews.map((newsItem) => (
                    <div key={newsItem.uuid} className="border rounded-lg p-4 shadow bg-white">
                        {pictures[newsItem.uuid] ? (
                            <img
                                src={pictures[newsItem.uuid]}
                                alt="News"
                                className="w-full h-32 object-cover rounded mb-2"
                            />
                        ) : (
                            <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center text-gray-500">
                                No picture
                            </div>
                        )}
                        <h3 className="font-semibold">{newsItem.title}</h3>
                        <p className="text-sm text-gray-500">{newsItem.category}</p>
                        <p className="text-sm">{newsItem.location}</p>
                        <p className="text-sm">{truncateDescription(newsItem.description)}</p>
                        <button
                            onClick={() => setSelectedNews(newsItem)}
                            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg"
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>

            {selectedNews && (
                <EditNewsModal
                    news={selectedNews}
                    currentPicture={pictures[selectedNews.uuid]}
                    onClose={() => setSelectedNews(null)}
                    onSave={handleNewsUpdate}
                    onPictureUpdate={handlePictureUpdate}
                />
            )}

            {showCreateModal && (
                <CreateNewsModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreate}
                />
            )}
        </div>
    );
}

function EditNewsModal({
                           news,
                           currentPicture,
                           onClose,
                           onSave,
                           onPictureUpdate,
                       }: {
    news: News;
    currentPicture?: string;
    onClose: () => void;
    onSave: (news: News) => void;
    onPictureUpdate: (uuid: string, newPicture: string) => void;
}) {
    const [edited, setEdited] = useState<News>(news);
    const [saving, setSaving] = useState(false);
    const [picture, setPicture] = useState<string | null>(currentPicture || null);
    const [loadingPicture, setLoadingPicture] = useState(false);
    const [startups, setStartups] = useState<ProjectDetail[]>([]);
    const [userRole, setUserRole] = useState<"admin" | "founder" | "investor" | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getUserInformation();
                if (user === "") return;
                setUserRole(user.role);

                if (user.role === "admin") {
                    const projects = await getProjects() as ProjectDetail[];
                    setStartups(projects || []);
                } else if (user.role === "founder") {
                    const founder = await getFounderInfos(user.founder_uuid || "");
                    if (!Array.isArray(founder) && founder.startup) {
                        setStartups([founder.startup]);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        if (!edited.title || !edited.category || !edited.startup_uuid) {
            alert("Please fill in all required fields (Title, Category, Startup)");
            return;
        }
        setSaving(true);
        await onSave(edited);
        setSaving(false);
    };

    useEffect(() => {
        if (!currentPicture && news.uuid) {
            setLoadingPicture(true);
            getNewsPicture(news.uuid).then((pic) => {
                setPicture(pic);
                setLoadingPicture(false);
            });
        }
    }, [news.uuid, currentPicture]);

    const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!news.uuid || !e.target.files?.[0]) return;

        const file = e.target.files[0];

        try {
            await updateNewsPicture(news.uuid, file);
            const objectUrl = URL.createObjectURL(file);
            setPicture(objectUrl);
            onPictureUpdate(news.uuid, objectUrl);
        } catch (err) {
            console.error("Failed to update news picture:", err);
            alert("Failed to update picture. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Edit News</h3>

                {/* Picture */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Picture (PNG only)</label>
                <div className="flex flex-col items-center mb-4">
                    {loadingPicture ? (
                        <div className="w-full h-32 bg-gray-200 rounded animate-pulse mb-2 flex items-center justify-center">
                            Loading...
                        </div>
                    ) : picture ? (
                        <img
                            src={picture}
                            alt="News"
                            className="w-full h-32 object-cover rounded mb-2"
                        />
                    ) : (
                        <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center text-gray-500">
                            No picture
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg"
                    >
                        {picture ? "Change Picture" : "Add Picture"}
                    </button>
                    <input
                        type="file"
                        accept="image/png"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handlePictureChange}
                    />
                </div>

                {/* Title */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                    type="text"
                    value={edited.title}
                    onChange={(e) => setEdited({ ...edited, title: e.target.value })}
                    className="border rounded px-3 py-2 w-full mb-4"
                />

                {/* Category */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input
                    type="text"
                    value={edited.category || ""}
                    onChange={(e) => setEdited({ ...edited, category: e.target.value })}
                    className="border rounded px-3 py-2 w-full mb-4"
                />

                {/* Location */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                    type="text"
                    value={edited.location || ""}
                    onChange={(e) => setEdited({ ...edited, location: e.target.value })}
                    className="border rounded px-3 py-2 w-full mb-4"
                />

                {/* Startup Selection */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Startup *</label>
                {userRole === "founder" ? (
                    <input
                        type="text"
                        value={startups[0]?.name || ""}
                        disabled
                        className="border rounded px-3 py-2 w-full mb-4 bg-gray-100"
                    />
                ) : (
                    <select
                        value={edited.startup_uuid}
                        onChange={(e) => setEdited({ ...edited, startup_uuid: e.target.value })}
                        className="border rounded px-3 py-2 w-full mb-4"
                        disabled={userRole !== "admin"}
                    >
                        <option value="">Select a startup</option>
                        {startups.map((startup) => (
                            <option key={startup.uuid} value={startup.uuid}>
                                {startup.name}
                            </option>
                        ))}
                    </select>
                )}

                {/*-log Description */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    value={edited.description || ""}
                    onChange={(e) => setEdited({ ...edited, description: e.target.value })}
                    className="border rounded px-3 py-2 w-full mb-4 h-24"
                />

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function CreateEventModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (event: Events) => void;
}) {
  const [form, setForm] = useState<Events>({
    uuid: "",
    name: "",
    date: "",
    location: "",
    description: "",
    event_type: "",
    target_audience: "",
  });

  const handleSubmit = () => {
    if (!form.name || !form.date || !form.location) {
      alert("Please fill in all required fields (Name, Date, Location)");
      return;
    }
    onCreate(form);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">Create Event</h3>

        {/* Event Name */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Name *
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded px-3 py-2 w-full mb-4"
        />

        {/* Date */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date *
        </label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border rounded px-3 py-2 w-full mb-4"
        />

        {/* Location */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location *
        </label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="border rounded px-3 py-2 w-full mb-4"
        />

        {/* Event Type */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Type
        </label>
        <input
          type="text"
          value={form.event_type}
          onChange={(e) => setForm({ ...form, event_type: e.target.value })}
          className="border rounded px-3 py-2 w-full mb-4"
        />

        {/* Target Audience */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Audience
        </label>
        <input
          type="text"
          value={form.target_audience}
          onChange={(e) =>
            setForm({ ...form, target_audience: e.target.value })
          }
          className="border rounded px-3 py-2 w-full mb-4"
        />

        {/* Description */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border rounded px-3 py-2 w-full mb-4 h-24"
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export function ManageEvents() {
  const [events, setEvents] = useState<Events[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof Events>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedEvent, setSelectedEvent] = useState<Events | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      const allEvents = await fetchEvents();
      setEvents(allEvents);
    };
    fetchAll();
  }, []);

  const handleSort = (key: keyof Events) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedEvents = events
    .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const v1 = (a[sortKey] || "").toString();
      const v2 = (b[sortKey] || "").toString();
      if (v1 < v2) return sortDir === "asc" ? -1 : 1;
      if (v1 > v2) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const handleCreate = async (newEvent: Events) => {
    try {
      const created = await createEvent(newEvent);
      setEvents([...events, created]);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create event:", err);
    }
  };

  const handleEventUpdate = async (updatedEvent: Events) => {
    try {
      const updated = await editEvent(updatedEvent.uuid, updatedEvent);
      setEvents(events.map((e) => (e.uuid === updated.uuid ? updated : e)));
      setSelectedEvent(null);
    } catch (err) {
      console.error("Failed to update event:", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Events</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-1 rounded-lg"
          />
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            + Create Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedEvents.map((event) => (
          <div
            key={event.uuid}
            className="border rounded-lg p-4 shadow bg-white"
          >
            <h3 className="font-semibold">{event.name}</h3>
            <p className="text-sm text-gray-500">{event.date}</p>
            <p className="text-sm">{event.location}</p>
            <p className="text-sm">{event.description}</p>
            <button
              onClick={() => setSelectedEvent(event)}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <EditEventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={handleEventUpdate}
        />
      )}

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

function EditEventModal({
  event,
  onClose,
  onSave,
}: {
  event: Events;
  onClose: () => void;
  onSave: (event: Events) => void;
}) {
  const [edited, setEdited] = useState<Events>(event);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(edited);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">Edit Event</h3>

        {/* Name */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Name *
        </label>
        <input
          type="text"
          value={edited.name}
          onChange={(e) => setEdited({ ...edited, name: e.target.value })}
          className="border rounded px-3 py-2 w-full mb-4"
        />

        {/* Date */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          value={edited.date || ""}
          onChange={(e) => setEdited({ ...edited, date: e.target.value })}
          className="border rounded px-3 py-2 w-full mb-4"
        />

        {/* Location */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          value={edited.location || ""}
          onChange={(e) => setEdited({ ...edited, location: e.target.value })}
          className="border rounded px-3 py-2 w-full mb-4"
        />

        {/* Event Type */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Type
        </label>
        <input
          type="text"
          value={edited.event_type || ""}
          onChange={(e) => setEdited({ ...edited, event_type: e.target.value })}
          className="border rounded px-3 py-2 w-full mb-4"
        />

        {/* Target Audience */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Audience
        </label>
        <input
          type="text"
          value={edited.target_audience || ""}
          onChange={(e) =>
            setEdited({ ...edited, target_audience: e.target.value })
          }
          className="border rounded px-3 py-2 w-full mb-4"
        />

        {/* Description */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={edited.description || ""}
          onChange={(e) =>
            setEdited({ ...edited, description: e.target.value })
          }
          className="border rounded px-3 py-2 w-full mb-4 h-24"
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
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
      await updateInvestorsInfos(
        investor_uuid,
        edited as Partial<typeof edited>,
      );
      setInvestor(edited);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update investor infos:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!investor)
    return <div className="p-6">No investor information found.</div>;

  const renderField = (
    label: string,
    key: keyof Investor,
    type: "text" | "email" | "tel" | "textarea" = "text",
  ) => {
    if (!edited) return null;

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
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
        prev ? { ...prev, startup: { ...updatedStartup } } : prev,
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setSelectedStartup(null);
    } catch (err) {
      console.error("Failed to update startup:", err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!founder?.startup)
    return <div className="p-6">No startup linked to your account.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Startup</h2>

      <div className="border p-6 rounded-xl shadow-lg bg-white">
        <div className="flex justify-between items-start">
          <div>
              <h3 className="text-2xl font-semibold mb-2">
                  {founder.startup.name}
              </h3>
              <p className="text-gray-700 mb-3">
                  👀 {founder.startup.views_count ?? 0} views
              </p>
              <p className="text-gray-700 mb-4">{founder.startup.description}</p>
            <h3 className="text-2xl font-semibold mb-2">
              {founder.startup.name}
            </h3>
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
            <p>
              <span className="font-medium">Sector:</span>{" "}
              {founder.startup.sector}
            </p>
            <p>
              <span className="font-medium">Maturity:</span>{" "}
              {founder.startup.maturity}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              {founder.startup.project_status}
            </p>
            <p>
              <span className="font-medium">Legal Status:</span>{" "}
              {founder.startup.legal_status}
            </p>
          </div>

          <div>
            <p>
              <span className="font-medium">Address:</span>{" "}
              {founder.startup.address}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {founder.startup.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {founder.startup.phone}
            </p>
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
        const response = (await getAllUsers()) as User[];
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
      setUsers(
        users.map((u) => (u.uuid === updatedUser.uuid ? updatedUser : u)),
      );
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
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleSave}
        />
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

function UserModal({
  user,
  onClose,
  onSave,
}: {
  user: User;
  onClose: () => void;
  onSave: (user: User) => void;
}) {
  const profilePicDefault =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAclBMVEX///8ZdtIAb9AAbdAAa88AcNASdNEAac8Oc9HH2vKzzO3Q4PTl7vnz+P2Tt+arxuvq8vq/1PCjwen1+f2Ns+WCrOJYlNvB1fDh6/hQj9mvyewuf9XL3PPZ5vZ+qOGFruOWuudIithrn946hddimt1wot8vY3ldAAAHMUlEQVR4nO2dCXbqMAxFG09xGcqQQAmhlDDsf4s/acqnA0McLD3Tk7uCvGNHkmVJfnrq6Ojo6OgIguRtMkrX+2wXGStslO+y/fp90+sP0R/mg/70kOVSSaG1tdYYE5kKa7UWUkXFetRHf2J7kue0iKUodUWXMKbUGe9mkwT9se4MR3MhxWVt33RqKebTMfqTnZhksbiydGdEWhHPJ+jPbso4jaR1UHfESjMboD++AYut0i6r920ltZqHbngGW9Vm+b4spMre0CKukMxabc+fGg/B+sme1Xfrq9ByipZyluFctf3/fmJkEaDvePWwQU9Y1UML+sm7twX8RK3Rkr6RFMKvvhKxC8jgDHKfO/SIjRZoYUcWlkJgFQAE4hoXDQPsFhJlEBHOQtCs4IdEFcAqjp3OEM4SNTwWT0iMzBeJOfpwXNAKLC1qgRU48+8HfyJmSIE9RS6wjG6AZ/+xpLQyR4zABTfkP2GNzVACp5JFYBTJEUYgzx6tQO3TOc8erbB7hMBnDjt6JEYEqDnXHq0wO36BPS4zUyNf2RVGnEuIWETmJSwjm2dmhTveJeR3+ytOQ1rDfBhm9IVH9IFT4DhmF1j6RM6z8IufCwo3BGd0yurtj3A6jD6/nalQfFmpNWKTlrZmw6aQNIF4Gb5tuuKOZ46wbdOUPsF2HjZryh6xHeE6CI8xljSq6op4FPZQm5QtNgX5igrBU6RBfBdzDZ4fcYzyFVFVrcmh8BmokMcjbnC/YRRJjluaPe43LEPTFwaFQEPDZGpg/v5DYU4v8A2qMJL0Cie4iKaCwZhCTWm5hityhcCYrUIsyRVmSFPK4i6gzqI0pvRlp8x3Tr8UzqkFDrG/IUM2CnfA/1QYUSscoBVq6rKMBVhhJKn7FPrI02EFeVADPf9WSOpkFDgsLRVSV9YAU4mfCqkrFv6+wiVcIXXpEF4hdS6qU0iv8O/v0r9vS6nTGHiF1B4fHtOQXyHC41LyyBt+thDUpyf4+ZD8BIy8H62gz2IMwZbG0F/NGGw20dC3I0IKL08wXCAWWIX6nVwh9JKbpaLmHXz3RF+qMMUaU/JU29PT65+/A4aU6Z8Q9HNrwJaG4YYU0C3zTWH61xUKeoXoXbohV/j3azHAtpQ81QZPJyr62VHgNIYiF4hpPfwPR20i9ghstwwKoQ6RpX0N1vVUwVCa+PQ0QZoaliEn0H4Lng5EYHUiQ9xdAcxjME0ZhLWQsnXnodqAS2/INVbhgPoRGcLuGtQ2ZduksEpoJktascGENYwzFZLWk/Pvgc3OVLwgFjFmnWJONjr4MsxTPifs1/kMl7/fWTN7DMuQoPnBvQ9ZuKEtYCh0j/GMYQ+QecmvfBtVgqbQskXg9O1cF2DL2LB04Z+DqweKvg7qIkyJRZYxA+dhmmqGsjMVLPOUNPI9FpYRmAr6bhDDzHLoEpZ/Iv1NlAI//0BuTgXOkNYMiEM3oC88QpyzUfxTrn9BWlILi0i/Qjmwhr43vRGEaak4kKdJyZwi7/jnKwyJ0qcshRfNoAnejIC/ZnViSiEx5p6kfxWC5KICPS5zia1vg6r4LpoasvcrUdF3jjjjVWJ4K1ix9/cvKvSB4gKpJ4tqQjMyJ6axD9dv2B9ccWDl4c1VnQfzhOw5htmdP6NRHBWkdzG969bNyuBeq/7NoGj94pyRWYAvjp9hJFq5RiPsAyxgTbJusVUFQ8OPRxaH2OnQaHQ8e4wNemI8040fey73ZxpEQsaRZJSrBiKtVjv6ZiYq3tL8ltEReRq0h7/NjcnKjO//UDG6vohML1aQMOi/Ljfv21uXqDYq9rNNrx9Q1ukW4/7yZVtESkkptL5dkWKM1VpIJfL5bLQKW+iwP11nthJm27R/WfshdLfuhWh6ktXLPq+1uUv7saRaKJOlk4ACgPFkncfyfm1fZVotY3voBaAyeV2Xbp0mq2+sULuUo1ntIuPRXJVrR6Huv0otxbaHiejG00I2DjzvwkqRLdlF9uZNQk5/IoXac14lvq21ZG8MstKmTM5yUihIu0X5T6o9Q3feMudfvhNWFcS51FGE1Fdr3BHWn/Si1lk0jxi1I9qrb+2zhJ4xak8R7KQxeH9+xaqNb339m9kIZkTut8UkqAWsMT4vUZMssAWsEYWvv3ERBbeANVb4MaorFYgJ/Y1RPhKtk3AFlniwqRMvF9d0qHs7S1fQmUlNkPcV3ixCCWOuoO7KKYMfWWuGuuNsvAc/stYMI1ufjJfo+esNsW0nDyUP8BPWtO06OTzEHv0gbrVPqbthfNKuLeOBlrC0py0i1OGDmJkam7krBM/tdqXFUAmWBlh/uM8fQr/G6Yr76JMbBQbh4fyG0DbQc/1FnIs6HiLm/orr7Fb0w8buuP6IiwcKaGqMduv5hj9c5Y7jQ8GM03V84ejz4c+rueM42/QRFbrdnXYKA6RT2CkMH1eFsXg0wmr97ujo6Oh4LP4B+FuXglB7zfUAAAAASUVORK5CYII=";

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
    e: React.ChangeEvent<HTMLInputElement>,
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
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300"
          >
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
  const [sortKey, setSortKey] = useState<"name" | "views_count">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(
    null,
  );

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
        if (sortKey === "name") {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey("name");
            setSortDir("asc");
        }
    };

    const handleViewSort = () => {
        if (sortKey === "views_count") {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey("views_count");
            setSortDir("desc"); // Default to descending for view count (highest first)
        }
    };

    const filteredProjects = projects
        .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortKey === "name") {
                if (a.name < b.name) return sortDir === "asc" ? -1 : 1;
                if (a.name > b.name) return sortDir === "asc" ? 1 : -1;
                return 0;
            } else if (sortKey === "views_count") {
                const aViews = a.views_count || 0;
                const bViews = b.views_count || 0;
                return sortDir === "asc" ? aViews - bViews : bViews - aViews;
            }
            return 0;
        });

  const handleProjectUpdate = async (updatedProject: ProjectDetail) => {
    try {
      await updateProject(updatedProject.uuid, updatedProject);
      setProjects(
        projects.map((p) =>
          p.uuid === updatedProject.uuid ? updatedProject : p,
        ),
      );
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
            <th className="p-2 border cursor-pointer" onClick={handleSort}>
              Name {sortDir === "asc" ? "↑" : "↓"}
            </th>
              <th className="p-2 border cursor-pointer" onClick={handleViewSort}>
                  Views {sortDir === "asc" ? "↑" : "↓"}
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
                <td className="p-2 border font-medium">{p.views_count?.toString()}</td>
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
  const pitchDeckInputRef = useRef<HTMLInputElement>(null);

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
              onChange={(e) =>
                setEdited({ ...edited, legal_status: e.target.value })
              }
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
              onChange={(e) =>
                setEdited({ ...edited, maturity: e.target.value })
              }
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
              onChange={(e) =>
                setEdited({ ...edited, project_status: e.target.value })
              }
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
              onChange={(e) =>
                setEdited({ ...edited, website_url: e.target.value })
              }
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
            onChange={(e) =>
              setEdited({ ...edited, social_media_url: e.target.value })
            }
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
            onChange={(e) =>
              setEdited({ ...edited, description: e.target.value })
            }
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

            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pitch Deck (PDF)
                </label>
                <div className="flex flex-col items-center gap-2">
                    <button
                        onClick={() => pitchDeckInputRef.current?.click()}
                        className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg"
                    >
                        Upload / Overwrite Pitch Deck
                    </button>
                    <input
                        type="file"
                        accept="application/pdf"
                        ref={pitchDeckInputRef}
                        className="hidden"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                                await updatePitchDeck(edited.uuid, file);
                                alert("✅ Pitch deck updated successfully!");
                            } catch {
                                alert("❌ Failed to update pitch deck. Make sure it is a PDF file.");
                            }
                        }}
                    />
                </div>
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

type RecipientOption = {
    user: User;
    label: string;
};

function useUsersDirectory() {
    const [users, setUsers] = useState<User[]>([]);
    const [usersById, setUsersById] = useState<Record<string, User>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const all = (await getAllUsers()) || [];
                setUsers(all);
                const map: Record<string, User> = {};
                for (const u of all) map[u.uuid] = u;
                setUsersById(map);
            } catch (e) {
                console.error("Failed to load users directory:", e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return { users, usersById, loading };
}

function NewConversationModal({
                                  open,
                                  onClose,
                                  currentUser,
                                  role,
                                  onCreated,
                              }: {
    open: boolean;
    onClose: () => void;
    currentUser: User | null;
    role: User["role"];
    onCreated: (room: ChatRoom) => void;
}) {
    const { users } = useUsersDirectory();
    const [loadingChoices, setLoadingChoices] = useState(true);
    const [choices, setChoices] = useState<RecipientOption[]>([]);
    const [selectedUuid, setSelectedUuid] = useState<string>("");

    useEffect(() => {
        if (!open) return;
        (async () => {
            setLoadingChoices(true);
            try {
                if (role === "investor") {
                    const founders = users.filter((u) => u.role === "founder" && !!u.founder_uuid);
                    const options: RecipientOption[] = [];
                    for (const fu of founders) {
                        if (!fu.founder_uuid) continue;
                        const fd = (await getFounderInfos(fu.founder_uuid)) as FounderDetail | FounderDetail[];
                        if (Array.isArray(fd)) continue;
                        const startupName = fd?.startup?.name ?? "No startup";
                        options.push({
                            user: fu,
                            label: `${fu.name} — ${startupName}`,
                        });
                    }
                    setChoices(
                        options.sort((a, b) => a.label.localeCompare(b.label)),
                    );
                } else if (role === "admin") {
                    const options: RecipientOption[] = users
                        .filter((u) => u.uuid !== currentUser?.uuid)
                        .map((u) => ({
                            user: u,
                            label: `${u.name} — ${u.role}`,
                        }))
                        .sort((a, b) => a.label.localeCompare(b.label));
                    setChoices(options);
                } else {
                    setChoices([]);
                }
            } catch (e) {
                console.error("Failed to build choices:", e);
                setChoices([]);
            } finally {
                setLoadingChoices(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, role, users, currentUser?.uuid]);

    const handleCreate = async () => {
        if (!selectedUuid || !currentUser) return;
        try {
            const room = await createRoom({
                first_party_uuid: currentUser.uuid,
                second_party_uuid: selectedUuid,
            });
            onCreated(room);
            onClose();
        } catch {
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h3 className="text-lg font-semibold mb-4">Start a new conversation</h3>
                {loadingChoices ? (
                    <div className="text-gray-600">Loading choices...</div>
                ) : choices.length === 0 ? (
                    <div className="text-gray-600">No available recipients.</div>
                ) : (
                    <>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select recipient
                        </label>
                        <select
                            className="border rounded px-3 py-2 w-full mb-4"
                            value={selectedUuid}
                            onChange={(e) => setSelectedUuid(e.target.value)}
                        >
                            <option value="">Choose...</option>
                            {choices.map((c) => (
                                <option key={c.user.uuid} value={c.user.uuid}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-300">
                        Cancel
                    </button>
                    <button
                        disabled={!selectedUuid || !currentUser}
                        onClick={handleCreate}
                        className="px-4 py-2 rounded-lg bg-green-500 text-white disabled:opacity-50"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}

function MessageBubble({
                           msg,
                           isMe,
                       }: {
    msg: ChatMessage;
    isMe: boolean;
}) {
    const time = useMemo(() => {
        try {
            return new Date(msg.sent_at).toLocaleString();
        } catch {
            return msg.sent_at;
        }
    }, [msg.sent_at]);

    return (
        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
            <div
                className={`px-3 py-2 rounded-lg max-w-xs break-words ${
                    isMe ? "bg-green-100" : "bg-blue-100"
                }`}
            >
                {msg.content}
            </div>
            <div className="text-xs text-gray-500 mt-1">{time}</div>
        </div>
    );
}

function RoomListItem({
                          room,
                          meUuid,
                          usersById,
                          selected,
                          onClick,
                          isAdminViewer,
                          unread,
                      }: {
    room: ChatRoom;
    meUuid: string;
    usersById: Record<string, User>;
    selected: boolean;
    onClick: () => void;
    isAdminViewer: boolean;
    unread: boolean;
}) {
    const meIsParty =
        room.first_party_uuid === meUuid || room.second_party_uuid === meUuid;

    let title = "";
    if (meIsParty) {
        const otherUuid =
            room.first_party_uuid === meUuid
                ? room.second_party_uuid
                : room.first_party_uuid;
        const other = usersById[otherUuid];
        title = other ? other.name : "Unknown user";
    } else {
        const u1 = usersById[room.first_party_uuid]?.name ?? room.first_party_uuid;
        const u2 = usersById[room.second_party_uuid]?.name ?? room.second_party_uuid;
        title = isAdminViewer ? `${u1} ↔ ${u2}` : "Unknown room";
    }

    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-3 py-2 rounded-lg ${
                selected ? "bg-blue-200" : "hover:bg-gray-100"
            }`}
        >
            <div className="flex items-center justify-between">
                <span>{title}</span>
                {unread && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-red-500" />}
            </div>
        </button>
    );
}

export function MessagesPage() {
    const [me, setMe] = useState<User | null>(null);
    const [role, setRole] = useState<User["role"] | null>(null);

    const { users, usersById, loading: loadingUsers } = useUsersDirectory();

    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [loadingRooms, setLoadingRooms] = useState(true);

    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [initialLoading, setInitialLoading] = useState(false);

    const [newMessage, setNewMessage] = useState("");
    const [creatingConversation, setCreatingConversation] = useState(false);

    const [unreadRoomSet, setUnreadRoomSet] = useState<Set<string>>(new Set());
    const [lastSeenByRoom, setLastSeenByRoom] = useState<Record<string, number>>({});
    const [latestMsgTimeByRoom, setLatestMsgTimeByRoom] = useState<Record<string, number>>({});

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const prevMsgCountRef = useRef(0);

    const scrollToBottom = (smooth = true) => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: smooth ? "smooth" : "auto",
                block: "end",
            });
        }
    };

    useEffect(() => {
        if (messages.length > prevMsgCountRef.current) {
            scrollToBottom(true);
        }
        prevMsgCountRef.current = messages.length;
    }, [messages.length]);

    const canCreateConversation =
        role === "admin" || role === "investor";

    const meUuid = me?.uuid ?? "";

    useEffect(() => {
        (async () => {
            const user = await getUserInformation();
            if (user === "") return;
            setMe(user);
            setRole(user.role);
        })();
    }, []);

    const loadRooms = async () => {
        setLoadingRooms(true);
        try {
            const all = await fetchRooms();
            let visible = all;
            if (role !== "admin" && meUuid) {
                visible = all.filter(
                    (r) => r.first_party_uuid === meUuid || r.second_party_uuid === meUuid,
                );
            }
            setRooms(visible);
            if (!selectedRoom && visible.length > 0) {
                setSelectedRoom(visible[0]);
            }
        } catch (e) {
        } finally {
            setLoadingRooms(false);
        }
    };

    useEffect(() => {
        if (!meUuid || !role) return;
        loadRooms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meUuid, role]);

    const mergeMessages = (current: ChatMessage[], incoming: ChatMessage[]) => {
        const map = new Map<string, ChatMessage>();
        for (const m of current) map.set(m.uuid, m);
        for (const m of incoming) map.set(m.uuid, m);
        const merged = Array.from(map.values()).sort(
            (a, b) => +new Date(a.sent_at) - +new Date(b.sent_at),
        );
        return merged;
    };

    const arraysEqualByUuid = (a: ChatMessage[], b: ChatMessage[]) => {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i].uuid !== b[i].uuid) return false;
        }
        return true;
    };

    const loadMessages = async (roomUuid: string, opts?: { soft?: boolean }) => {
        if (!opts?.soft) setInitialLoading(true);
        try {
            const msgs = await fetchRoomMessages(roomUuid);
            msgs.sort((a, b) => +new Date(a.sent_at) - +new Date(b.sent_at));
            setLatestMsgTimeByRoom((prev) => ({
                ...prev,
                [roomUuid]: msgs.length ? +new Date(msgs[msgs.length - 1].sent_at) : 0,
            }));

            setLastSeenByRoom((prev) => ({
                ...prev,
                [roomUuid]:
                    prev[roomUuid] ?? (msgs.length ? +new Date(msgs[msgs.length - 1].sent_at) : Date.now()),
            }));

            setMessages((prev) => {
                const merged = mergeMessages(prev, msgs);
                if (arraysEqualByUuid(prev, merged)) return prev;
                return merged;
            });

            setUnreadRoomSet((prev) => {
                const next = new Set(prev);
                next.delete(roomUuid);
                return next;
            });
        } catch (e) {
            // logged
        } finally {
            if (!opts?.soft) setInitialLoading(false);
        }
    };

    useEffect(() => {
        if (selectedRoom?.uuid) {
            setMessages([]);
            prevMsgCountRef.current = 0;
            setInitialLoading(true);
            loadMessages(selectedRoom.uuid, { soft: false }).then(() => {
                scrollToBottom(false);
            });
        } else {
            setMessages([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRoom?.uuid]);

    useEffect(() => {
        if (!selectedRoom?.uuid) return;
        const id = setInterval(() => {
            loadMessages(selectedRoom.uuid, { soft: true });
        }, 4000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRoom?.uuid]);

    useEffect(() => {
        if (rooms.length === 0) return;
        const id = setInterval(async () => {
            for (const r of rooms) {
                if (selectedRoom?.uuid === r.uuid) continue;
                try {
                    const msgs = await fetchRoomMessages(r.uuid);
                    if (!msgs || msgs.length === 0) continue;
                    msgs.sort((a, b) => +new Date(a.sent_at) - +new Date(b.sent_at));
                    const latest = +new Date(msgs[msgs.length - 1].sent_at);

                    setLatestMsgTimeByRoom((prev) => {
                        const next = { ...prev, [r.uuid]: latest };
                        const lastSeen = lastSeenByRoom[r.uuid] ?? 0;
                        if (latest > lastSeen) {
                            setUnreadRoomSet((prevSet) => {
                                const s = new Set(prevSet);
                                s.add(r.uuid);
                                return s;
                            });
                        }
                        return next;
                    });
                } catch {
                }
            }
        }, 7000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rooms, selectedRoom?.uuid, lastSeenByRoom]);

    const handleSelectRoom = (room: ChatRoom) => {
        setSelectedRoom(room);
        setUnreadRoomSet((prev) => {
            const next = new Set(prev);
            next.delete(room.uuid);
            return next;
        });
        setLastSeenByRoom((prev) => ({ ...prev, [room.uuid]: Date.now() }));
    };

    const roomReceiverUuid = useMemo(() => {
        if (!selectedRoom || !meUuid) return null;
        if (selectedRoom.first_party_uuid === meUuid)
            return selectedRoom.second_party_uuid;
        if (selectedRoom.second_party_uuid === meUuid)
            return selectedRoom.first_party_uuid;
        return null;
    }, [selectedRoom, meUuid]);

    const canSendInSelectedRoom = !!roomReceiverUuid && !!meUuid;

    const handleSend = async () => {
        if (!selectedRoom || !canSendInSelectedRoom || !newMessage.trim() || !meUuid || !roomReceiverUuid) return;
        const content = newMessage.trim();
        setNewMessage("");
        try {
            const created = await sendMessage(selectedRoom.uuid, {
                content,
                sender_uuid: meUuid,
                receiver_uuid: roomReceiverUuid,
            });
            setMessages((prev) => {
                const next = mergeMessages(prev, [created]);
                return next;
            });
            const createdAt = +new Date(created.sent_at);
            setLatestMsgTimeByRoom((prev) => ({ ...prev, [selectedRoom.uuid]: createdAt }));
            setLastSeenByRoom((prev) => ({ ...prev, [selectedRoom.uuid]: createdAt }));
            scrollToBottom(true);
        } catch {
        }
    };

    const handleCreatedRoom = (room: ChatRoom) => {
        setRooms((prev) => {
            const exists = prev.some((r) => r.uuid === room.uuid);
            const next = exists ? prev : [room, ...prev];
            return next;
        });
        setSelectedRoom(room);
        setUnreadRoomSet((prev) => {
            const next = new Set(prev);
            next.delete(room.uuid);
            return next;
        });
        setLastSeenByRoom((prev) => ({ ...prev, [room.uuid]: Date.now() }));
    };

    const isAdminViewerOfForeignRoom =
        role === "admin" &&
        selectedRoom != null &&
        meUuid &&
        selectedRoom.first_party_uuid !== meUuid &&
        selectedRoom.second_party_uuid !== meUuid;

    return (
        <div className="flex border rounded-lg shadow h-[600px] bg-white">
            <div className="w-1/3 border-r p-2 bg-gray-50 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Discussions</h3>
                    {canCreateConversation && (
                        <button
                            onClick={() => setCreatingConversation(true)}
                            className="text-sm px-2 py-1 rounded bg-green-500 text-white"
                        >
                            New
                        </button>
                    )}
                </div>

                {loadingRooms || loadingUsers || !me ? (
                    <div className="text-gray-500 p-2">Loading...</div>
                ) : rooms.length === 0 ? (
                    <div className="text-gray-500 p-2">
                        {canCreateConversation
                            ? "No conversations yet. Create one!"
                            : "No conversations available."}
                    </div>
                ) : (
                    <div className="space-y-1 overflow-y-auto">
                        {rooms.map((r) => (
                            <RoomListItem
                                key={r.uuid}
                                room={r}
                                meUuid={meUuid}
                                usersById={usersById}
                                selected={!!selectedRoom && selectedRoom.uuid === r.uuid}
                                onClick={() => handleSelectRoom(r)}
                                isAdminViewer={role === "admin"}
                                unread={unreadRoomSet.has(r.uuid)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col">
                <div className="p-3 border-b bg-gray-100 font-semibold">
                    {selectedRoom ? (
                        (() => {
                            const meIsParty =
                                selectedRoom.first_party_uuid === meUuid ||
                                selectedRoom.second_party_uuid === meUuid;
                            if (meIsParty) {
                                const otherUuid =
                                    selectedRoom.first_party_uuid === meUuid
                                        ? selectedRoom.second_party_uuid
                                        : selectedRoom.first_party_uuid;
                                const other = usersById[otherUuid];
                                return other ? other.name : "Conversation";
                            } else if (role === "admin") {
                                const u1 =
                                    usersById[selectedRoom.first_party_uuid]?.name ??
                                    selectedRoom.first_party_uuid;
                                const u2 =
                                    usersById[selectedRoom.second_party_uuid]?.name ??
                                    selectedRoom.second_party_uuid;
                                return `${u1} ↔ ${u2}`;
                            } else {
                                return "Conversation";
                            }
                        })()
                    ) : (
                        "Select a conversation"
                    )}
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {selectedRoom ? (
                        initialLoading && messages.length === 0 ? (
                            <div className="text-gray-500">Loading messages...</div>
                        ) : messages.length === 0 ? (
                            <div className="text-gray-500">No messages yet.</div>
                        ) : (
                            <>
                                {messages.map((m) => (
                                    <MessageBubble key={m.uuid} msg={m} isMe={m.sender_uuid === meUuid} />
                                ))}
                                <div ref={messagesEndRef} />
                            </>
                        )
                    ) : (
                        <div className="text-gray-500">Choose a conversation to view messages.</div>
                    )}
                </div>

                <div className="flex border-t p-2 gap-2">
                    <input
                        type="text"
                        placeholder={
                            selectedRoom
                                ? isAdminViewerOfForeignRoom
                                    ? "You are not a participant of this room"
                                    : "Type your message..."
                                : "Select a conversation..."
                        }
                        className="flex-1 border rounded-lg px-3 py-2"
                        disabled={!selectedRoom || !canSendInSelectedRoom || !!isAdminViewerOfForeignRoom}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSend();
                        }}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                        onClick={handleSend}
                        disabled={!selectedRoom || !canSendInSelectedRoom || !!isAdminViewerOfForeignRoom || !newMessage.trim()}
                    >
                        Send
                    </button>
                </div>
            </div>

            <NewConversationModal
                open={creatingConversation}
                onClose={() => setCreatingConversation(false)}
                currentUser={me}
                role={(role as User["role"]) || "investor"}
                onCreated={handleCreatedRoom}
            />
        </div>
    );
}

export function StatisticsPage() {
    const [totalStartups, setTotalStartups] = useState(0);
    const [totalViews, setTotalViews] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const projects = await getProjects();
                if (!projects) {
                    console.error("Failed to load statistics");
                    return;
                }

                setTotalStartups(projects.length);
                const views = projects.reduce((sum, project: ProjectDetail) => {
                    return sum + (project.views_count || 0);
                }, 0);
                setTotalViews(views);
            } catch (err) {
                console.error("An error occurred while loading statistics");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg animate-pulse">Loading statistics...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">Platform Statistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg p-6 transform hover:scale-101 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Total Startups</h3>
                            <p className="text-4xl font-bold mt-2">{totalStartups}</p>
                            <p className="text-sm opacity-80 mt-1">Active startups on the platform</p>
                        </div>
                        <svg className="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2-5v5m14-5v5M9 8h6m-3 4h3" />
                        </svg>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl shadow-lg p-6 transform hover:scale-101 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Total Project Views</h3>
                            <p className="text-4xl font-bold mt-2">{totalViews}</p>
                            <p className="text-sm opacity-80 mt-1">Cumulative views across all projects</p>
                        </div>
                        <svg className="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}