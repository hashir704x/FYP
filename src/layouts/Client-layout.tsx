import { Outlet } from "react-router-dom";
import { userAuthStore } from "@/store/user-auth-store";
import { Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import ClientSidebar from "@/components/Client-sidebar";

const ClientLayout = () => {
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

export default ClientLayout;
