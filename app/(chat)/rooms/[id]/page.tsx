import Sidebar from "@/components/Sidebar";
import ChatHeader from "@/components/ChatHeader";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Sidebar currentRoomId={id} />

      <main className="flex-1 flex flex-col bg-zinc-950 text-white">
        <ChatHeader roomId={id} />

        <MessageList roomId={id} />

        <MessageInput roomId={id} />
      </main>
    </>
  );
}