import { z } from "zod";
import DriveContent from "~/app/f/[folderId]/drive-content";
import { QUERIES } from "~/server/db/queries";
import { auth } from "~/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers"
import { Suspense } from "react";
import { DriveContentSkeleton } from "~/components/ui/drive-content-skeleton";

export default function DrivePage(props: {
    params: Promise<{ folderId: string }>
}) {
    return (
        <Suspense fallback={<DriveContentSkeleton />}>
            <SuspendedDrivePage params={props.params} />
        </Suspense>
    );
}

async function SuspendedDrivePage({ params }: {
    params: Promise<{ folderId: string }>
}) {
    const params_data = await params;

    const { data, success } = z
        .object({
            folderId: z.coerce.number(),
        })
        .safeParse(params_data);

    if (!success) return <div>Invalid folder ID</div>;

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user?.id) return redirect("/sign-in");

    const [folders, files, parents] = await Promise.all([
        QUERIES.getFolders(data.folderId),
        QUERIES.getFiles(data.folderId),
        QUERIES.getAllParentsForFolder(data.folderId),
    ]);

    return (
        <DriveContent
            files={files}
            folders={folders}
            parents={parents}
            currentFolderId={data.folderId}
        />
    );
}
