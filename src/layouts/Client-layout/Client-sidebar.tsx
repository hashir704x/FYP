import {
    CircleX,
    FilePlus,
    FolderKanban,
    HardHat,
    Inbox,
    LogOut,
    MessageCircleMore,
    User,
} from "lucide-react";
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
import { useQueryClient } from "@tanstack/react-query";
import { chatsStore } from "@/store/chats-store";
import { useIsMobile } from "@/hooks/use-mobile";

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
        icon: HardHat,
    },
    {
        title: "Messages",
        url: "/client/chats",
        icon: MessageCircleMore,
    },
];

export default function ClientSidebar() {
    const isMobile = useIsMobile();
    const { toggleSidebar } = useSidebar();
    const resetUser = userAuthStore((state) => state.reset);
    const clearChatsData = chatsStore((state) => state.clearChatsData);
    const unreadChatsIds = chatsStore((state) => state.unreadChatsIds);
    const setActiveChat = chatsStore((state) => state.setActiveChat);

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
                                            {item.title !== "Messages" ? (
                                                <Link
                                                    to={item.url}
                                                    onClick={() => {
                                                        if (isMobile)
                                                            toggleSidebar();
                                                    }}
                                                >
                                                    <item.icon />{" "}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ) : (
                                                <Link
                                                    to={item.url}
                                                    onClick={() => {
                                                        setActiveChat(null);
                                                        if (isMobile)
                                                            toggleSidebar();
                                                    }}
                                                >
                                                    <item.icon />
                                                    {item.title}
                                                    {unreadChatsIds.length >
                                                        0 && (
                                                        <span className="font-bold">
                                                            (
                                                            {
                                                                unreadChatsIds.length
                                                            }
                                                            )
                                                        </span>
                                                    )}
                                                </Link>
                                            )}
                                            {/*<Link
                                                to={item.url}
                                                onClick={() => {
                                                    if (isMobile)
                                                        toggleSidebar();
                                                }}
                                            >
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
                                            </Link>*/}
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
