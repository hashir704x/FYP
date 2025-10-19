import { Button } from "@/components/ui/button";
import { getFreelancerInvitationsForProject } from "@/api-functions/project-invitations-functions";
import { useParams } from "react-router-dom";
import InvitationsCard from "./Invitations-card";

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

export default function InvitedFreelancersSidebar() {
    const { projectId } = useParams();

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getFreelancerInvitationsForProject(projectId as string),
        queryKey: ["get-freelancers-invitations"],
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
                        Make changes to your profile here. Click save when you&apos;re
                        done.
                    </SheetDescription>
                </SheetHeader>

                <div className="grid flex-1 auto-rows-min gap-6 px-4 overflow-y-auto scroll-smooth">
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

                    {data && data.length === 0 && <div></div>}

                    {data && data.length >= 1 && (
                        <div>
                            {data.map((item) => (
                                <InvitationsCard key={item.id} {...item} />
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
