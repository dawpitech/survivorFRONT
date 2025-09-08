"use client";
import NewsCarousel, { Slide } from "@/components/layout/NewsCarousel";

export default function NewsPage() {
    const news: Slide[] = [
        {
            title: "Explore the innovative projects of our new startups",
            description: "and follow their progress within the incubator.",
            image: "/project.jpeg",
        },
        {
            title: "Explore the innovative projects of our new startups",
            description: "and follow their progress within the incubator.",
            image: "/project.jpeg",
        },
    ];

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-6 text-center">News</h1>
            <NewsCarousel slides={news} />
        </div>
    );
}