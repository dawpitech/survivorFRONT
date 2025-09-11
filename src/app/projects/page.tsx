"use client";

import { InputProject } from "@/components/ui/inputProject";
import "../globals.css";
import { useState, useEffect } from "react";
import { getProjects, ProjectDetail } from "@/lib/projects";
import { useRouter } from "next/navigation";
import { SimpleListMaturity } from "@/components/layout/projectFilter";
import SimpleListSector from "@/components/layout/projectFilter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProjectPage() {
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [projects, setProjects] = useState<ProjectDetail[] | null>([]);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedMaturity, setSelectedMaturity] = useState<string | null>(null);

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

  const filteredProjects = projects?.filter((proj) => {
    const nameMatch = proj.name
      .toLowerCase()
      .includes(projectName.toLowerCase());
    const locationMatch = proj.address
      ?.toLowerCase()
      .includes(projectLocation.toLowerCase());
    const sectorMatch =
      !selectedSector ||
      selectedSector === "All" ||
      proj.sector === selectedSector;
    const maturityMatch =
      !selectedMaturity ||
      selectedMaturity === "All" ||
      proj.maturity === selectedMaturity;
    return nameMatch && sectorMatch && maturityMatch && locationMatch;
  });

  return (
    <>
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
          <div className="flex flex-col md:flex-row flex-auto justify-center gap-3 border rounded-xl m-4 bg-gray-50">
            {projects ? (
              <SimpleListSector
                projects={projects}
                onSectorChange={setSelectedSector}
              />
            ) : null}
            {projects ? (
              <SimpleListMaturity
                projects={projects}
                onSectorChange={setSelectedMaturity}
              />
            ) : null}
            <InputProject
              name="Project Name"
              value={projectName}
              onChange={setProjectName}
            />
            <InputProject
              name="Project Location"
              value={projectLocation}
              onChange={setProjectLocation}
            />
          </div>
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
            {filteredProjects?.map((proj, index) => (
              <article
                key={proj.uuid || index}
                className="border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 bg-white cursor-pointer"
                onClick={() => handleProjectClick(proj.uuid)}
              >
                  <h3 className="mt-[1rem] font-bold text-lg">{proj.name}</h3>
                  <p>{proj.address?.split(" ").pop()}</p>
                  <p className="text-lg"> {proj.description} </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
