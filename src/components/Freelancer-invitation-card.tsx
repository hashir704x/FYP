import type { InvitationsForFreelancerFromBackendType } from "@/Types";
import { CalendarDays, User } from "lucide-react";
import FreelancerConfirmInvitationDialog from "./Freelancer-confirm-invitation-dialog";

const FreelancerInvitationCard = (props: InvitationsForFreelancerFromBackendType) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-5 flex flex-col md:flex-row justify-between items-center md:items-start gap-6 w-full max-w-3xl mx-auto">
            <div className="flex-1 text-center md:text-left">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 break-words">
                    {props.projects.project_title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">
                    {props.projects.project_description}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {props.projects.required_skills.map((skill, index) => (
                        <span
                            key={index}
                            className="bg-blue-50 text-blue-600 text-xs sm:text-sm px-3 py-1 rounded-full font-medium border border-blue-100"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-3 w-full md:w-auto">
                <img
                    src={props.clients.profile_pic}
                    alt={props.clients.username}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover mx-auto md:mx-0"
                />

                <div>
                    <p className="text-gray-800 font-medium flex items-center justify-center md:justify-end gap-2 text-sm sm:text-base">
                        <User className="w-4 h-4 text-gray-500" />
                        {props.clients.username}
                    </p>
                </div>

                <div className="flex items-center justify-center md:justify-end gap-2 text-gray-400 text-xs sm:text-sm">
                    <CalendarDays className="w-4 h-4" />
                    {new Date(props.created_at).toLocaleDateString()}
                </div>

                <div className="flex flex-wrap justify-center md:justify-end gap-3 pt-2">
                    {/* <Button variant="custom">Accept</Button>
                    <Button variant="destructive" className="cursor-pointer">
                        Reject
                    </Button> */}
                    <FreelancerConfirmInvitationDialog
                        action="accept"
                        freelancerId={props.freelancer_id}
                        projectId={props.project_id}
                        clientId={props.client_id}
                        invitationId={props.id}
                    />

                    <FreelancerConfirmInvitationDialog
                        action="reject"
                        freelancerId={props.freelancer_id}
                        projectId={props.project_id}
                        clientId={props.client_id}
                        invitationId={props.id}
                    />
                </div>
            </div>
        </div>
    );
};

export default FreelancerInvitationCard;
