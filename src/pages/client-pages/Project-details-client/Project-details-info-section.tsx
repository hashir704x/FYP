import type { ProjectDetailsTypeFromBackend } from "@/Types";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import FreelancerCard from "@/components/Freelancer-card";

type PropsType = {
    projectData: ProjectDetailsTypeFromBackend;
    setActiveOption: React.Dispatch<
        React.SetStateAction<"freelancers" | "info" | "milestones">
    >;
};

const ProjectDetailsInfoSection = (props: PropsType) => {
    return (
        <section>
            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Project Description
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                    {props.projectData.project_description}
                </p>
            </section>

            <section className="mb-10">
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
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Member Freelancers</h2>

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
                    <div className="flex items-center gap-5">
                        {props.projectData.project_freelancers_join_table.map((item) => (
                            <FreelancerCard
                                key={item.freelancers.id}
                                freelancerData={item.freelancers}
                                showInviteButton={false}
                            />
                        ))}
                    </div>
                )}
            </section>
        </section>
    );
};

export default ProjectDetailsInfoSection;
