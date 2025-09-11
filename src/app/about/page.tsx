"use client";

import React from "react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <>
            <main>
                <section className="flex flex-col items-center justify-center px-4">
                    <h2 className="text-4xl md:text-6xl pt-8 pb-6 text-center">About</h2>

                    <p className="text-lg md:text-xl text-center mb-6">
                        About JEB Incubator ©
                    </p>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 my-6 w-full max-w-6xl">
                        {/* Text block */}
                        <p className="flex-2 text-justify md:flex-1">
                            JEB Incubator is more than just a place where startups grow, it is
                            a dynamic ecosystem designed to nurture innovation, ambition, and
                            collaboration. We bring together visionary entrepreneurs,
                            dedicated mentors, and strategic partners to create an environment
                            where ideas can transform into successful businesses. Our mission
                            is to provide project leaders with the resources, knowledge, and
                            opportunities they need to thrive, from the earliest stages of
                            development to scaling on national and international levels. We
                            support startups through personalized guidance, access to funding
                            opportunities, and a strong network of investors, institutions,
                            and industry experts. By fostering collaboration between startups,
                            alumni, and external partners, we ensure that each project
                            benefits from collective experience and shared success. In
                            addition to mentorship and training, JEB Incubator organizes
                            conferences, pitch sessions, and networking events that give
                            entrepreneurs the visibility they need to attract clients,
                            investors, and media attention. At JEB, we believe that innovation
                            is a driver of positive change. That is why our incubator is
                            committed to empowering entrepreneurs who aim not only to succeed
                            in business but also to have a meaningful impact on society.
                            Whether you are a startup founder, an investor looking for the
                            next big opportunity, or a partner eager to support innovation,
                            JEB Incubator is the place where ideas come alive and futures are
                            built.
                        </p>

                        {/* Image block */}
                        <div className="flex justify-center md:flex-shrink-0 md:w-1/3">
                            <img
                                src="/logo.png"
                                alt="logo"
                                className="w-36 h-auto md:w-56 lg:w-64"
                            />
                        </div>
                    </div>

                    <a
                        className="text-lg md:text-xl text-blue-600 hover:underline mb-8"
                        href="/contact"
                    >
                        Contact us
                    </a>
                </section>
            </main>
        </>
    );
}
