"use client";
import NewsCarousel from "@/components/layout/NewsCarousel";
import RecentNews from "@/app/news/recentNews";
import React from 'react'
import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";

import ReactMarkdown from 'react-markdown'


export interface News {
    uuid?: string,
    id?: number,
    location?: string,
    title?: string,
    category?: string,
    startup_id?: number,
    description?: string,
    image?: string,
}

export interface NewsProps {
    news: News[],
    onClick: (news: News) => void,
}

export default function NewsPage() {
    const router = useRouter()
    const [news, setNews] = React.useState<News[]>([])

    const handleNewsClick = (news: News) => {
        router.push(`news/${news.uuid}`)
    }

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response: News[] = await apiClient.get("/news/")
                const newsWithPicture = await Promise.all(
                    response.map(async (value: News) => {
                        const picture = await apiClient.getImage(`/news/${value.uuid}/picture`)
                        const blob = await picture.blob()
                        const base64String = await new Promise<string>((resolve) => {
                            const reader = new FileReader()
                            reader.onloadend = () => resolve(reader.result as string)
                            reader.readAsDataURL(blob)
                        })

                        value.image = base64String
                        return value
                    })
                )
                setNews(newsWithPicture)
            } catch (error) {
                console.error("Error fetching news")
                setNews([])
            }
        }
        fetchData()
    }, [])

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-6 text-center">News</h1>
            <section>
                <NewsCarousel news={news} onClick={handleNewsClick}/>
            </section>
            <section>
                <RecentNews news={news} onClick={handleNewsClick}/>
            </section>
        </div>
    );
}
