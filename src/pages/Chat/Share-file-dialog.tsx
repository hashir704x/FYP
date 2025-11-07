import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useMutation } from "@tanstack/react-query";

import { userAuthStore } from "@/store/user-auth-store";
import type { ChatFromBackendType, UserType } from "@/Types";
import { toast } from "sonner";

type PropsType = {
    openShareFileDialog: boolean;
    setOpenShareFileDialog: React.Dispatch<React.SetStateAction<boolean>>;
    targetFile: File;
    setTargetFile: React.Dispatch<React.SetStateAction<File | null>>;
};

import { Spinner } from "@/components/ui/spinner";
import { uploadChatMedia } from "@/api-functions/chat-functions";
import { chatsStore } from "@/store/chats-store";
import { Button } from "@/components/ui/button";

export default function ShareFileDialog(props: PropsType) {
    const user = userAuthStore((state) => state.user) as UserType;
    const activeChat = chatsStore((state) => state.activeChat) as ChatFromBackendType;

    const { mutate, isPending } = useMutation({
        mutationFn: uploadChatMedia,
        onSuccess: () => {
            props.setTargetFile(null);
            props.setOpenShareFileDialog(false);
            toast.success("File shared successfully!");
        },
        onError: (error) => {
            console.error("Error in uploading file", error.message);
            toast.error("Failed to upload file!");
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
                    <Button
                        variant="secondary"
                        onClick={() => {
                            props.setTargetFile(null);
                            props.setOpenShareFileDialog(false);
                        }}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="custom"
                        disabled={isPending}
                        onClick={() =>
                            mutate({
                                file: props.targetFile,
                                userId: user.userId,
                                chatId: activeChat.id,
                                senderRole: user.role,
                                freelancerId: activeChat.freelancer_id,
                                clientId: activeChat.client_id,
                            })
                        }
                    >
                        {isPending && <Spinner />} Confirm
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
