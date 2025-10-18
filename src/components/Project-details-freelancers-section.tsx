import { getAllFreelancers } from "@/api-functions/freelancer-functions";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "./ui/spinner";
import FreelancerCard from "./Freelancer-card";

const ProjectDetailsFreelancerSection = () => {
    const { data, isLoading, isError } = useQuery({
        queryFn: getAllFreelancers,
        queryKey: ["get-all-freelancers"],
    });

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

            {data && (
                <div className="flex p-4 gap-6 flex-wrap justify-center md:justify-start">
                    {data.map((item) => (
                        <FreelancerCard {...item} key={item.id} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectDetailsFreelancerSection;
