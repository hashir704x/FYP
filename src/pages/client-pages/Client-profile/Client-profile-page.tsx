import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getClientOwnDataById,
    updateClientProfileImage,
} from "@/api-functions/client-functions";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { userAuthStore } from "@/store/user-auth-store";
import type { UserType } from "@/Types";
import { toast } from "sonner";

const ClientProfilePage = () => {
    const queryClient = useQueryClient();
    const user = userAuthStore((state) => state.user) as UserType;
    const setUser = userAuthStore((state) => state.setUser);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getClientOwnDataById(user.userId),
        queryKey: ["get-client-profile-data"],
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (file: File) => updateClientProfileImage(file, user.userId),
        onSuccess: (newUrl) => {
            setUser({ ...user, profile_pic: newUrl });
            queryClient.invalidateQueries({
                queryKey: ["get-client-profile-data"],
            });
            setSelectedFile(null);
            toast.success("Image updated successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        console.log("File changed");
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
    }

    return (
        <div>
            <h1 className="text-3xl font-semibold h-[70px] px-4 border-b flex justify-center md:justify-start items-center">
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
                <div className="flex justify-center items-center px-4 py-6">
                    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-10">
                        {/* Left Section — Profile Picture */}
                        <div className="flex flex-col items-center w-full md:w-1/3 text-center">
                            <label
                                htmlFor="profilePicInput"
                                className="relative cursor-pointer inline-block group"
                            >
                                <img
                                    src={preview || data.profile_pic}
                                    alt="profile-img"
                                    className="w-44 h-44 rounded-full object-cover border border-gray-200 shadow-sm"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                    <span className="text-white text-sm font-medium">
                                        Change image
                                    </span>
                                </div>
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                id="profilePicInput"
                                onChange={handleFileChange}
                                hidden
                                disabled={isPending}
                            />

                            {selectedFile && (
                                <Button
                                    disabled={isPending}
                                    onClick={() => mutate(selectedFile)}
                                    variant="custom"
                                    className="mt-4"
                                >
                                    {isPending && <Spinner />} Confirm change
                                </Button>
                            )}
                        </div>

                        {/* Right Section — Client Info */}
                        <div className="flex-1 w-full space-y-6 text-gray-700">
                            <h2 className="text-2xl font-semibold text-[var(--my-blue)] border-b pb-2">
                                Client Profile
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
                                    <p className="text-sm text-gray-500">
                                        Username
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {data.username}
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
                                    <p className="text-sm text-gray-500">
                                        Email
                                    </p>
                                    <p className="text-lg font-semibold break-all">
                                        {data.email}
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
                                    <p className="text-sm text-gray-500">
                                        Role
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {data.role}
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
                                    <p className="text-sm text-gray-500">
                                        Wallet Balance
                                    </p>
                                    <p className="text-lg font-semibold text-green-600">
                                        Rs {data.wallet_amount}
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm sm:col-span-2">
                                    <p className="text-sm text-gray-500">
                                        Account Created On
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {new Date(
                                            data.created_at,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientProfilePage;
