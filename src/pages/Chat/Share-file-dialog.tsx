import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useMutation } from "@tanstack/react-query";

import { userAuthStore } from "@/store/user-auth-store";
import type { UserType } from "@/Types";
// import { toast } from "sonner";

type PropsType = {
    openShareFileDialog: boolean;
    setOpenShareFileDialog: React.Dispatch<React.SetStateAction<boolean>>;
    targetFile: File;
    setTargetFile: React.Dispatch<React.SetStateAction<File | null>>;
};

// import { Spinner } from "@/components/ui/spinner";
import { uploadChatMedia } from "@/api-functions/chat-functions";

export default function ShareFileDialog(props: PropsType) {
    const user = userAuthStore((state) => state.user) as UserType;

    const { mutate, isPending } = useMutation({
        mutationFn: uploadChatMedia,
        onSuccess: (data) => {
            console.log("done", data);
            props.setTargetFile(null);
        },
    });

    return (
        <AlertDialog
            open={props.openShareFileDialog}
            onOpenChange={props.setOpenShareFileDialog}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Do you really want to share this file?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isPending}
                        onClick={() =>
                            mutate({
                                file: props.targetFile,
                                userId: user.userId,
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
