import { getAllFreelancers } from "@/api-functions/freelancer-functions";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import FreelancerCard from "@/components/Freelancer-card";
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Member Freelancers
            </h2>
            <div className="flex items-center gap-5">
                {props.projectData.project_freelancers_join_table.length === 0 && (
                    <div>No freelancer added yet</div>
                )}

                {props.projectData.project_freelancers_join_table.length >= 1 &&
                    props.projectData.project_freelancers_join_table.map((item) => (
                        <FreelancerCard
                            key={item.freelancers.id}
                            freelancerData={item.freelancers}
                            showInviteButton={false}
                        />
                    ))}
            </div>

            {isLoading && (
                <div className="mt-32 flex justify-center items-center w-full">
                    <Spinner className="w-12 h-12 text-[var(--my-blue)]" />
                </div>
            )}

            {isError && (
                <div className="mt-32 flex justify-center items-center w-full">
                    <p>Error in getting freelancers!</p>
                </div>
            )}

            {!isLoading && !isError && (
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                        Add new freelancers
                    </h2>
                    <InvitedFreelancersSidebar />

                    {availableFreelancers.length === 0 && (
                        <div>No freelancers available to add.</div>
                    )}
                    {availableFreelancers.length >= 1 && (
                        <div className="flex p-4 gap-6 flex-wrap justify-center md:justify-start">
                            {availableFreelancers.map((item) => (
                                <FreelancerCard
                                    freelancerData={item}
                                    showInviteButton={true}
                                    key={item.id}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectDetailsFreelancerSection;
