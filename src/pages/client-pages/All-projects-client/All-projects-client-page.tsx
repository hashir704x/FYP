import { useQuery } from "@tanstack/react-query";
import { getAllProjectsForClient } from "@/api-functions/project-functions";
import { Spinner } from "@/components/ui/spinner";
import { Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProjectCard from "@/components/Project-card";

const AllProjectsClientPage = () => {
    const { data, isLoading, isError } = useQuery({
        queryFn: getAllProjectsForClient,
        queryKey: ["get-all-projects-for-client"],
    });

    return (
        <div>
            <h1 className="text-3xl font-semibold h-[70px] px-4 border-b flex items-center">
                All Projects
            </h1>

            {isLoading && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <Spinner className="w-12 h-12 text-[var(--my-blue)]" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting projects data</p>
                </div>
            )}

            {data && data.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-70px)]">
                    <div className="p-2 border bg-gray-200 rounded-lg">
                        <Folder size={25} fill="true" />
                    </div>
                    <h2 className="text-xl font-medium mt-2">No Projects Yet</h2>
                    <p className="w-[320px] text-center mt-2 text-gray-500 font-medium">
                        You haven't created any projects yet. Get started by creating your
                        first project.
                    </p>
                    <Link to="/client/create-project">
                        <Button variant="custom" className="mt-4">
                            Create Project
                        </Button>
                    </Link>
                </div>
            )}

            {data && data.length >= 1 && (
                <div className="flex p-4 gap-6 flex-wrap justify-center md:justify-start">
                    {data.map((item) => (
                        <ProjectCard key={item.project_id} {...item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllProjectsClientPage;
