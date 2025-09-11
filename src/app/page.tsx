"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import { getProjects, ProjectDetail } from "@/lib/projects";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectDetail[] | null>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await getProjects();
      setProjects(projects);
    };
    fetchProjects();
  }, []);

  const handleProjectClick = (uuid: string) => {
    router.push(`/projects/${uuid}`);
  };

  const filterProjects: ProjectDetail[] | null = projects?.slice(0, 3) ?? null;

  return (
    <>
      <main>
        <section className="flex flex-col">
          <h1 className="text-6xl pl-[2rem] pt-[3rem] pb-[2rem]">
            JEB Incubator
          </h1>
          <p className="text-xl mx-auto pl-[2rem] pb-[2rem] pr-[2rem]">
            {" "}
            Welcome to the JEB Incubator ! A platform dedicated to highlighting
            the creativity, ambition, and progress of startups supported by our
            incubator. Here, you can discover innovative projects across diverse
            sectors, learn about their founders, and follow their journey from
            idea to impact. Whether you are an investor, partner, institution,
            or curious visitor, this space connects you directly with emerging
            talent and groundbreaking solutions. Explore our catalog, stay
            updated with the latest news and events, and join us in fostering
            innovation and collaboration.{" "}
          </p>
        </section>

        <section className="flex flex-col items-center justify-center">
          <h2 className="text-4xl p-[3rem]">Projects</h2>
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
            {filterProjects?.map((proj, index) => (
              <article
                key={proj.uuid || index}
                className="border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 bg-white cursor-pointer"
                onClick={() => handleProjectClick(proj.uuid)}
              >
                <h3 className="mt-[1rem] font-bold text-lg">{proj.name}</h3>
                <p>{proj.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
