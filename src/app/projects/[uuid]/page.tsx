"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/layout/NavBar";
import "../../globals.css";

import { getProjectByUuid, ProjectDetail } from "@/lib/projects";

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (params.uuid && typeof params.uuid === "string") {
        const projectData = await getProjectByUuid(params.uuid);
        setProject(projectData);
      }
    };

    fetchProject();
  }, []);

  if (!project) {
    return (
      <>
        <header>
          <NavBar />
        </header>
        <main className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-red-500">Project not found</div>
        </main>
      </>
    );
  }

  return (
    <>
      <header>
        <NavBar />
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {project.image && (
            <div className="h-64 bg-gray-200">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4">{project.name}</h1>

            {project.description && (
              <p className="text-lg text-gray-700 mb-6">
                {project.description}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Informations</h2>

                {project.sector && (
                  <div className="mb-3">
                    <span className="font-medium">Sector:</span>{" "}
                    {project.sector}
                  </div>
                )}

                {project.legal_status && (
                  <div className="mb-3">
                    <span className="font-medium">Legal status:</span>{" "}
                    {project.legal_status}
                  </div>
                )}

                {project.maturity && (
                  <div className="mb-3">
                    <span className="font-medium">Maturity:</span>{" "}
                    {project.maturity}
                  </div>
                )}

                {project.project_status && (
                  <div className="mb-3">
                    <span className="font-medium">Project status:</span>{" "}
                    {project.project_status}
                  </div>
                )}

                {project.needs && (
                  <div className="mb-3">
                    <span className="font-medium">Needs:</span> {project.needs}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Contact</h2>

                <div className="mb-3">
                  <span className="font-medium">Email:</span>
                  <a
                    href={`mailto:${project.email}`}
                    className="text-blue-600 hover:underline ml-2"
                  >
                    {project.email}
                  </a>
                </div>

                {project.phone && (
                  <div className="mb-3">
                    <span className="font-medium">Phone:</span> {project.phone}
                  </div>
                )}

                {project.address && (
                  <div className="mb-3">
                    <span className="font-medium">Adresse:</span>{" "}
                    {project.address}
                  </div>
                )}

                {project.website_url && (
                  <div className="mb-3">
                    <span className="font-medium">Website:</span>
                    <a
                      href={project.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-2"
                    >
                      {project.website_url}
                    </a>
                  </div>
                )}

                {project.social_media_url && (
                  <div className="mb-3">
                    <span className="font-medium">Social network:</span>
                    <a
                      href={project.social_media_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-2"
                    >
                      {project.social_media_url}
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div>
              <span className="font-medium">Founders:</span>
              {project.founders?.map((founder) => {
                return founder.name;
              })}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => window.history.back()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Return
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
