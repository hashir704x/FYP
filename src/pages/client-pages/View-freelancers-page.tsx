import { getAllFreelancers } from "@/api-functions/freelancer-functions";
import FreelancerCard from "@/components/Freelancer-card";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const ViewFreelancersPage = () => {
    const { data, isLoading, isError } = useQuery({
        queryFn: getAllFreelancers,
        queryKey: ["get-all-freelancers"],
    });

    return (
        <div>
            <h1 className="text-3xl font-semibold h-[70px] px-4 border-b flex items-center">
                Freelancers
            </h1>

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
                <div>
                    <div className="flex p-4 gap-6 flex-wrap justify-center md:justify-start">
                        {data.map((item) => (
                            <Link to={`#`} key={item.id}>
                                <FreelancerCard {...item} />
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewFreelancersPage;
