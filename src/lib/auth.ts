import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "~/server/db";
import { betterAuth } from "better-auth";
import {
    bearer,
    admin,
    multiSession,
    twoFactor,
    oneTap,
    oAuthProxy,
    openAPI,
    oidcProvider,
    username,
    customSession,
} from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "./email/sendEmail";
import { VerifyEmail } from "./email/verify-email";
import { OTP } from "./email/OTP";
import { ResetPasswordEmail } from "./email/rest-password";
import { QUERIES } from "~/server/db/queries";
import { account_table, verification_table, user_table, session_table } from "~/server/db/schema";





export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: {
            user: user_table,
            account: account_table,
            session: session_table,
            verification: verification_table,

        }
    }),

    emailVerification: {
        sendOnSignUp: true,
        async sendVerificationEmail({ user, url }) {
            await sendEmail({
                to: user.email,
                subject: "Verify your email address",
                component: VerifyEmail({ email: user.email, verifyLink: url }),
            });
        },
    },
    account: {
        accountLinking: {
            trustedProviders: ["github"],
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60 // Cache duration in seconds
        }
    },
    emailAndPassword: {
        requireEmailVerification: true,
        enabled: true,
        async sendResetPassword({ user, url }) {
            await sendEmail({
                to: user.email,
                subject: "Reset your password",
                component: ResetPasswordEmail({ username: user.email, resetLink: url }),
            });
        },
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }
    },
    plugins: [
        twoFactor({
            otpOptions: {
                async sendOTP({ user, otp }) {
                    await sendEmail({
                        to: user.email,
                        subject: "Your OTP",
                        component: OTP({ otp: otp }),
                    });
                },
            },
        }),
        openAPI(),
        bearer(),
        admin(),
        multiSession(),
        oAuthProxy(),
        nextCookies(),
        oidcProvider({
            loginPage: "/sign-in",
        }),
        customSession(async ({ user, session }) => {
            const email = await QUERIES.getEmailByUserId(session.userId);
            return {
                user: {
                    ...user,
                    email: email,
                },
                session
            };
        }),
    ],
});
