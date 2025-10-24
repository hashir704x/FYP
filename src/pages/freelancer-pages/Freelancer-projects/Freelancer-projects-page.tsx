import { useQuery } from "@tanstack/react-query";
import { getAllProjectsForFreelancer } from "@/api-functions/project-functions";
import { userAuthStore } from "@/store/user-auth-store";
import type { UserType } from "@/Types";
import { Spinner } from "@/components/ui/spinner";
import ProjectCard from "@/components/Project-card";
import { Folder } from "lucide-react";

const FreelancerProjectsPage = () => {
    const user = userAuthStore((state) => state.user) as UserType;

    const { data, isError, isLoading } = useQuery({
        queryFn: () => getAllProjectsForFreelancer(user.userId),
        queryKey: ["get-all-projects-for-freelancer"],
    });

    return (
        <div>
            <h1 className="text-3xl font-semibold h-[70px] px-4 border-b flex items-center">
                My Projects
            </h1>

            {isLoading && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <Spinner className="w-12 h-12 text-[var(--my-blue)]" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting freelancer projects data</p>
                </div>
            )}

            {data && data.length === 0 && (
                <div>
                    <div className="flex flex-col items-center justify-center h-[calc(100vh-70px)]">
                        <div className="p-2 border bg-gray-200 rounded-lg">
                            <Folder size={25} fill="true" />
                        </div>
                        <h2 className="text-xl font-medium mt-2">No Projects Yet</h2>
                        <p className="w-[320px] text-center mt-2 text-gray-500 font-medium">
                            You are not a part of any project yet.
                        </p>
                    </div>
                </div>
            )}

            {data && data.length >= 1 && (
                <div className="flex p-4 gap-6 flex-wrap justify-center md:justify-start">
                    {data.map((item) => (
                        <ProjectCard key={item.projects.project_id} {...item.projects} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FreelancerProjectsPage;
