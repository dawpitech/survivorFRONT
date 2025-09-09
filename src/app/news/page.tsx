"use client";
import NewsCarousel from "@/components/layout/NewsCarousel";
import RecentNews from "@/app/news/recentNews";
import React from 'react'
import { apiClient } from "@/lib/api";

export interface News {
    uuid: string,
    title?: string,
    name?: string,
    description: string,
    location?: string,
    image?: string,
}

export interface NewsProps {
    news: News[];
}

export default function NewsPage() {
    const [news, setNews] = React.useState<News[]>([])

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response: News[] = await apiClient.get("/events/")
                const newsWithPicture = await Promise.all(
                    response.map(async (value: News) => {
                        const picture = await apiClient.getImage(`/events/${value.uuid}/picture/`)
                        const blob = await picture.blob()
                        const base64String = await new Promise<string>((resolve) => {
                            const reader = new FileReader()
                            reader.onloadend = () => resolve(reader.result as string)
                            reader.readAsDataURL(blob)
                        })

                        value.image = base64String
                        value.title = value.name
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
                <NewsCarousel news={news} />
            </section>
            <section>
                <RecentNews news={news} />
            </section>
        </div>
    );
}
