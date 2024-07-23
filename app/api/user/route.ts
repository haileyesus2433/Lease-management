import { hashPassword } from "@/lib/crypto";
import prisma from "@/lib/db";
import { UserSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, username } = UserSchema.parse(body);

    if (!email || !password || !username) {
      return NextResponse.json(
        {
          user: null,
          message: "Missing fields email/username/password are required",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUserEmail) {
      return NextResponse.json(
        { user: null, message: "User with this username already exists" },
        {
          status: 409,
        }
      );
    }

    const existingUserUsername = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (existingUserUsername) {
      return NextResponse.json(
        { user: null, message: "User with this username already exists" },
        {
          status: 409,
        }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashPassword(password),
      },
    });
    const { password: newPass, ...rest } = newUser;
    return NextResponse.json(
      { user: rest, message: "Signed up Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong", error: error },
      { status: 500 }
    );
  }
}
