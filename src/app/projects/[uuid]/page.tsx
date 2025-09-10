"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/layout/NavBar";
import "../../globals.css";

import {getPitchDeck, getProjectByUuid, ProjectDetail, upProjectStats} from "@/lib/projects";
import { apiClient } from "@/lib/api";

import Image from "next/image";
import { User } from "@/lib/user";

export default function ProjectDetailPage() {
    const params = useParams();
    const [project, setProject] = useState<ProjectDetail | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            if (params.uuid && typeof params.uuid === "string") {
                const projectData = await getProjectByUuid(params.uuid);
                if (projectData?.founders) {
                    const founderWithImage = await Promise.all(
                        projectData?.founders.map(async (founder) => {
                            try {
                                const user: User = await apiClient.get(
                                    `/users/founderUUID/${founder.uuid}`
                                );
                                console.log(`User uuid = ${user.uuid} for ${founder.name}`);
                                const response = await apiClient.getImage(
                                    `/users/${user.uuid}/picture`
                                );
                                const blob = await response.blob();
                                const base64String = await new Promise<string>((resolve) => {
                                    const reader = new FileReader();
                                    reader.onloadend = () => resolve(reader.result as string);
                                    reader.readAsDataURL(blob);
                                });

                                founder.image = base64String;
                                return founder;
                            } catch {
                                console.error(`Unable to get founder ${founder.uuid} picture`);
                                founder.image = "/logo.png";
                                return founder;
                            }
                        })
                    );
                    projectData.founders = founderWithImage;
                }

                setProject(projectData);
                if (projectData?.uuid) {
                    try {
                        await upProjectStats(projectData.uuid);
                    } catch (err) {
                        console.error("Failed to update project stats:", err);
                    }
                }
            }
        };

        fetchProject();
    }, [params.uuid]);

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
        )
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
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-4xl font-bold">{project.name}</h1>

                            <button
                                onClick={async () => {
                                    try {
                                        await getPitchDeck(project?.uuid);
                                    } catch (err) {
                                        alert("❌ No pitch deck is available for this project.");
                                    }
                                }}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                            >
                                📄 Download pitch deck
                            </button>
                        </div>

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
                            {project.founders?.map((founder, index) => {
                                return (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="relative w-12 h-12 flex-shrink-0">
                                            <Image
                                                src={founder.image}
                                                alt={founder.name}
                                                fill
                                                className="rounded-full object-cover"
                                            />
                                        </div>
                                        <p className="font-medium">{founder.name}</p>
                                    </div>
                                )
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
