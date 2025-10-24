import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { addFreelancerToProject } from "@/api-functions/project-functions";
import { deleteInvitation } from "@/api-functions/project-invitations-functions";

type PropsType = {
    freelancerId: string;
    projectId: string;
    clientId: string;
    invitationId: string;
    action: "accept" | "reject";
};
import { Spinner } from "@/components/ui/spinner";

export default function FreelancerConfirmInvitationDialog(props: PropsType) {
    const queryClient = useQueryClient();

    const { mutate: acceptMutation, isPending } = useMutation({
        mutationFn: addFreelancerToProject,
        onSuccess: () => {
            toast.success("You are now added to the project.");
            queryClient.invalidateQueries({
                queryKey: ["get-invitations-for-freelancer"],
            });
        },
        onError: (error) => {
            console.error(error.message);
            toast.error(error.message);
        },
    });

    const { mutate: rejectMutation, isPending: rejectionPending } = useMutation({
        mutationFn: deleteInvitation,
        onSuccess: () => {
            toast.success("Invitation rejected");
            queryClient.invalidateQueries({
                queryKey: ["get-invitations-for-freelancer"],
            });
        },
        onError: (error) => {
            console.error(error.message);
            toast.error("Failed to reject invitation.");
        },
    });

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {props.action === "accept" ? (
                    <Button
                        variant="custom"
                        disabled={isPending || rejectionPending}
                        className="mt-3"
                    >
                        {" "}
                        {isPending && <Spinner />}
                        Accept
                    </Button>
                ) : (
                    <Button
                        variant="destructive"
                        disabled={rejectionPending || isPending}
                        className="mt-3 cursor-pointer"
                    >
                        {" "}
                        {rejectionPending && <Spinner />}
                        Reject
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Do you really want to{" "}
                        {props.action === "accept" ? "accept" : "reject"} the invitation?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={() => {
                            if (props.action === "accept") {
                                acceptMutation({
                                    clientId: props.clientId,
                                    freelancerId: props.freelancerId,
                                    projectId: props.projectId,
                                    invitationId: props.invitationId,
                                });
                            } else {
                                rejectMutation(props.invitationId);
                            }
                        }}
                        className={`${
                            props.action === "accept"
                                ? "bg-[var(--my-blue)] hover:bg-[var(--my-blue-light)] cursor-pointer"
                                : "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
                        } cursor-pointer`}
                    >
                        {props.action === "accept" ? "Accept" : "Reject"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
