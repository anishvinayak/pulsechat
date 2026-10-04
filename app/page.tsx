import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const firstRoom = await db.room.findFirst({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (firstRoom) {
    redirect(`/rooms/${firstRoom.id}`);
  }

  redirect("/rooms/new");
}