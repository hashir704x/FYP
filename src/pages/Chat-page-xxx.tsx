// import { useEffect, useState } from "react";

// import { supabaseClient } from "@/Supabase-client";
// import { userAuthStore } from "@/store/user-auth-store";
// import type { UserType } from "@/Types";

// const ChatPage = () => {
//     const user = userAuthStore((state) => state.user) as UserType;
//     const [messages, setMessages] = useState<any[]>([]);
//     const [newMessage, setNewMessage] = useState("");

//     const chatWithId =
//         user.role === "client"
//             ? "1f7309f8-2cc1-4ddd-a02c-32755c7c7c9c" // freelancer ID
//             : "836d7c11-1369-4a25-9f2d-becc15ab4b94"; // client ID (currentUser for testing)

//     useEffect(() => {
//         (async function () {
//             const { data, error } = await supabaseClient
//                 .from("chats")
//                 .select("*")
//                 .or(
//                     `and(sender_id.eq.${user.userId},receiver_id.eq.${chatWithId}),and(sender_id.eq.${chatWithId},receiver_id.eq.${user.userId})`
//                 )

//                 .order("created_at", { ascending: true });

//             console.log("chats data:", data);

//             if (error) {
//                 console.error("Error occrred in fetching chats", error.message);
//             } else setMessages(data);
//         })();

//         // channel code
//         const channel = supabaseClient
//             .channel("realtime-chat")
//             .on(
//                 "postgres_changes",
//                 { event: "INSERT", schema: "public", table: "chats" },
//                 (payload) => {
//                     console.log("New message received:", payload.new);
//                     setMessages((prev) => [...prev, payload.new]);
//                 }
//             )
//             .subscribe();
//         return () => {
//             supabaseClient.removeChannel(channel);
//         };
//     }, []);

//     async function handleSend() {
//         if (!newMessage.trim()) return;

//         const { error } = await supabaseClient.from("chats").insert([
//             {
//                 sender_id: user.userId,
//                 receiver_id: chatWithId,
//                 message: newMessage,
//             },
//         ]);

//         if (error) {
//             console.error("Error sending message:", error.message);
//         } else {
//             setNewMessage(""); // clear input
//         }
//     }

//     return (
//         <div>
//             <h1>Chat page</h1>

//             <div>
//                 {messages.map((item) => (
//                     <div key={item.id}>
//                         <b>{item.sender_id === user.userId ? "You" : "Other"}</b>

//                         {item.message}
//                     </div>
//                 ))}
//             </div>

//             <div className="flex gap-2 mt-4">
//                 <input
//                     type="text"
//                     className="border p-2 flex-1 rounded"
//                     placeholder="Type a message..."
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                 />
//                 <button
//                     onClick={handleSend}
//                     className="bg-blue-600 text-white px-4 py-2 rounded"
//                 >
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default ChatPage;

const ChatPage = () => {
    return <div>ChatPage</div>;
};

export default ChatPage;
