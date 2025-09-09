"use client";

import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Autoplay} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import {News, NewsProps} from "@/app/news/page";

export default function NewsCarousel({ news, onClick }: NewsProps) {

    return (
        <div className="p-8">
            <div className="w-full max-w-6xl mx-auto">
                <Swiper
                    modules={[Navigation, Autoplay]}
                    navigation
                    spaceBetween={50}
                    autoplay={{delay: 7000, disableOnInteraction: false}}
                    loop
                    className="h-96"
                    style={{ '--swiper-navigation-color': 'black' } as React.CSSProperties}
                >
                    {news.map((newsIndex, index) => (
                        <SwiperSlide key={index}>
                            <div className="flex flex-col md:flex-row items-stretch bg-gray-100 h-full">
                                <div className="md:w-2/5 w-full bg-[#0077B6] bg-opacity-70 p-6 flex flex-col justify-center h-full">
                                    <h2 className="ml-6 mb-1.5 text-xl font-bold">{newsIndex.title}</h2>
                                    <p className="ml-6 mb-4">{newsIndex.description}</p>
                                    <button className="ml-6 bg-black text-white px-4 py-2 rounded self-start" onClick={() => onClick(newsIndex)}>
                                        Learn More
                                    </button>
                                </div>

                                <div className="md:w-3/5 w-full h-full">
                                    <img
                                        src={newsIndex.image}
                                        alt={newsIndex.title}
                                        className="w-full h-full object-fill"
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
