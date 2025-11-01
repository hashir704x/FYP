import { userAuthStore } from "@/store/user-auth-store";
import { Navigate, Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import FreelancerSidebar from "@/layouts/Freelancer-layout/Freelancer-sidebar";
import ChatGlobalListener from "@/pages/Chat/Chat-global-listener";
import { SidebarTrigger } from "@/components/ui/sidebar";

const FreelancerLayoutPage = () => {
    const user = userAuthStore((state) => state.user);
    if (!user) return <Navigate to="/login" />;
    else if (user.role === "client") return <Navigate to="/client" />;
    return (
        <div>
            <ChatGlobalListener />
            <SidebarProvider>
                <FreelancerSidebar />
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

export default FreelancerLayoutPage;
