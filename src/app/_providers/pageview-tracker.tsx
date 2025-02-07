"use client";

import { usePostHog } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "~/lib/auth-client";


export default function PostHogPageView(): null {
    const posthog = usePostHog();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const {
        data: session,
        isPending, //loading state
        error //error object
    } = authClient.useSession() 

    useEffect(() => {
        if (session?.user?.id) {
            posthog.identify(session.user.id, {
                email: session.user.email,
            });
        } else {
            posthog.reset();
        }
    }, [posthog, session]);

    // Track pageviews
    useEffect(() => {
        if (pathname && posthog) {
            let url = window.origin + pathname;
            if (searchParams.toString()) {
                url = url + `?${searchParams.toString()}`;
            }

            posthog.capture("$pageview", { $current_url: url });
        }
    }, [pathname, searchParams, posthog]);

    return null;
}
