"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/layout/NavBar";
import "../../globals.css";
import { News } from "../page";
import { apiClient } from "@/lib/api";

export async function getNewsByUuid(uuid: string): Promise<News | null> {
    try {
        const response: News = await apiClient.get(`/news/${uuid}`)
        const picture = await apiClient.getImage(`/news/${uuid}/picture/`)
        const blob = await picture.blob()
        const base64String = await new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(blob)
        })

        response.image = base64String
        return response

    } catch (error) {
        console.error("Error fetching news")
        return null
    }
}

export default function NewsDetailPage() {
    const params = useParams();
    const [news, setNews] = useState<News | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            if (params.uuid && typeof params.uuid === 'string') {
                const newsData = await getNewsByUuid(params.uuid);
                setNews(newsData);
            }
        };

        fetchNews();
    }, []);

    if (!news) {
        return (
            <>
                <header>
                    <NavBar />
                </header>
                <main className="flex items-center justify-center min-h-screen">
                    <div className="text-xl text-red-500">News not found</div>
                </main>
            </>
        );
    }

    return (
        <>
            <header>
                <NavBar />
            </header>
            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {news.image && (
                        <div className="h-64 bg-gray-200">
                            <img
                                src={news.image}
                                alt={news.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-8">
                        <h1 className="text-4xl font-bold mb-4">{news.title}</h1>

                        {news.description && (
                            <p className="text-lg text-gray-700 mb-6">{news.description}</p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Informations</h2>

                                {news.category && (
                                    <div className="mb-3">
                                        <span className="font-medium">Category:</span> {news.category}
                                    </div>
                                )}
                                {news.category && (
                                    <div className="mb-3">
                                        <span className="font-medium">Location:</span> {news.location}
                                    </div>
                                )}
                            </div>

                            <div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => window.history.back()}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Return
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="mt-16 pt-8 pb-6 border-t border-gray-200 bg-gray-50">
                <p className="text-center text-gray-600">© 2025 JEB Incubator</p>
            </footer>
        </>
    );
}

