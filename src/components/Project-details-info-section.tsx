import type { ProjectDetailsTypeFromBackend, UserType } from "@/Types";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import FreelancerCard from "@/components/Freelancer-card";
import { Link } from "react-router-dom";

type PropsType = {
    projectData: ProjectDetailsTypeFromBackend;
    user: UserType;
    setActiveOption: React.Dispatch<
        React.SetStateAction<"freelancers" | "info" | "milestones">
    >;
};

const ProjectDetailsInfoSection = (props: PropsType) => {
    return (
        <section>
            <div className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Project Description
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                    {props.projectData.project_description}
                </p>
            </div>

            <div className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Required Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                    {props.projectData.required_skills.map((item) => (
                        <span
                            key={item}
                            className="px-4 py-1.5 text-sm bg-blue-50 text-blue-700 font-medium rounded-full border border-blue-100 hover:bg-blue-100 transition-all"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Project Client
                </h2>
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-6 flex flex-col items-center text-center w-[300px]">
                    <img
                        src={props.projectData.clients.profile_pic}
                        alt="profile-pic"
                        className="w-24 h-24 rounded-full object-cover border-4 border-[var(--my-blue)] shadow-sm"
                    />

                    <h3 className="text-xl font-semibold text-gray-800 mt-4">
                        {props.projectData.clients.username}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">Client</p>

                    <div className="w-full h-[1px] bg-gray-100 my-4" />

                    {props.user.role === "client" &&
                    props.user.userId === props.projectData.clients.id ? (
                        <Link to={`/client/client-profile`}>
                            <Button variant="custom">View my profile</Button>
                        </Link>
                    ) : (
                        <Link
                            to={`/freelancer/client-profile/${props.projectData.clients.id}`}
                        >
                            <Button variant="custom">View Profile</Button>
                        </Link>
                    )}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Member Freelancers
                </h2>

                {props.projectData.project_freelancers_join_table.length === 0 ? (
                    <div>
                        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line my-2">
                            There are no added freelancers yet.
                        </p>
                        <Button
                            variant="custom"
                            className="mt-2"
                            onClick={() => props.setActiveOption("freelancers")}
                        >
                            {" "}
                            <CirclePlus /> Add Freelancers
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-wrap  items-center gap-6">
                        {props.projectData.project_freelancers_join_table.map((item) => (
                            <FreelancerCard
                                key={item.freelancers.id}
                                freelancerData={item.freelancers}
                                showInviteButton={false}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProjectDetailsInfoSection;
