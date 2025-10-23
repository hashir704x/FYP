import { Button } from "@/components/ui/button";
import { getInvitationsForProject } from "@/api-functions/project-invitations-functions";
import { useParams } from "react-router-dom";
import SendInvitationsCard from "./Send-invitations-card";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "./ui/spinner";
import { BadgeAlert } from "lucide-react";

export default function InvitedFreelancersSidebar() {
    const { projectId } = useParams();

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getInvitationsForProject(projectId as string),
        queryKey: ["get-freelancers-invitations", projectId],
    });

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="custom">View Invitations</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Invited Freelancers</SheetTitle>
                    <SheetDescription>
                        Changed your mind? Click cancel button to cancel any invitation.
                    </SheetDescription>
                </SheetHeader>

                <div className="grid flex-1  px-4 overflow-y-auto scroll-smooth">
                    {isLoading && (
                        <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                            <Spinner className="w-12 h-12 text-[var(--my-blue)]" />
                        </div>
                    )}

                    {isError && (
                        <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                            <p>Error in getting invitations!</p>
                        </div>
                    )}

                    {data && data.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center text-gray-500">
                            <div className="bg-[var(--my-blue)]/10 text-[var(--my-blue)] rounded-full p-4 mb-4">
                                <BadgeAlert size={40}/>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-700">
                                No Invitations Yet
                            </h3>
                            <p className="text-sm mt-1 text-gray-500 max-w-[240px]">
                                You haven’t invited any freelancers to this project yet.
                            </p>
                        </div>
                    )}

                    {data && data.length >= 1 && (
                        <div>
                            {data.map((item) => (
                                <SendInvitationsCard key={item.id} {...item} />
                            ))}
                        </div>
                    )}
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="custom">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
