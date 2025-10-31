import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getFreelancerDataById } from "@/api-functions/freelancer-functions";
import { Spinner } from "@/components/ui/spinner";
import { Briefcase, MessageCircleMore, Sparkles } from "lucide-react";
import ShowProjectsForInvitationsSidebar from "@/pages/client-pages/Freelancer-details-client/Show-projects-for-invitations-sidebar";
import { Button } from "@/components/ui/button";
import { getChatsForUser } from "@/api-functions/chat-functions";
import { userAuthStore } from "@/store/user-auth-store";
import type { UserType } from "@/Types";
import { toast } from "sonner";
import { useState } from "react";
import ChatsDialog from "./Chat-dialog";

const FreelancerDetailsClientPage = () => {
    const { freelancerId } = useParams();
    const navigate = useNavigate();
    const user = userAuthStore((state) => state.user) as UserType;
    const [showChatsDialog, setShowChatsDialog] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getFreelancerDataById(freelancerId as string),
        queryKey: ["get-freelancer-details", freelancerId],
    });

    const { mutate, isPending } = useMutation({
        mutationFn: getChatsForUser,
        onSuccess: (data) => {
            const chatFound = data.find(
                (chat) => chat.freelancer_id === freelancerId,
            );
            console.log("chats", data);
            if (chatFound) navigate(`/client/chats?${chatFound.id}`);
            else {
                console.log("pop up time");
                setShowChatsDialog(true);
            }
        },
        onError: (error) => {
            toast.error("Something went wrong, Cannot get chats data");
            console.error(error.message);
        },
    });

    return (
        <div>
            <h1 className="text-3xl font-semibold h-[70px] px-4 border-b justify-center md:justify-start flex items-center">
                Freelancer Detials
            </h1>

            {isLoading && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <Spinner className="w-12 h-12 text-[var(--my-blue)]" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting Freelancer detailed data</p>
                </div>
            )}

            {data && (
                <div className="px-6 py-8 max-w-5xl mx-auto">
                    <ChatsDialog
                        showChatsDialog={showChatsDialog}
                        setShowChatsDialog={setShowChatsDialog}
                        freelancerName={data.username}
                        clientId={user.userId}
                        freelancerId={freelancerId as string}
                    />

                    <div className="flex flex-col sm:flex-row items-center gap-8 border-b border-gray-200 pb-8">
                        <img
                            src={data.profile_pic}
                            alt={`${data.username} profile`}
                            className="w-40 h-40 rounded-full object-cover shadow-md border-4 border-indigo-100"
                        />
                        <div className="flex-1">
                            <div className="flex items-center justify-between flex-col md:flex-row">
                                <h1 className="text-4xl font-semibold text-gray-900">
                                    {data.username}
                                </h1>

                                <div className="mt-2 flex flex-col items-center gap-3">
                                    <ShowProjectsForInvitationsSidebar />

                                    <Button
                                        disabled={isPending}
                                        onClick={() =>
                                            mutate({
                                                userId: user.userId,
                                                userRole: user.role,
                                                getDetails: false,
                                            })
                                        }
                                        variant="custom"
                                        className="w-full"
                                    >
                                        <MessageCircleMore />
                                        Send message
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <section className="mt-8">
                        <div className="flex items-center gap-2 mb-3">
                            <Briefcase className="w-6 h-6 text-purple-500" />
                            <h2 className="text-2xl font-semibold text-gray-900">
                                About
                            </h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            {data.description}
                        </p>
                    </section>

                    {/* Skills Section */}
                    <section className="mt-10">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-6 h-6 text-amber-500" />
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Skills
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-2">
                            {data.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full border border-indigo-100"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default FreelancerDetailsClientPage;
