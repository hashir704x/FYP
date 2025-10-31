import { getProjectById } from "@/api-functions/project-functions";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProjectDetailsInfoSection from "../../../components/Project-details-info-section";
import ProjectDetailsFreelancerSection from "./Project-details-freelancers-section";
import { Button } from "@/components/ui/button";
import { MessageCircleMore } from "lucide-react";
import { userAuthStore } from "@/store/user-auth-store";
import type { UserType } from "@/Types";

const ProjectDetailsClientPage = () => {
    const user = userAuthStore((state) => state.user) as UserType;
    const { projectId } = useParams();

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getProjectById(projectId as string),
        queryKey: ["get-project-details", projectId],
    });

    const [activeOption, setActiveOption] = useState<
        "info" | "freelancers" | "milestones"
    >("info");

    return (
        <div>
            <h1 className="text-3xl font-semibold h-[70px] px-4 border-b justify-center md:justify-start flex items-center">
                Project Detials
            </h1>

            {isLoading && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <Spinner className="w-12 h-12 text-[var(--my-blue)]" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting project detailed data</p>
                </div>
            )}

            {data && (
                <div className="max-w-5xl mx-auto px-6 xl:py-10 py-4">
                    {/* Project Header */}
                    <div className="mb-8 border-b border-gray-200 pb-6">
                        <div className="flex flex-col-reverse md:flex-row justify-between items-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-3 md:mb-0 tracking-tight">
                                {data.project_title}
                            </h1>

                            <div className="text-sm border-2 p-2 rounded-md mb-4 md:mb-0">
                                <button
                                    onClick={() => setActiveOption("info")}
                                    className={`${
                                        activeOption === "info" &&
                                        "bg-[var(--my-blue)] text-white"
                                    } w-[90px] h-[40px] rounded-md cursor-pointer`}
                                >
                                    Info
                                </button>
                                <button
                                    onClick={() => setActiveOption("freelancers")}
                                    className={`${
                                        activeOption === "freelancers" &&
                                        "bg-[var(--my-blue)] text-white"
                                    } w-[90px] h-[40px] rounded-md cursor-pointer`}
                                >
                                    Freelancers
                                </button>
                                <button
                                    onClick={() => setActiveOption("milestones")}
                                    className={`${
                                        activeOption === "milestones" &&
                                        "bg-[var(--my-blue)] text-white"
                                    } w-[90px] h-[40px] rounded-md cursor-pointer`}
                                >
                                    Milestones
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-gray-600 text-sm">
                            <span className="flex items-center gap-1">
                                <span className="text-gray-400">📅</span>
                                {new Date(data.created_at).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="text-gray-400">💰</span>
                                <span className="font-semibold text-gray-800">
                                    Rs {data.project_budget.toLocaleString()}
                                </span>
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="text-gray-400">🧠</span>
                                {data.required_skills.length} skills required
                            </span>
                        </div>

                        <Link
                            to={`/${
                                user.role === "client" ? "client" : "freelancer"
                            }/project-chat/${projectId}`}
                        >
                            <Button variant="custom" className="mt-5">
                                <MessageCircleMore /> Open Chat
                            </Button>
                        </Link>
                    </div>

                    {activeOption === "info" && (
                        <ProjectDetailsInfoSection
                            projectData={data}
                            setActiveOption={setActiveOption}
                        />
                    )}

                    {activeOption === "freelancers" && (
                        <ProjectDetailsFreelancerSection projectData={data} />
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectDetailsClientPage;
