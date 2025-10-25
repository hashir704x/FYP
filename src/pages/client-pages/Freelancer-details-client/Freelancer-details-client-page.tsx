import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFreelancerDataById } from "@/api-functions/freelancer-functions";
import { Spinner } from "@/components/ui/spinner";

import { Briefcase, Sparkles } from "lucide-react";

import ShowProjectsForInvitationsSidebar from "@/pages/client-pages/Freelancer-details-client/Show-projects-for-invitations-sidebar";

const FreelancerDetailsClientPage = () => {
    const { freelancerId } = useParams();

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getFreelancerDataById(freelancerId as string),
        queryKey: ["get-freelancer-details", freelancerId],
    });

    return (
        <div>
            <h1 className="text-3xl font-semibold h-[70px] px-4 border-b flex items-center">
                Freelancer Detials
            </h1>

            {isLoading && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <Spinner className="w-12 h-12 text-[var(--my-blue)]" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting Freelancer detailed data</p>
                </div>
            )}

            {data && (
                <div className="px-6 py-8 max-w-5xl mx-auto">
                    {/* <div className="flex items-center  flex-col md:flex-row"> */}
                    <div className="flex flex-col sm:flex-row items-center gap-8 border-b border-gray-200 pb-8">
                        <img
                            src={data.profile_pic}
                            alt={`${data.username} profile`}
                            className="w-40 h-40 rounded-full object-cover shadow-md border-4 border-indigo-100"
                        />
                        <div className="flex-1">
                            <div className="flex items-center justify-between flex-col md:flex-row">
                                <h1 className="text-4xl font-semibold text-gray-900">
                                    {data.username}
                                </h1>

                                <div className="mt-2">
                                    <ShowProjectsForInvitationsSidebar />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <section className="mt-8">
                        <div className="flex items-center gap-2 mb-3">
                            <Briefcase className="w-6 h-6 text-purple-500" />
                            <h2 className="text-2xl font-semibold text-gray-900">
                                About
                            </h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            {data.description}
                        </p>
                    </section>

                    {/* Skills Section */}
                    <section className="mt-10">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-6 h-6 text-amber-500" />
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Skills
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-2">
                            {data.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full border border-indigo-100"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default FreelancerDetailsClientPage;
