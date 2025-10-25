import { getAllProjectsForClient } from "@/api-functions/project-functions";
import { useQuery } from "@tanstack/react-query";

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
import { Button } from "../../../components/ui/button";
import { Spinner } from "../../../components/ui/spinner";
import { BadgeAlert } from "lucide-react";

import ShowProjectsForInvitationsCard from "./Show-projects-for-invitations-card";

const ShowProjectsForInvitationsSidebar = () => {
    const { data, isLoading, isError } = useQuery({
        queryFn: getAllProjectsForClient,
        queryKey: ["get-all-projects-for-client"],
    });

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="custom">Invite Freelancer</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Your Projects</SheetTitle>
                    <SheetDescription>
                        Select the project you want to invite this freelancer for.
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
                            <p>Error in getting projects!</p>
                        </div>
                    )}

                    {data && data.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center text-gray-500">
                            <div className="bg-[var(--my-blue)]/10 text-[var(--my-blue)] rounded-full p-4 mb-4">
                                <BadgeAlert size={40} />
                            </div>

                            <h3 className="text-lg font-semibold text-gray-700">
                                No Project created yet
                            </h3>
                            <p className="text-sm mt-1 text-gray-500 max-w-[240px]">
                                You have not invited any freelancers to this project yet.
                            </p>
                        </div>
                    )}

                    {data && data.length >= 1 && (
                        <div className="flex flex-col gap-5">
                            {data.map((item) => (
                                <ShowProjectsForInvitationsCard
                                    key={item.project_id}
                                    {...item}
                                />
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
};

export default ShowProjectsForInvitationsSidebar;
