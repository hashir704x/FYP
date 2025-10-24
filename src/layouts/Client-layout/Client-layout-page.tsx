import { userAuthStore } from "@/store/user-auth-store";
import { Navigate, Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import ClientSidebar from "@/layouts/Client-layout/Client-sidebar";

const ClientLayoutPage = () => {
    const user = userAuthStore((state) => state.user);
    if (!user) return <Navigate to="/login" />;
    else if (user.role === "freelancer") return <Navigate to="/freelancer" />;
    return (
        <div>
            <SidebarProvider>
                <ClientSidebar />
                <div className="w-full">
                    <Outlet />
                </div>
            </SidebarProvider>
        </div>
    );
};

export default ClientLayoutPage;
