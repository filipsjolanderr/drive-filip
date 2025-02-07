import { auth } from "~/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { MUTATIONS, QUERIES } from "~/server/db/queries";
import { headers } from "next/headers";
import { authClient } from "~/lib/auth-client";

export default async function DrivePage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user?.id) {
        return redirect("/sign-in");
    }

    const rootFolder = await QUERIES.getRootFolderForUser(session.user.id);


    if (!rootFolder) {
        return (
            <form
                action={async () => {
                    "use server";
                    const session = await auth.api.getSession({
                        headers: await headers()
                    });


                    if (!session?.user?.id) {
                        return redirect("/sign-in");
                    }

                    await authClient.multiSession.setActive({
                        sessionToken: session.session.id
                    })

                    const rootFolderId = await MUTATIONS.onboardUser(session.user.id);


                    return redirect(`/f/${rootFolderId}`);
                }}
            >
                <Button>Create new Drive</Button>
            </form>
        );
    }

    return redirect(`/f/${rootFolder.id}`);
}
