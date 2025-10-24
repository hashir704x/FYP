import { getInvitationsForFreelancer } from "@/api-functions/project-invitations-functions";
import { useQuery } from "@tanstack/react-query";
import { userAuthStore } from "@/store/user-auth-store";
import type { UserType } from "@/Types";
import { Spinner } from "@/components/ui/spinner";
import FreelancerInvitationCard from "./Freelancer-invitation-card";

const FreelancerInvitesPage = () => {
    const user = userAuthStore((state) => state.user) as UserType;

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getInvitationsForFreelancer(user.userId),
        queryKey: ["get-invitations-for-freelancer"],
    });

    return (
        <div>
            <h1 className="text-3xl font-semibold h-[70px] px-4 border-b flex items-center">
                Invitations
            </h1>

            {isLoading && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <Spinner className="w-12 h-12 text-[var(--my-blue)]" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting invitations data</p>
                </div>
            )}

            {data && data.length === 0 && <div>You have no invitations</div>}

            {data && data.length >= 1 && (
                <div className="py-6 px-4 flex flex-col items-center gap-6">
                    {data.map((item) => (
                        <FreelancerInvitationCard key={item.id} {...item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FreelancerInvitesPage;
