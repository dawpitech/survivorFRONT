"use client";
import {News, NewsProps} from "@/app/news/page";
import Image from "next/image";

export default function RecentNews({ news }: NewsProps) {
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
                <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-32 md:h-40 relative">
                        <Image
                            src={recentNews[0].image}
                            alt={recentNews[0].title}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {recentNews[1].title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                            {recentNews[1].description}
                        </p>
                    </div>
                </article>

                <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-32 md:h-40 relative">
                        <Image
                            src={recentNews[1].image}
                            alt={recentNews[1].title}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {recentNews[1].title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                            {recentNews[1].description}
                        </p>
                    </div>
                </article>

                <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-32 md:h-40 relative">
                        <Image
                            src={recentNews[2].image}
                            alt={recentNews[2].title}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {recentNews[2].title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                            {recentNews[2].description}
                        </p>
                    </div>
                </article>
            </div>
        </section>
    );
}