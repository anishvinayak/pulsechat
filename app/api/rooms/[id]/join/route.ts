import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await db.roomMember.create({
      data: {
        roomId: id,
        userId: session.user.id,
      },
    });

    return Response.json({ message: "Joined room" });
  } catch (error) {
    console.error("Join room error:", error);

    return Response.json(
      { error: "Already joined or room not found" },
      { status: 400 }
    );
  }
}