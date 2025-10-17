import { CircleX, FilePlus, FolderKanban, HardHat, Inbox, LogOut, User } from "lucide-react";
import { userAuthStore } from "@/store/user-auth-store";
import { supabaseClient } from "@/Supabase-client";
import { Link } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/client",
        icon: Inbox,
    },
    {
        title: "All Projects",
        url: "/client/all-projects",
        icon: FolderKanban,
    },
    {
        title: "Create Project",
        url: "/client/create-project",
        icon: FilePlus,
    },
      {
        title: "My Profile",
        url: "/client/client-profile",
        icon: User,
    },
    {
        title: "View Freelancers",
        url: "/client/view-freelancers",
        icon: HardHat
    }
];

export default function ClientSidebar() {
    const { toggleSidebar } = useSidebar();
    const resetUser = userAuthStore((state) => state.reset);

    async function handleLogout() {
        resetUser();
        await supabaseClient.auth.signOut();
    }

    return (
        <div className="dark">
            <Sidebar>
                <SidebarHeader>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-xl">Freelansync</span>{" "}
                        <CircleX className="md:hidden" onClick={toggleSidebar} />
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Application</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link to={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="py-4 px-6">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 font-semibold cursor-pointer text-sm"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </SidebarFooter>
            </Sidebar>
        </div>
    );
}
