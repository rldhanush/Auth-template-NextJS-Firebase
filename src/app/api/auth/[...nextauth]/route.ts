import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { auth } from "@/firebase/clientApp";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("No credentials provided");
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );
          const user = userCredential.user;

          // Check if email is verified
          if (!user.emailVerified) {
            console.log("----- Route.ts here ----");
            throw new Error("Email not verified");
          }

          if (user) {
            return {
              id: user.uid,
              name: user.displayName ?? user.email,
              email: user.email,
            };
          }
          throw new Error("Authentication failed");
        } catch (err) {
          const errorCode = err.code;
          let message = "Authentication failed";
          
          if (err.message == "Email not verified") {
            message = "Email not verified";
          } else if (errorCode === 'auth/user-not-found') {
            message = "Email not found";
          } else if (errorCode === 'auth/wrong-password') {
            message = "Invalid credentials";
          } else if (errorCode === 'auth/invalid-email') {
            message = "Invalid email format";
          } else if (errorCode === 'auth/user-disabled') {
            message = "This account has been disabled";
          } else if (errorCode === 'auth/too-many-requests') {
            message = "Too many failed login attempts, try again later";
          }
          throw new Error(message);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user as {
          id: string;
          name: string;
          email: string;
        };
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };