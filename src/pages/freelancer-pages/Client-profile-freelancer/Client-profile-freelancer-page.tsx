import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "react-router-dom";
import { getClientDataById } from "@/api-functions/client-functions";

const ClientProfileFreelancerPage = () => {
    const { clientId } = useParams();

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getClientDataById(clientId as string),
        queryKey: ["get-client-profile-data"],
    });

    return (
        <div>
            <h1 className="text-3xl font-semibold h-[70px] px-4 border-b flex justify-center md:justify-start items-center">
                Client Profile
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
                <div className="flex justify-center items-center px-4 py-6">
                    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-10">
                        {/* Left Section — Profile Picture */}
                        <div className="flex flex-col items-center w-full md:w-1/3 text-center">
                            <img
                                src={data.profile_pic}
                                alt="profile-img"
                                className="w-44 h-44 rounded-full object-cover border border-gray-200 shadow-sm"
                            />
                        </div>

                        {/* Right Section — Client Info */}
                        <div className="flex-1 w-full space-y-6 text-gray-700">
                            <h2 className="text-2xl font-semibold text-[var(--my-blue)] border-b pb-2">
                                Client Profile
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
                                    <p className="text-sm text-gray-500">Username</p>
                                    <p className="text-lg font-semibold">
                                        {data.username}
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
                                    <p className="text-sm text-gray-500">Role</p>
                                    <p className="text-lg font-semibold">{data.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientProfileFreelancerPage;
