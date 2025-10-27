import { createChatAndInsertMessage } from "@/api-functions/chat-functions";

import {
    AlertDialog,
    // AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { MessageCircle, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

type PropsType = {
    showChatsDialog: boolean;
    setShowChatsDialog: React.Dispatch<React.SetStateAction<boolean>>;
    freelancerName: string;
    freelancerId: string;
    clientId: string;
};

export default function ChatsDialog(props: PropsType) {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const { mutate, isPending } = useMutation({
        mutationFn: createChatAndInsertMessage,
        onSuccess: (chatId) => {
            console.log("Chat created successfully", chatId);
            navigate(`/client/chats?${chatId}`);
        },
        onError: (error) => {
            console.error("Error in creating chat and message", error.message);
        },
    });

    return (
        <AlertDialog open={props.showChatsDialog} onOpenChange={props.setShowChatsDialog}>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-[var(--my-blue)]">
                        <MessageCircle className="w-5 h-5" />
                        Message {props.freelancerName}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Write your message below and send it directly to the freelancer.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="mt-3">
                    <Textarea
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[100px] resize-none border-gray-200 focus-visible:ring-[var(--my-blue)]"
                    />
                </div>

                <AlertDialogFooter className="flex justify-between mt-5">
                    <AlertDialogCancel className="rounded-lg px-5 py-2">
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        onClick={() =>
                            mutate({
                                message: message,
                                senderId: props.clientId,
                                receiverId: props.freelancerId,
                            })
                        }
                        disabled={isPending || !message.trim()}
                        className="flex items-center gap-2 bg-[var(--my-blue)] hover:bg-[var(--my-blue-light)] px-5 py-2 rounded-lg"
                    >
                        {isPending ? <Spinner /> : <SendHorizonal className="w-4 h-4" />}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
