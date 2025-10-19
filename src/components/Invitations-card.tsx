// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { InvitationsForProjectFromBackendType } from "@/Types";

// type PropsType = {
//     invitationData
// }

const InvitationsCard = (props: InvitationsForProjectFromBackendType) => {

    const formattedDate = new Date(props.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    return (
        <div
            className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm 
      hover:shadow-md transition-all cursor-pointer mb-3"
        >
            {/* Profile Picture */}
            <img
                src={props.freelancers.profile_pic}
                alt={props.freelancers.username}
                className="w-12 h-12 rounded-full object-cover border border-gray-300"
            />

            {/* Details Section */}
            <div className="flex flex-col flex-1">
                <h3 className="font-semibold text-[var(--my-blue)] text-lg">
                    {props.freelancers.username}
                </h3>
                <p className="text-sm text-gray-500">{props.freelancers.email}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mt-1">
                    {/* {props.freelancers[0].skills.slice(0, 3).map((skill) => (
                        <Badge
                            key={skill}
                            variant="secondary"
                            className="bg-[var(--my-blue-light)] text-[var(--my-blue)] text-xs"
                        >
                            {skill}
                        </Badge>
                    ))} */}
                    {props.freelancers.skills.length > 3 && (
                        <span className="text-xs text-gray-400">
                            +{props.freelancers.skills.length - 3}
                        </span>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-gray-400">Invited on {formattedDate}</p>

                    {/* Cancel Button */}
                    <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all text-xs"
                    >
                        Cancel Invite
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InvitationsCard;
