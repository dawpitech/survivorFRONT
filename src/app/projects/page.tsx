"use client";

import { InputProject } from "@/components/ui/inputProject";
import "../globals.css";
import NavBar from "@/components/layout/NavBar";
import { useState, useEffect } from "react";
import { getProjects, ProjectDetail } from "@/lib/projects";


export default function ProjectPage() {
    const [projectName, setProjectName] = useState("");
    const [projects, setProjects] = useState<ProjectDetail[] | null>([])

    useEffect(() => {
        const fetchProjects = async () => {
            const projects = await getProjects()
            console.log("projects are: ", projects)
            setProjects(projects)
        }
        fetchProjects()
    }, [])

    // const projects = [
    //   { name: "New partner" , description: "New startup", image: "/project.jpeg" },
    //   { name: "Future", description: "Future is Future", image: "/project.jpeg" },
    //   { name: "Project", description: "AI and creativity", image: "/project.jpeg" },
    //   { name: "New partner" , description: "New startup", image: "/project.jpeg" },
    //   { name: "Future", description: "Future is Future", image: "/project.jpeg" },
    //   { name: "Project", description: "AI and creativity", image: "/project.jpeg" },
    //   { name: "New partner" , description: "New startup", image: "/project.jpeg" },
    //   { name: "Future", description: "Future is Future", image: "/project.jpeg" },
    //   { name: "Project", description: "AI and creativity", image: "/project.jpeg" },
    // ];

    const filteredProjects = projects?.filter((proj) =>
        proj.name.toLowerCase().includes(projectName.toLowerCase()),
    );
    console.log("ProjectName state:", projectName);
    console.log("filter project:", filteredProjects);

    return (
        <>
            <header>
                <NavBar />
            </header>
            <main>
                <section className="flex flex-col items-center justify-center">
                    <h2 className="text-6xl pl-[2rem] pt-[3rem] pb-[2rem]">Projects</h2>
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
                    <div className="w-full max-w-6xl flex justify-end mb-6">
                        <InputProject value={projectName} onChange={setProjectName} />
                    </div>
                    <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
                        {filteredProjects?.map((proj, index) => (
                            <article
                                key={index}
                                className="border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 bg-white cursor-pointer"
                            >
                                <img src={proj.image} alt={proj.name} />
                                <h3 className="mt-[1rem] font-bold text-lg">{proj.name}</h3>
                                <p>{proj.description}</p>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
            <footer className="mt-16 pt-8 pb-6 border-t border-gray-200 bg-gray-50">
                <p className="text-center text-gray-600">© 2025 JEB Incubator</p>
            </footer>{" "}
        </>
    );
}
