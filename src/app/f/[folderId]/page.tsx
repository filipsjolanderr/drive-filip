import { z } from "zod";
import DriveContent from "~/app/f/[folderId]/drive-content";
import { QUERIES } from "~/server/db/queries";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DriveSidebar } from "./sidebar";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import { cookies } from "next/headers"
import { Suspense } from "react";
import { DriveContentSkeleton } from "./drive-content-skeleton";

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

    const session = await auth();

    if (!session.userId) return redirect("/sign-in");


    const parsedFolderId = data.folderId;
    const [folders, files, parents, storageUsed, storageTotal] = await Promise.all([
        QUERIES.getFolders(parsedFolderId),
        QUERIES.getFiles(parsedFolderId),
        QUERIES.getAllParentsForFolder(parsedFolderId),
        QUERIES.getStorageUsed(session.userId),
        2147483648
    ]);

    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <DriveSidebar currentFolderId={parsedFolderId} storageUsed={storageUsed} storageTotal={storageTotal} />

            <div className="p-4 w-full">
                <Suspense fallback={<DriveContentSkeleton />}>
                    <DriveContent
                        files={files}
                        folders={folders}
                        parents={parents}
                        currentFolderId={parsedFolderId}
                    />
                </Suspense>
            </div>
        </SidebarProvider>
    );
}
