"use client";
import { News, NewsProps } from "@/app/news/page";
import Image from "next/image";
import { useRouter } from "next/navigation";

import ReactMarkdown from 'react-markdown'

export default function RecentNews({ news }: NewsProps) {
    const router = useRouter()
    const handleNewsClick = (news: News) => {
        router.push(`news/${news.uuid}`)
    }

    const recentNews = news.slice(0, 3);

    if (!recentNews || recentNews.length < 3) {
        return <div className="p-4 text-center">Don&apos;t forget to check the news!</div>;
    }

    return (
        <section className="max-w-6xl mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
                    Our last News
                </h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto">
                <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-32 md:h-40 relative hover:grayscale-75">
                        <Image
                            src={`${recentNews[0].image}`}
                            alt={recentNews[0].title ?? "news image"}
                            fill
                            className="object-cover hover:bg-gray-50"
                            onClick={() => handleNewsClick(recentNews[0])}
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {recentNews[0].title}
                        </h3>
                        <div className="line-clamp-4">
                            <ReactMarkdown>
                                {recentNews[0].description}
                            </ReactMarkdown>
                        </div>
                    </div>
                </article>

                <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-32 md:h-40 relative hover:grayscale-75">
                        <Image
                            src={`${recentNews[1].image}`}
                            alt={recentNews[1].title ?? "news image"}
                            fill
                            className="object-cover hover:bg-gray-50"
                            onClick={() => handleNewsClick(recentNews[1])}
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {recentNews[1].title}
                        </h3>
                        <div className="line-clamp-4">
                            <ReactMarkdown>
                                {recentNews[1].description}
                            </ReactMarkdown>
                        </div>
                    </div>
                </article>

                <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-32 md:h-40 relative hover:grayscale-75">
                        <Image
                            src={`${recentNews[2].image}`}
                            alt={recentNews[2].title ?? "news image"}
                            fill
                            className="object-cover"
                            onClick={() => handleNewsClick(recentNews[2])}
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {recentNews[2].title}
                        </h3>
                        <div className="line-clamp-4">
                            <ReactMarkdown>
                                {recentNews[2].description}
                            </ReactMarkdown>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );
}
