import { hashPassword } from "@/lib/crypto";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, username } = body;

    if (!email || !password || !username) {
      return NextResponse.json(
        "Missing fields email/username/password are required",
        { status: 400 }
      );
    }

    const existingUserEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUserEmail) {
      return NextResponse.json("User with this email already exists", {
        status: 409,
      });
    }

    const existingUserUsername = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (existingUserUsername) {
      return NextResponse.json("User with this username already exists", {
        status: 409,
      });
    }

    const newUser = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashPassword(password),
      },
    });
    const { password: newPass, ...rest } = newUser;
    return NextResponse.json({ user: rest }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
