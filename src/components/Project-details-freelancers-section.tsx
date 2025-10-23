import { getAllFreelancers } from "@/api-functions/freelancer-functions";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "./ui/spinner";
import FreelancerCard from "./Freelancer-card";
import InvitedFreelancersSidebar from "./Invited-freelancers-sidebar";
import { useEffect, useState } from "react";
import type { FreelancerFromBackendType, ProjectDetailsTypeFromBackend } from "@/Types";

type PropsType = {
    projectData: ProjectDetailsTypeFromBackend;
};

const ProjectDetailsFreelancerSection = (props: PropsType) => {
    const [availableFreelancers, setAvailableFreelancers] = useState<
        FreelancerFromBackendType[]
    >([]);

    const { data, isLoading, isError } = useQuery({
        queryFn: getAllFreelancers,
        queryKey: ["get-all-freelancers"],
    });

    useEffect(() => {
        console.log("running useEffect");
        if (data) {
            const addedFreelancersIds =
                props.projectData.project_freelancers_join_table.map(
                    (item) => item.freelancers.id
                );
            const filtered = data.filter(
                (freelancer) => !addedFreelancersIds.includes(freelancer.id)
            );
            setAvailableFreelancers(filtered);
        }
    }, [data]);

    return (
        <div>
            {isLoading && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <Spinner className="w-12 h-12 text-[var(--my-blue)]" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting freelancers!</p>
                </div>
            )}

            <div>
                <InvitedFreelancersSidebar />
            </div>

            {data && (
                <div className="flex p-4 gap-6 flex-wrap justify-center md:justify-start">
                    {availableFreelancers.map((item) => (
                        <FreelancerCard {...item} key={item.id} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectDetailsFreelancerSection;
