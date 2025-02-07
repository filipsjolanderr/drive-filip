import { z } from "zod";
import DriveContent from "~/app/f/[folderId]/drive-content";
import { QUERIES } from "~/server/db/queries";
import { auth } from "~/lib/auth";
import { redirect } from "next/navigation";
import { DriveSidebar } from "./sidebar";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import { headers } from "next/headers"
import { Suspense } from "react";

export const experimental_ppr = true

export default async function DrivePage(props: {
    params: Promise<{ folderId: string }>
}) {
    const params = await props.params;

    const { data, success } = z
        .object({
            folderId: z.coerce.number(),
        })
        .safeParse(params);

    if (!success) return <div>Invalid folder ID</div>;

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user?.id) return redirect("/sign-in");

    const [folders, files, parents, storageUsed, storageTotal] = await Promise.all([
        QUERIES.getFolders(data.folderId),
        QUERIES.getFiles(data.folderId),
        QUERIES.getAllParentsForFolder(data.folderId),
        QUERIES.getStorageUsed(session.user.id),
        2147483648
    ]);

    return (
        <Suspense key={data.folderId} fallback={<div>Loading...</div>}>
            <DriveContent
                files={files}
                folders={folders}
                parents={parents}
                currentFolderId={data.folderId}
            />
        </Suspense>
    );
}
