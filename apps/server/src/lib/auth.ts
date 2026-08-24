import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {prisma} from "./db.js"
import { expo } from "@better-auth/expo"

const clientURL = process.env.CLIENT_URL || "http://localhost:8081"

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: [clientURL, "myapp://*", "exp://*"],
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },
    plugins: [expo()],
    advanced: {
        ipAddress: {
            ipAddressHeaders: ["x-forwarded-for"],
        }
    }
});