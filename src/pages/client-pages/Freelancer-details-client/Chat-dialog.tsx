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
import { Button } from "@/components/ui/button";
import { MessageCircle, SendHorizonal } from "lucide-react";
import { useState } from "react";

type PropsType = {
    showChatsDialog: boolean;
    setShowChatsDialog: React.Dispatch<React.SetStateAction<boolean>>;
    freelancerName: string;
};

export default function ChatsDialog(props: PropsType) {
    const [message, setMessage] = useState("");

    function handleSend() {}
    return (
        // <AlertDialog open={props.showChatsDialog} onOpenChange={props.setShowChatsDialog}>
        //     <AlertDialogContent>
        //         <AlertDialogHeader>
        //             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        //             <AlertDialogDescription>
        //                 Do you really want to invite this freelancer to add into your
        //                 project?
        //             </AlertDialogDescription>
        //         </AlertDialogHeader>
        //         <AlertDialogFooter>
        //             <AlertDialogCancel>Cancel</AlertDialogCancel>
        //             <AlertDialogAction className="bg-[var(--my-blue)] hover:bg-[var(--my-blue-light)] cursor-pointer">
        //                 Confirm
        //             </AlertDialogAction>
        //         </AlertDialogFooter>
        //     </AlertDialogContent>
        // </AlertDialog>

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
                    <textarea
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
                        onClick={handleSend}
                        // disabled={loading || !message.trim()}
                        className="flex items-center gap-2 bg-[var(--my-blue)] hover:bg-[var(--my-blue-light)] px-5 py-2 rounded-lg"
                    >
                        {/* {loading ? "Sending..." : "Send"} */}
                        <SendHorizonal className="w-4 h-4" />
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
