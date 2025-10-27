// import { useEffect, useState } from "react";
// import { supabaseClient } from "@/Supabase-client";
// import { userAuthStore } from "@/store/user-auth-store";
// import type { UserType } from "@/Types";

// async function getOtherUserInfo(userId: string) {
//     const { data: roleData, error: roleError } = await supabaseClient
//         .from("user_roles")
//         .select("role")
//         .eq("id", userId)
//         .single();
//     if (roleError) throw new Error(roleError.message);

//     if (roleData.role === "freelancer") {
//         const { data: freelancerData, error: freelancerError } = await supabaseClient
//             .from("freelancers")
//             .select("username, profile_pic")
//             .eq("id", userId)
//             .single();
//         if (freelancerError) throw new Error(freelancerError.message);

//         return {
//             username: freelancerData.username,
//             profile_pic: freelancerData.profile_pic,
//         };
//     } else if (roleData.role === "client") {
//         const { data: clientData, error: clientError } = await supabaseClient
//             .from("clients")
//             .select("username, profile_pic")
//             .eq("id", userId)
//             .single();
//         if (clientError) throw new Error(clientError.message);

//         return {
//             username: clientData.username,
//             profile_pic: clientData.profile_pic,
//         };
//     } else throw new Error("something went wrong");
// }

// type ChatType = {
//     id: string;
//     created_at: string;
//     user_1: { id: string };
//     user_2: { id: string };
//     otherUserUsername?: string;
//     otherUserProfilePic?: string;
// };

// const ChatPage = () => {
//     const user = userAuthStore((state) => state.user) as UserType;
//     const [chats, setChats] = useState<ChatType[]>([]);

//     useEffect(() => {
//         (async function () {
//             try {
//                 const { data, error } = await supabaseClient
//                     .from("chats")
//                     .select("*")
//                     .or(`user_1.eq.${user.userId},user_2.eq.${user.userId}`)
//                     .order("created_at", { ascending: true });

//                 if (error) throw new Error(error.message);

//                 const chatWithOthersUsers = await Promise.all(
//                     data.map(async (chat) => {
//                         const otherUserId =
//                             chat.user_1 === user.userId ? chat.user_2 : chat.user_1;
//                         const otherUser = await getOtherUserInfo(otherUserId);
//                         return {
//                             ...chat,
//                             otherUserUsername: otherUser.username,
//                             otherUserProfilePic: otherUser.profile_pic,
//                         };
//                     })
//                 );
//                 setChats(chatWithOthersUsers);
//                 console.log(chatWithOthersUsers);
//             } catch (err: any) {
//                 console.error("Error in fetching chats data:", err.message);
//                 alert("Error in fetching chats data");
//             }
//         })();
//     }, []);

//     return <div>ChatPage</div>;
// };

// export default ChatPage;

const ChatPage = () => {
    return <div>ChatPage</div>;
};

export default ChatPage;
