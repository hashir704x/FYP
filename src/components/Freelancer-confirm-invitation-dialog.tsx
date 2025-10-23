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
    projectId: string;
    action: "accept" | "reject"
};

import { Spinner } from "./ui/spinner";

export default function FreelancerConfirmInvitationDialog(props: PropsType) {

    const queryClient = useQueryClient();

    // const { mutate, isPending } = useMutation({
    //     mutationFn: sendInvitation,
    //     onSuccess: () => {
    //         toast.success("Invitation send successfully");
    //         queryClient.invalidateQueries({
    //             queryKey: ["get-freelancers-invitations"],
    //         });
    //     },

    //     onError: (error) => {
    //         console.error(error.message);
    //         if (error.message.includes("duplicate") || error.message.includes("unique")) {
    //             toast.warning("Freelancer is already invited");
    //         } else toast.error("Failed to send invitation");
    //     },
    // });

    const isPending = false;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="custom" disabled={isPending} className="mt-3">
                    {" "}
                    {isPending && <Spinner />}
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
                        // onClick={() =>
                        //     mutate({
                        //         projectId:
                        //             (props.projectId as string) || (projectId as string),
                        //         clientId: user.userId,
                        //         freelancerId:
                        //             (props.freelancerId as string) ||
                        //             (freelancerId as string),
                        //     })
                        // }
                        className="bg-[var(--my-blue)] hover:bg-[var(--my-blue-light)] cursor-pointer"
                    >
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
