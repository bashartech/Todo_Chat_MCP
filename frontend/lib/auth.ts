import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {schema} from "../db/schema"
import { nextCookies } from "better-auth/next-js";
import { db } from "../db/drizzle"; // your drizzle instance
// Configure Better Auth with JWT token issuance

export const auth = betterAuth({

  socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },

  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: false, // Set to true in production
  },
  
  database: drizzleAdapter(db, {
        provider: "pg", 
        schema
    }),
  secret: process.env.NEXT_PUBLIC_BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET || "e8QDSIu8QZtOENR8tRcsdwYMmwC4Uom0",
  plugins: [
    jwt({}),
    nextCookies() // Enable JWT token issuance
  ],
});

