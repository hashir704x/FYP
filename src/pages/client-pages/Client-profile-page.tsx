import DummyProfileImage from "@/assets/user.png";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getClientProfileData } from "@/api-functions/client-profile-functions";
import { Spinner } from "@/components/ui/spinner";

const ClientProfilePage = () => {
    const { data, isLoading, isError } = useQuery({
        queryFn: getClientProfileData,
        queryKey: ["get-client-profile-data"],
    });

    return (
        <div>
            <h1 className="text-3xl font-semibold h-[70px] px-4 border-b flex items-center">
                My Profile
            </h1>

            {isLoading && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <Spinner className="w-12 h-12 text-[var(--my-blue)]" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting projects data</p>
                </div>
            )}

            {data && (
                <div>
                    <div className="flex flex-col items-center">
                        <div className="text-center">
                            <img
                                src={DummyProfileImage}
                                alt="profile-img"
                                className="w-[150px]"
                            />
                            <Button variant="custom" className="mt-2">
                                Change Image
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientProfilePage;
