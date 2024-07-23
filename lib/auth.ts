import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./db";
import { SHA256 as sha256 } from "crypto-js";
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@email.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existingUser = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });
        console.log(existingUser?.password, "EXISTING USER PASSWORD");
        if (!existingUser) {
          return null;
        }

        if (sha256(credentials.password).toString() !== existingUser.password) {
          return null;
        }

        return {
          id: existingUser?.id,
          email: existingUser?.email,
          username: existingUser?.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          username: user?.username,
        };
      }
      return token;
    },
    async session({ token, session, user }) {
      return {
        ...session,
        user: { ...user, username: token.username, id: token.id },
      };
    },
  },
};
