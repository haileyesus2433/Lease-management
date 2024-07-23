import { UserSchema } from "@/lib/validations";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
  }
  interface Session {
    user: {
      id: string;
      username: string;
    };
    token: {
      id: string;
      username: string;
    };
  }
}
