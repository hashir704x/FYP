import {
    CircleX,
    FolderKanban,
    Inbox,
    LogOut,
    MailQuestionMark,
    MessageCircleMore,
    User,
} from "lucide-react";
import { userAuthStore } from "@/store/user-auth-store";
import { supabaseClient } from "@/Supabase-client";
import { chatsStore } from "@/store/chats-store";
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
import { useQueryClient } from "@tanstack/react-query";

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/freelancer",
        icon: Inbox,
    },
    {
        title: "My Profile",
        url: "/freelancer/freelancer-profile",
        icon: User,
    },
    {
        title: "My Projects",
        url: "/freelancer/freelancer-projects",
        icon: FolderKanban,
    },
    {
        title: "Invitations",
        url: "/freelancer/freelancer-invites",
        icon: MailQuestionMark,
    },
    {
        title: "Messages",
        url: "/freelancer/chats",
        icon: MessageCircleMore,
    },
];

export default function FreelancerSidebar() {
    const { toggleSidebar } = useSidebar();
    const resetUser = userAuthStore((state) => state.reset);
    const clearChatsData = chatsStore((state) => state.clearChatsData);
    const unreadChatsIds = chatsStore((state) => state.unreadChatsIds);

    const queryClient = useQueryClient();

    async function handleLogout() {
        resetUser();
        clearChatsData();
        await supabaseClient.auth.signOut();
        queryClient.clear();
    }

    return (
        <div className="dark">
            <Sidebar className="border-none">
                <SidebarHeader>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-xl">
                            Freelansync
                        </span>{" "}
                        <CircleX
                            className="md:hidden"
                            onClick={toggleSidebar}
                        />
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
                                                <span>
                                                    {item.title}{" "}
                                                    {item.title ===
                                                        "Messages" &&
                                                        unreadChatsIds.length >
                                                            0 && (
                                                            <span className="font-bold">
                                                                (
                                                                {
                                                                    unreadChatsIds.length
                                                                }
                                                                )
                                                            </span>
                                                        )}
                                                </span>
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
