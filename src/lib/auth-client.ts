"use client";
import { createAuthClient } from "better-auth/react";
import {
    twoFactorClient,
    adminClient,
    multiSessionClient,
    oidcClient,
    genericOAuthClient,
    customSessionClient,
} from "better-auth/client/plugins";
import { toast } from "sonner";
import type { auth } from "./auth";

export const authClient = createAuthClient({
    plugins: [
        twoFactorClient({
            onTwoFactorRedirect() {
                window.location.href = "/two-factor";
            },
        }),
        adminClient(),
        multiSessionClient(),
        oidcClient(),
        genericOAuthClient(),
        customSessionClient<typeof auth>(),
    ],
    fetchOptions: {
        onError(e) {
            if (e.error?.status === 429) {
                toast.error("Too many requests. Please try again later.");
            }
        },
    },
});

export const {
    signUp,
    signIn,
    signOut,
    useSession, // This must be used inside a component
    $Infer
} = authClient;
