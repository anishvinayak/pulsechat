import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(4),
  email: z.email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const exists = await db.user.findUnique({
      where: { email: data.email },
    });

    if (exists) {
      return Response.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(data.password, 10);

    await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
      },
    });

    return Response.json({ message: "User created" }, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }
}