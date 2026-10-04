export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-zinc-950 text-white flex">
      {children}
    </div>
  );
}