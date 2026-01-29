import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim()
        const password = credentials?.password

        const allowedUser = process.env.TRAINING_USER
        const allowedPass = process.env.TRAINING_PASS

        if (!allowedUser || !allowedPass) return null
        if (!username || !password) return null

        if (username === allowedUser && password === allowedPass) {
          return {
            id: "training-user",
            name: "Training User",
            email: `${username}@training.local`,
          }
        }

        return null
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },
}
