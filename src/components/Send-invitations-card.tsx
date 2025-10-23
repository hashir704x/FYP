import { deleteInvitation } from "@/api-functions/project-invitations-functions";
import { Button } from "@/components/ui/button";
import type { InvitationsForProjectFromBackendType } from "@/Types";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const SendInvitationsCard = (props: InvitationsForProjectFromBackendType) => {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: deleteInvitation,
        onSuccess: () => {
            toast.success("Invitation canceled successfully");
            queryClient.invalidateQueries({
                queryKey: [, props.project_id],
            });
        },
        onError: () => {
            toast.error("Something went wrong! Cannot cancel invitation");
        },
    });

    const formattedDate = new Date(props.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    return (
        <div className="flex flex-col md:flex-row items-center gap-2 bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer mb-3">
            {/* Profile Picture */}
            <img
                src={props.freelancers.profile_pic}
                alt={props.freelancers.username}
                className="w-[70px] rounded-full object-cover border border-gray-300"
            />

            {/* Details Section */}
            <div className="flex flex-col flex-1">
                <h3 className="font-semibold text-[var(--my-blue)]">
                    {props.freelancers.username}
                </h3>
                <p className="text-xs text-gray-500">{props.freelancers.email}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mt-3 items-center">
                    {props.freelancers.skills.slice(0, 3).map((skill, i) => (
                        <span
                            key={i}
                            className="text-xs bg-gray-100 text-[var(--my-blue)] font-medium px-2.5 py-1 rounded-full border border-gray-200"
                        >
                            {skill}
                        </span>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-gray-400">Invited on {formattedDate}</p>

                    {/* Cancel Button */}
                    <Button
                        disabled={isPending}
                        onClick={() => mutate(props.id)}
                        variant="destructive"
                        size="sm"
                        className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all text-xs"
                    >
                        {isPending && <Spinner />}
                        Cancel Invite
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SendInvitationsCard;
