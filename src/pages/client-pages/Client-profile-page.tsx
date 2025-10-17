import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getClientProfileData,
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
        queryFn: getClientProfileData,
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
                <div className="mt-4 flex flex-col items-center bg-white rounded-2xl shadow-md p-6 w-full max-w-sm mx-auto border border-gray-100">
                    <div className="text-center flex flex-col items-center">
                        <label
                            htmlFor="profilePicInput"
                            className="relative cursor-pointer inline-block group"
                        >
                            <img
                                src={preview || data.profile_pic}
                                alt="profile-img"
                                className="w-32 h-32 rounded-full object-cover "
                            />

                            {/* Hover overlay */}
                            <div
                                className="absolute inset-0 flex items-center justify-center bg-black/50 
                       opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                            >
                                <span className="text-white text-sm font-medium">
                                    Change image
                                </span>
                            </div>
                        </label>

                        {/* hidden file input */}
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
                                className="mt-3"
                            >
                                {isPending && <Spinner />} Confirm change
                            </Button>
                        )}
                    </div>

                    <div className="mt-6 space-y-3 text-gray-700 w-full">
                        <p className="flex justify-between border-b pb-1">
                            <span className="font-semibold text-gray-500">Username:</span>
                            <span className="font-medium">{data.username}</span>
                        </p>

                        <p className="flex justify-between border-b pb-1">
                            <span className="font-semibold text-gray-500">Email:</span>
                            <span className="font-medium">{data.email}</span>
                        </p>

                        <p className="flex justify-between border-b pb-1">
                            <span className="font-semibold text-gray-500">Role:</span>
                            <span className="font-medium">{data.role}</span>
                        </p>

                        <p className="flex justify-between border-b pb-1">
                            <span className="font-semibold text-gray-500">Wallet:</span>
                            <span className="font-medium text-green-600">
                                Rs {data.wallet_amount}
                            </span>
                        </p>

                        <p className="flex justify-between">
                            <span className="font-semibold text-gray-500">
                                Created on:
                            </span>
                            <span className="font-medium">
                                {new Date(data.created_at).toLocaleDateString()}
                            </span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientProfilePage;
