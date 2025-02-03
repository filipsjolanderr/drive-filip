// This is a Server Component
import { QUERIES } from "~/server/db/queries";
import { auth } from "@clerk/nextjs/server";
import DriveContent from "./drive-content";
import { Suspense } from "react";
import { DriveContentSkeleton } from "./drive-content-skeleton";
import { redirect } from "next/navigation";

export async function DriveContentWrapper({ folderId }: { folderId: number }) {
    const session = await auth();

    if (!session.userId) return redirect("/sign-in");

    const [folders, files, parents, storageUsed, storageTotal] = await Promise.all([
        QUERIES.getFolders(folderId),
        QUERIES.getFiles(folderId),
        QUERIES.getAllParentsForFolder(folderId),
        QUERIES.getStorageUsed(session.userId),
        2147483648
    ]);

    return (
        <DriveContent
            files={files}
            folders={folders}
            parents={parents}
            currentFolderId={folderId}
            storageUsed={storageUsed}
            storageTotal={storageTotal}
        />
    );
} 
