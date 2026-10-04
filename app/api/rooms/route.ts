import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  type: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const room = await db.room.create({
      data: {
        name: data.name,
        type: data.type,
        members: {
          create: {
            userId: session.user.id,
          },
        },
      },
    });

    return Response.json(room, { status: 201 });
  } catch (error) {
    console.error("Create room error:", error);
    return Response.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rooms = await db.room.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      _count: {
        select: {
          members: true,
        },
      },
    },
  });

  return Response.json(rooms);
}