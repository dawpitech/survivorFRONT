"use client";
import NewsCarousel from "@/components/layout/NewsCarousel";
import RecentNews from "@/app/news/recentNews";

export interface News {
    title: string;
    description: string;
    image: string;
}

export interface NewsProps {
    news: News[];
}

export default function NewsPage() {
    const news: News[] = [
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
        {
            title: "Explore the innovative projects of our new startups",
            description: "and follow their progress within the incubator.",
            image: "/project.jpeg",
        },
        {
            title: "Explore the innovative projects of our new startups",
            description: "and follow their progress within the incubator.",
            image: "/project.jpeg",
        }
    ];

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-6 text-center">News</h1>
            <section>
                <NewsCarousel news={news}/>
            </section>
            <section>
                <RecentNews news={news} />
            </section>
        </div>
    );
}