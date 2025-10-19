import { sendInvitation } from "@/api-functions/project-invitations-functions";
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
import { useParams } from "react-router-dom";
import { userAuthStore } from "@/store/user-auth-store";
import type { UserType } from "@/Types";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type PropsType = {
    freelancerId: string;
};

export default function AddFreelancerConfirmDialog(props: PropsType) {
    const { projectId } = useParams();

    const queryClient = useQueryClient();

    const user = userAuthStore((state) => state.user) as UserType;

    const { mutate } = useMutation({
        mutationFn: sendInvitation,
        onSuccess: () => {
            toast.success("Invitation send successfully");
            queryClient.invalidateQueries({
                queryKey: ["get-freelancers-invitations"],
            });
        },

        onError: (error) => {
            console.error(error.message);
            if (error.message.includes("duplicate") || error.message.includes("unique")) {
                toast.warning("Freelancer is already invited");
            } else toast.error("Failed to send invitation");
        },
    });

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    className="bg-white text-[var(--my-blue)] border border-[var(--my-blue)]  
               transition-all duration-300 
               hover:bg-[var(--my-blue)] hover:text-white"
                >
                    Invite Freelancer
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Do you really want to invite this freelancer to add into your
                        project?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() =>
                            mutate({
                                projectId: projectId as string,
                                clientId: user.userId,
                                freelancerId: props.freelancerId,
                            })
                        }
                        className="bg-[var(--my-blue)] hover:bg-[var(--my-blue-light)] cursor-pointer"
                    >
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
