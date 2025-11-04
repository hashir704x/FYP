import { userAuthStore } from "@/store/user-auth-store";
import { Navigate, Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import ClientSidebar from "@/layouts/Client-layout/Client-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ChatsHandlerComponent from "@/components/Chats-handler-component";

const ClientLayoutPage = () => {
    const user = userAuthStore((state) => state.user);
    if (!user) return <Navigate to="/login" />;
    else if (user.role === "freelancer") return <Navigate to="/freelancer" />;
    return (
        <div>
            <ChatsHandlerComponent />
            <SidebarProvider>
                <ClientSidebar />
                <div className="w-full relative">
                    <div className="absolute top-5 left-2">
                        <SidebarTrigger className="md:hidden" />
                    </div>
                    <Outlet />
                </div>
            </SidebarProvider>
        </div>
    );
};

export default ClientLayoutPage;
