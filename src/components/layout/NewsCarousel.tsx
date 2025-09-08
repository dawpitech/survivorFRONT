"use client";

import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Autoplay} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export interface Slide {
    title: string;
    description: string;
    image: string;
}

export interface NewsCarouselProps {
    slides: Slide[];
}

export default function NewsCarousel({ slides }: NewsCarouselProps) {
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
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div className="flex flex-col md:flex-row items-stretch bg-gray-100 h-full">
                                <div className="md:w-1/3 w-full bg-purple-200 bg-opacity-70 p-6 flex flex-col justify-center h-full">
                                    <h2 className="text-xl font-bold mb-2">{slide.title}</h2>
                                    <p className="mb-4">{slide.description}</p>
                                    <button className="bg-black text-white px-4 py-2 rounded self-start">
                                        Learn More
                                    </button>
                                </div>

                                <div className="md:w-2/3 w-full h-full">
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
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