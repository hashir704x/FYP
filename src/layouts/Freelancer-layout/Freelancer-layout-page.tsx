import { userAuthStore } from "@/store/user-auth-store";
import { Navigate, Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import FreelancerSidebar from "@/layouts/Freelancer-layout/Freelancer-sidebar";

const FreelancerLayoutPage = () => {
    const user = userAuthStore((state) => state.user);
    if (!user) return <Navigate to="/login" />;
    else if (user.role === "client") return <Navigate to="/client" />;
    return (
        <div>
            <SidebarProvider>
                <FreelancerSidebar />
                <div className="w-full">
                    <Outlet />
                </div>
            </SidebarProvider>
        </div>
    );
};

export default FreelancerLayoutPage;
